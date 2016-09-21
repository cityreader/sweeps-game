const Role = require('Role');

var defaultMaxCreepNum = 10;

const roleSettings = {
    harvester : {
        weight: 0.3,
        body: [
            [WORK, CARRY, MOVE], // 200
            [WORK, WORK, CARRY, MOVE], // 300
            [WORK, WORK, WORK, CARRY, MOVE], // 400
            // [WORK, WORK, WORK, WORK, CARRY, MOVE], // 500
        ],
        max: 3,
    },
    mover : {
        weight: 0.2,
        body: [
            // [CARRY, MOVE], // 100
            [CARRY, CARRY, MOVE], // 150
            // [CARRY, CARRY, MOVE, CARRY, MOVE], // 250
            // [CARRY, CARRY, CARRY, MOVE, CARRY, MOVE], // 300,
            // [CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], // 400
        ],
        max: 2,
    },
    upgrader : {
        weight: 0.3,
        body: [
            // [WORK, CARRY, MOVE], // 200
            [WORK, WORK, CARRY, MOVE], // 300
            [WORK, MOVE, WORK, CARRY, MOVE], // 350
            [WORK, WORK, MOVE, WORK, CARRY, MOVE], // 450
            [WORK, WORK, WORK, MOVE, WORK, CARRY, MOVE], // 550
            [WORK, WORK, MOVE, WORK, MOVE, WORK, CARRY, MOVE], // 650
            [WORK, WORK, WORK, WORK, MOVE, WORK, MOVE, WORK, CARRY, MOVE], // 850
        ],
        max: 3,
    },
    builder : {
        weight: 0.1,
        body: [
            [WORK, CARRY, MOVE], // 200
            [WORK, WORK, CARRY, MOVE], // 300
            [WORK, CARRY, MOVE, WORK, CARRY, MOVE], // 400
        ],
        max: 1,
    },
    repairer : {
        weight: 0.1,
        body: [
            [WORK, CARRY, MOVE], // 200
            [WORK, WORK, CARRY, MOVE], // 300
            [WORK, CARRY, MOVE, WORK, CARRY, MOVE], // 400
        ],
        max: 1,
    }
}

class RoleController {

    constructor(settings) {
        this.roles = {};

        _.forEach(settings, (_settings, roleName) => {
            this.roles[roleName] = new Role(roleName, _settings, defaultMaxCreepNum);
        });

        this.memory.priority = this.memory.priority || 0;

        this.calculateTotalCap();
    }

    get memory() {
        if (_.isUndefined(Memory.roleController)) {
            Memory.roleController = {};
        }

        if (!_.isObject(Memory.roleController)) {
            return undefined;
        }

        return Memory.roleController;
    }

    set memory(value) {
        if (_.isUndefined(Memory.roleController)) {
            Memory.roleController = {};
        }

        if (!_.isObject(Memory.roleController)) {
            throw new Error('Could not set role controller memory');
        }

        Memory.roleController = value;
    }

    get names() {
        return Object.keys(this.settings);
    }

    getRolesWithoutCap() {
        if (this._rolesWithoutCap === undefined) {
            this._rolesWithoutCap = _.forEach(this.roles, (role) => role.max === 0);;
        }
        return this._rolesWithoutCap;
    }

    calculateTotalCap() {
        const flush = _.isUndefined(Memory.totalMax) ||
                      Memory.totalMax != defaultMaxCreepNum ||
                      Memory.flush;

        if (!flush) {
            return;
        }

        const panOutTargetNum = (total) => {
            _.forEach(rolesWithoutCap, (role) => {
                role.memory.cap;
                total++;

                if (total >= role.totalMax) {
                    return false;
                }
            });

            if (total < role.totalMax) {
                panOutTargetNum(total);
            }
        }

        const rolesWithoutCap = this.getRolesWithoutCap();
        var total = 0;

        _.forEach(this.roles, (role) => {
            total += role.calculateCap();
        });

        if (rolesWithoutCap.length > 0) {
            panOutTargetNum(total);
        }
    }

    getTotalCap() {
        if (_.isUndefined(this._totalCap)) {
            this._totalCap = 0;
            _.forEach(this.roles, (role) => this._totalCap += role.memory.cap);
        }
        return this._totalCap;
    }

    getTotalCreepNum() {
        return Object.keys(Game.creeps).length;
    }

    isPriority(pointer) {
        return this.memory.priority === pointer;
    }

    priorityMoveToNext() {
        this.memory.priority++;

        if (this.memory.priority == Object.keys(this.roles).length) {
            this.memory.priority = 0;
        }
    }

}

class CreepManager {
    constructor() {
        this.roleController = new RoleController(roleSettings);
    }

    run(spawn) {
        this.keep(spawn);
    }

    keep(spawn) {
        if (this.roleController.getTotalCreepNum() >= this.roleController.getTotalCap()) {
            // console.log(`${this.roleController.getTotalCreepNum()} >= ${this.roleController.getTotalCap()}`);
            return;
        }
        else {
            // console.log(`getTotalCreepNum ${this.roleController.getTotalCreepNum()}`);
        }

        var pointer = 0;
        const roleController = this.roleController;

        _.forEach(roleController.roles, (role) => {
            if (roleController.isPriority(pointer)) {
                if (role.isCapacityFull()) {
                    roleController.priorityMoveToNext();
                }
                else {
                    let result = this.createCreep(spawn, role.name);
                    if (result !== false) {
                        roleController.priorityMoveToNext();
                    }

                    return false;
                }
            }

            pointer++;
        });
    }

    createCreep(spawn, roleName) {
        if (spawn.spawning) {
            return false;
        }

        const body = this.getBody(roleName, spawn.room);

        if (!this.isEnergyEnough(spawn.room, body)) {
            return false;
        }

        const result = spawn.createCreep(body, undefined, {role: roleName});

        console.log(`createCreep: ${roleName} result ${result}`)

        if (_.isString(result)) {
            console.log(`[${roleName} ${result}] is created ${body}.`);
        }
        else {
            console.log(`Cannot create creep ${roleName}, error ${result}`);
            return false;
        }

    }

    getBody(roleName, room) {
        var body = roleSettings[roleName].body[0];

        if (roleSettings[roleName].body.length > 1) {
            var bodyEnergyCost;

            roleSettings[roleName].body.forEach(_body => {
                bodyEnergyCost = this.calculateBodyEnergyCost(_body);

                if (bodyEnergyCost  < room.energyAvailable - 100) {

                    if (roleName == 'harvester') {
                        const maxWorkParts = 10;
                        var workParts = 0;

                        _.forEach(Game.creeps, creep => {
                            if (creep.memory.role == 'roleName') {
                                creep.body.forEach(part => part.type==WORK && workParts++);
                            }
                        });

                        if (workParts > maxWorkParts) {
                            return false;
                        }
                    }


                    body = _body;
                }
                else {
                    return false;
                }
            });

        }

        return body;
    }

    calculateBodyEnergyCost(body) {
        const bodyCost = {
            'move': 50,
            'work': 100,
            'carry': 50,
            'attack': 80,
            'ranged_attack': 150,
            'heal': 250,
            'claim': 600,
            'tough': 10,
        };

        return body.reduce((energy, part) => energy + bodyCost[part], 0);
    }

    isEnergyEnough(room, body) {
        console.log(`body ${body} room.energyAvailable ${room.energyAvailable}`);
        return room.energyAvailable >= this.calculateBodyEnergyCost(body);
    }

}

module.exports = CreepManager;
