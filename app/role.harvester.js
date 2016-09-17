const creepManager = require('creep.manager');
// const roleManager = require('role.manager');
const role = 'harvester';

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        this.bootstrap(creep);

        this.checkHealth(creep);

        if(creep.carry.energy < creep.carryCapacity) {
            // creep.say('harvesting');
            var target =  Game.getObjectById(creep.memory.sourceId);
            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else {
                if (creep.memory.moveTicks === undefined) {
                    creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
                }
            }
        }
        else {
            creep.drop(RESOURCE_ENERGY);

            // // Move to Flag2 to not occupy mining place.
            // // creep.moveTo(Game.flags.Flag2);
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType == STRUCTURE_EXTENSION ||
            //             structure.structureType == STRUCTURE_SPAWN ||
            //             structure.structureType == STRUCTURE_TOWER) &&
            //             structure.energy < structure.energyCapacity;
            //     }
            // });
            //
            // console.log(`targets.length ${targets.length}`);
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0]);
            //     }
            // }
        }

    },

    bootstrap(creep) {

        if (creep.memory.sourceId === undefined) {
            var sources = creep.room.find(FIND_SOURCES);

            sources = _.filter(sources, (source) => {
                console.log(`source.id ${source.id}`);
                let memory = Memory.sources[source.id];

                console.log(`memory.workers.length ${memory.workers.length}`);
                console.log(`memory.capacity ${memory.capacity}`);
                return memory.workers.length < memory.capacity;
            })

            _.forEach(sources, (source) => {
                console.log(`2 source.id ${source}`);
                console.log(`source ${Object.keys(source).join(', ')}`)
                var memory = Memory.sources[source.id];
                console.log(`memory ${Object.keys(memory).join(', ')}`)
                memory.workers.push(creep.id);
                creep.memory.sourceId = source.id;
                return false;
            });
        }


        if (creep.memory.fullTicks) {
            creep.memory.fullTicks = creep.ticksToLive;
        }
    },

    checkHealth(creep) {
        const createTicks = 20;

        if (creep.ticksTolive <= creep.memory.moveTicks + createTicks) {
            Memory.sources[creep.memory.sourceId].delete(creep.id);

            const spawns = creep.room.find(FIND_MY_SPAWNS);


            creepManager.createCreep(spawns[0], creep.memory.role);
        }
    }

};

module.exports = roleHarvester;
