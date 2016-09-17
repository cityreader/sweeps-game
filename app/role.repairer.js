const role = 'repairer';

const roleRepairer = {

        /** @param {Creep} creep **/
        run: function(creep) {

            if(creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
                creep.say('harvesting');
            }
            if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('repairing');

                // creep.moveTo(Game.flags.Flag2);
            }

            if(creep.memory.building) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });

                targets.sort((a,b) => a.hits - b.hits);

                if(targets.length > 0) {
                    if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }

            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[creepSettings.source]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[creepSettings.source]);
                }
            }
        },

};


module.exports = roleRepairer;
