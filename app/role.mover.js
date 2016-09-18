const role = 'mover';

const roleMover = {

    /** @param {Creep} creep **/
    run: function(creep) {
        this.bootstrap(creep);

        if (creep.memory.transferring) {
            creep.memory.transferring = (creep.carry.energy != 0);
        } else {
            creep.memory.transferring = (creep.carry.energy == creep.carryCapacity);
        }

        if (creep.memory.transferring) {
            var targets = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => s.energyCapacity !== undefined && s.energy < s.energyCapacity && s.structureType != STRUCTURE_STORAGE
            });

            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }

        }
        else {
            var targets = creep.room.find(FIND_DROPPED_ENERGY);
            if (targets.length > 0) {
                targets.sort((a, b) => b.energy - a.energy)

                if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
                else {
                    if (_.isNull(creep.memory.moveTicks)) {
                        creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
                    }
                }

            }
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
        if (creep.memory.booted) {
            return;
        }

        if (_.isUndefined(creep.memory.sourceId)) {
            const sources = creep.room.find(FIND_SOURCES);

            _.forEach(sources, (source) => {
                if (!source.memory.blocked &&
                    !source.memory.moverId &&
                    source.memory.workers.length > 0) {

                    source.memory.moverId = creep.id;
                    creep.memory.sourceId = source.id;
                    return false;
                }
              });
        }

        if (_.isUndefined(creep.memory.fullTicks)) {
            creep.memory.fullTicks = creep.ticksToLive;
        }

        creep.memory.booted = true;
    },

    checkHealth(creep) {
        const ticksToBuild = this.ticksToBuild(creep);

        if (creep.ticksTolive <= creep.memory.moveTicks + ticksToBuild) {
            const source = Game.getObjectById(creep.memory.sourceId);
            source.memory.moverId = null;

            const spawns = creep.room.find(FIND_MY_SPAWNS);
            creepManager.createCreep(spawns[0], creep.memory.role);
        }
    },

};

module.exports = roleMover;
