const roleCordinator = {
    harvester : {
        weight: 0.3,
        body: [
            [WORK, CARRY, MOVE],
        ]
    },
    mover : {
        weight: 0.3,
        body: [
            [CARRY, MOVE],
        ]
    },
    upgrader : {
        weight: 0.3,
        body: [
            [WORK, CARRY, MOVE],
        ]
    },
    builder : {
        weight: 0.3,
        body: [
            [WORK, CARRY, MOVE],
        ]
    }
}

class CreepController {
    constructor(obj, opt) {

        console.log(`CreepController: constructor starts`);

        this.obj = obj;
        this.opt = Object.assign({}, this.getDefaultOpt(), opt);

        this.create();

        console.log(`CreepController: constructor completed`);
    }

    getDefaultOpt() {
        return {}
    }

    getRole() {
        return false;
    }

    echo() {
        // echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${creepSettings.model} ${role}`)}
    }

    create() {

        console.log(`CreepController: create starts`);

        const role = this.getRole();

        if (role) {
            const body = this.getBody();
            const spawn = this.obj.spawn;
            const role = this.getRole();

            const result = spawn.canCreateCreep(body);

            console.log(`CreepController: canCreateCreep result ${result}`);

            if (result == OK) {
                const newName = spawn.createCreep(body, undefined, {role});
                console.log(`[${role} ${newName}] is created.`);

                var creep;

                _.forEach(Game.creeps, (_creep, name) => {
                    if (name == newName) {
                        creep = _creep;
                    }
                });

                this.creep = creep;
            }
            else {
                console.log(`Cannot create creep, error ${result}`);
            }








        }
        //     const createCreep = (spawn, role, model, body = [WORK,CARRY,MOVE], name) => {
        //         const newName = spawn.createCreep(body, name, {role, model});
        //         console.log(`New ${role} creep is created, name: ${newName}.`);
        //     }


        console.log(`CreepController: create completed`);
    }

    getBody() {
        const role = this.getRole();
        return roleCordinator[role].body[0];
    }
}

class HarvesterController extends CreepController {
    constructor(obj, opt) {

        console.log(`HarvesterController: constructor starts`);

        super(obj, opt);

        console.log(`HarvesterController: constructor completed`);
    }

    getDefaultOpt() {
        return {
            at: this.obj.sources[0]
        }
    }

    getRole() {
        return 'harvester';
    }

    run() {

        // const creepSettings = roleManager.getCreepSettings(creep);
        // this.echo(creep, creepSettings);

        const at = this.opt.at;

        if(this.creep.carry.energy < this.creep.carryCapacity) {
            if(creep.harvest(opt.source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(at.x, at.y);
            }
        }
        else {

            this.creep.drop(RESOURCE_ENERGY);
            // // Move to Flag2 to not occupy mining place.
            // creep.moveTo(Game.flags.Flag2);
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType == STRUCTURE_EXTENSION ||
            //             structure.structureType == STRUCTURE_SPAWN ||
            //             structure.structureType == STRUCTURE_TOWER) &&
            //             structure.energy < structure.energyCapacity;
            //     }
            // });
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0]);
            //     }
            // }
        }
    }




}

class MoverController extends CreepController {

    constructor(opt) {
        super(opt);

    }

    getRole() {
        return 'harvester';
    }
}

class UngraderController extends CreepController {

    constructor(opt) {
        super(opt);

    }

    getRole() {
        return 'harvester';
    }

}

class BuilderController extends CreepController {

    constructor(opt) {
        super(opt);

    }

    getRole() {
        return 'harvester';
    }
}

class CreepManager {
    constructor(obj) {

        console.log(`CreepManager: constructor starts`);

        this.obj = obj;

        if (this.creepControllers === undefined) {
            this.creepControllers = [];
        }

        console.log(`CreepManager: constructor completed`);
    }

    create(role, ops = {}) {

        console.log(`CreepManager: create starts`);

        var newCreepController;

        switch (role) {
            case 'harvester':
                newCreepController = new HarvesterController(this.obj, ops);
                break;

            case 'mover':
                newCreepController = new MoverController(this.obj, ops);
                break;

            case 'upgrader':
                newCreepController = new UpgraderController(this.obj, ops);
                break;

            case 'builder':
                newCreepController = new BuilderController(this.obj, ops);
                break;
        }

        this.creepControllers.push(newCreepController);

        console.log(`CreepManager: create completed`);
    }
    
    run() {
        _.forEach(this.creepControllers, (creepController) => {
            creepController.run();
        });
    }

}



module.exports = CreepManager;
