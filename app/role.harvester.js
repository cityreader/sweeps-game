const creepManager = require('creep.manager');

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
                if (_.isUndefined(creep.memory.moveTicks)) {
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

        if (_.isUndefined(creep.memory.sourceId)) {
            var sources = creep.room.find(FIND_SOURCES);

            sources = _.filter(sources, (source) => {
                let memory = Memory.sources[source.id];
                return memory.workers.length < memory.capacity;
            })

            _.forEach(sources, (source) => {
                source.memory.workers.push(creep.id);
                creep.memory.sourceId = source.id;
                return false;
            });
        }


        if (_.isUndefined(creep.memory.fullTicks)) {
            creep.memory.fullTicks = creep.ticksToLive;
        }
    },

    checkHealth(creep) {
        const ticksToBuild = this.ticksToBuild(creep);

        if (creep.ticksTolive <= creep.memory.moveTicks + ticksToBuild) {
            const source = Game.getObjectById(creep.memory.sourceId);
            source.memory.workers = source.workers.filter(creepId => creepId != creep.id);

            const spawns = creep.room.find(FIND_MY_SPAWNS);
            creepManager.createCreep(spawns[0], creep.memory.role);
        }
    },

    ticksToBuild(creep) {
        const spawnTime = 3;
        return creep.body.length * spawnTime;
    }

};

module.exports = roleHarvester;
