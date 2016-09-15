// const roleManager = require('role.manager');
const role = 'mover';

const roleMover = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.bootstrap === undefined) {
            this.bootstrap(creep);
        }

        // const creepSettings = roleManager.getCreepSettings(creep);
        // this.echo(creep, creepSettings);
// console.log(`roleHarvester starts`);
        if(creep.carry.energy < creep.carryCapacity) {
            // const harvesterCreep = Game.creeps['Aubrey'];
            //
            // var target = harvesterCreep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
            //
            // if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(target);
            // }
        }
        else {
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType == STRUCTURE_EXTENSION ||
            //             structure.structureType == STRUCTURE_SPAWN ||
            //             structure.structureType == STRUCTURE_TOWER) &&
            //             structure.energy < structure.energyCapacity;
            //     }
            // });
            //
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0]);
            //     }
            // }
            // else {
            //     if (creep.pos.x != 26 && creep.pos.y == 22) {
            //         creep.moveTo(26, 22);
            //     }
            //     else {
            //         creep.drop(RESOURCE_ENERGY);
            //     }
            // }
        }
    },

    bootstrap(creep) {




        // creep.memory.bootstrap = true;
    }

    // echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${creepSettings.model} ${role}`)}

};

module.exports = roleMover;
