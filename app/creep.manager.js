var defaultMaxCreepNum = 9;

const roleSettings = {
    harvester : {
        weight: 0.3,
        body: [
            [WORK, CARRY, MOVE],
        ],
        max: 3,
    },
    mover : {
        weight: 0.2,
        body: [
            [CARRY, MOVE],
        ],
        max: 3,
    },
    upgrader : {
        weight: 0.3,
        body: [
            [WORK, CARRY, MOVE],
        ],
        max: 3,
    },
    // builder : {
    //     weight: 0.2,
    //     body: [
    //         [WORK, CARRY, MOVE],
    //     ],
    //     max: 3,
    // },
    // repairer : {
    //     weight: 0.2,
    //     body: [
    //         [WORK, CARRY, MOVE],
    //     ],
    //     max: 3,
    // }
}

class RolesReport {

    constructor(settings) {
        this.settings = settings;
    }

    get names() {
        return Object.keys(this.settings);
    }

    getRolesWithNoCap() {
        if (this._rolesWithNoCap === undefined) {
            this._rolesWithNoCap =  _.filter(this.settings, (_settings, role) => _settings.max === undefined);
        }
        return this._rolesWithNoCap;
    }

    getTargetRoleMap() {
        const rolesWithNoCap = this.getRolesWithNoCap();
        var map = new Map();
        var total = 0;

        const panOutTargetNum = (map, total, maxCreepNum) => {
            _.forEach(rolesWithNoCap, (settings, role) => {
                map.set(role, map.get(role) + 1);
                total++;

                if (total >= maxCreepNum) {
                    return false;
                }
            });

            return (total >= maxCreepNum) ? map : panOutTargetNum(map, total, maxCreepNum);
        }

        _.forEach(this.settings, (_settings, role) => {

            let num = Math.ceil(defaultMaxCreepNum * _settings.weight);

            if (_settings.max !== undefined && num > _settings.max ) {
                num = _settings.max;
            }

            map.set(role, num);
            total += num;
        });

        if (rolesWithNoCap.length > 0) {
            map = panOutTargetNum(map, total, defaultMaxCreepNum);
        }

        return map;
    }

    getValidCreepMaxNum() {
        const targetRoleMap = this.getTargetRoleMap();

        var maxNum = 0;

        for (let entry of targetRoleMap) {
            maxNum += entry[1];
        }

        return maxNum;
    }

    getCurrentRoleMap() {
        var map = new Map();

        this.names.forEach((role) => {
            map.set(role, 0);
        });

        _.forEach(Game.creeps, (creep) => {
            let role = creep.memory.role;
            map.set(role, map.get(role) + 1);
        });

        return map;
    }

}

const creepManager = {

    run(spawn) {
        this.keep(spawn);
    },

    keep(spawn) {

        const createNextCreep = (targetRoleMap, currentRoleMap, roleNames, creepMaxNum, totalCreepNum) => {
            // console.log(`createNextCreep starts`)

            var result;

            for (let entry of targetRoleMap) {
                let role = entry[0];

                console.log(`Memory.rolePriority ${Memory.rolePriority}`);
                console.log(`role ${role}`);
                console.log(`roleNames ${roleNames.join(', ')}`);
                console.log(`currentCountRoles.get(${role}) ${currentRoleMap.get(role)}`);


                if (roleNames[Memory.rolePriority] === role) {
                    console.log(`createNextCreep: match role ${role}`);

                    // console.log(`Memory.rolePriority2 ${Memory.rolePriority}`);

                    let targetNum = entry[1];
                    let currentNum = currentRoleMap.get(role);

                    console.log(`targetNum ${targetNum}`);
                    console.log(`currentNum ${currentNum}`);

                    if (currentNum < targetNum) {
                        result = this.createCreep(spawn, role);

                        if (result !== false ) {
                            // currentCountRoles.set(role, currentCountRoles.get(role) + 1);
                            // totalCreepNum += 1;

                            Memory.rolePriority++;
                            if (Memory.rolePriority == roleNames.length) {
                                Memory.rolePriority = 0;
                            }
                        }

                        break;
                    }
                    else {
                        Memory.rolePriority++;
                        if (Memory.rolePriority == roleNames.length) {
                            Memory.rolePriority = 0;
                        }
                    }

                }
            }

            // console.log(`result ${result}`);
            // console.log(`totalCreepNum ${totalCreepNum}`);
            // console.log(`creepMaxNum ${creepMaxNum}`);

            if (result === false) {
                return;
            }
            else if (totalCreepNum < creepMaxNum) {
                createNextCreep(targetRoleMap, currentRoleMap, roleNames, creepMaxNum, totalCreepNum);
            }

        }

        const roleReport = new RolesReport(roleSettings);

        const roleNames      = roleReport.names;
        const targetRoleMap  = roleReport.getTargetRoleMap();
        const currentRoleMap = roleReport.getCurrentRoleMap();
        const creepMaxNum    = roleReport.getValidCreepMaxNum();


        var totalCreepNum = Object.keys(Game.creeps).length;

        if (Memory.rolePriority === undefined) {
            Memory.rolePriority = 0;
        }

        createNextCreep(targetRoleMap, currentRoleMap, roleNames, creepMaxNum, totalCreepNum);

    },

    createCreep(spawn, role) {

        console.log(`createCreep starts role ${role}`);

        const body = this.getBody(role);

        const result = spawn.canCreateCreep(body);

        console.log(`createCreep: canCreateCreep ${role} result ${result}`)

        if (result == OK) {
            const newName = spawn.createCreep(body, undefined, {role});
            console.log(`[${role} ${newName}] is created.`);

            var creep;

            _.forEach(Game.creeps, (_creep, name) => {
                if (name == newName) {
                    creep = _creep;
                }
            });
            // return false;
            return creep;
        }
        else {
            console.log(`Cannot create creep, error ${result}`);

            return false;
        }

    },

    getBody(role) {
        return roleSettings[role].body[0];
    },

}

module.exports = creepManager;
