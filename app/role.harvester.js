const roleManager = require('role.manager');
const role = 'harvester';

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // const creepSettings = roleManager.getCreepSettings(creep);
        // this.echo(creep, creepSettings);

        if(creep.carry.energy < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creepSettings.source]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creepSettings.source]);
            }
        }
        else {
            // Move to Flag2 to not occupy mining place.
            creep.moveTo(Game.flags.Flag2);
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
    },

    echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${creepSettings.model} ${role}`)}

};

module.exports = roleHarvester;
