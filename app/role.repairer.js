const roleRepairer = {

    run(creepControl) {
        const creep = creepControl.creep;
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }

        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('repairing');
        }

        if(creep.memory.building) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax && object.structureType != STRUCTURE_WALL
            });

            targets.sort((a,b) => a.hits - b.hits);

            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
            // Nothing to repair, build construction instead.
            else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    }
                }
            }

        }
        else {
            const carryCapacity = this.carryCapacity(creep);

            // Harvest energy when room energy is not enough for creating an extra creep.
            if (true || (carryCapacity + 600 > creep.room.energyAvailable)) {
                var containers = creep.room.find(FIND_STRUCTURES,
                    {filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 100
                    });

                // Fetch energy from container.
                if (containers.length > 0) {
                    containers = containers.filter(container => container.store);
                    containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])

                    if (containers[0].transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                    }
                    else {
                        creep.say('Container transferring');
                    }
                }
                else {
                    var targets = creep.room.find(FIND_DROPPED_RESOURCES);
                    // Pickup dropped energy.
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
                            // Harvest
                            if (source.memory.workers.length < source.memory.capacity) {
                                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(source);
                                }
                            }
                        });

                    }
                }

            }
            // Pick up or withdraw energy from closest place.
            else {
                const controllerId = creep.room.controller.id;
                const energySourceId = Memory.controllers[controllerId];
                const energySource = Game.getObjectById(energySourceId);

                if (energySource.energyCapacity !== undefined) {
                    if(creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energySource);
                    }
                }
                else {
                    creep.say('Withdrawing');
                }

            }
        }

        if (creep.memory.lastTick != Game.time - 1) {
            console.log(creep.name + " missed a tick!");
        }
        creep.memory .lastTick = Game.time;
    },

    carryCapacity(creep) {
        const carryPartNum = creep.body.filter(part => part.type == CARRY).length;
        return carryPartNum * 50;
    },

};


module.exports = roleRepairer;
