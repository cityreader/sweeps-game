const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');

            creep.moveTo(Game.flags.Flag2);
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
        }
        else {
            const carryCapacity = this.carryCapacity(creep);

            // Harvest energy when room energy is not enough for creating an extra creep.
            if (carryCapacity + 200 > creep.room.energyAvailable) {
                var targets = creep.room.find(FIND_DROPPED_ENERGY);
                if (targets.length > 0) {
                    targets.sort((a, b) => b.energy - a.energy)

                    if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                    else {
                        creep.say('Picking up');

                        if (!creep.memory.moveTicks) {
                            creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
                        }
                    }

                }
                else {
                    const sources = creep.room.find(FIND_SOURCES);

                    _.forEach(sources, source => {
                        if (source.memory.workers.length < source.memory.capacity) {
                            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(source);
                            }
                        }
                    });

                }
            }
            // Withdraw energy from closest place.
            else {
                const controllerId = creep.room.controller.id;
                const energySourceId = Memory.controllers[controllerId];
                const energySource = Game.getObjectById(energySourceId);

                if(creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
                else {
                    creep.say('Withdrawing');
                }
            }
            // // Pick up or withdraw energy from closest place.
            // else {
            //     const controllerId = creep.room.controller.id;
            //     const energySourceId = Memory.controllers[controllerId];
            //     const energySource = Game.getObjectById(energySourceId);
            //
            //     if (energySource.energyCapacity !== undefined) {
            //         if(creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(energySource);
            //         }
            //         else {
            //             creep.say('Withdrawing');
            //         }
            //     }
            //     else {
            //         if (creep.pickup(energySource) == ERR_NOT_IN_RANGE) {
            //             creep.moveTo(energySource);
            //         }
            //         else {
            //             creep.say('Picking up');
            //         }
            //     }
            // }

        }
    },

    carryCapacity(creep) {
        const carryPartNum = creep.body.filter(part => part.type == CARRY).length;
        return carryPartNum * 50;
    },

};


module.exports = roleBuilder;
