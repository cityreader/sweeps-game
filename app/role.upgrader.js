const RoleBase = require('role-base');

class RoleUpgrader extends RoleBase {
    
    run(creepControl) {
        const creep = creepControl.creep;
        this.boostrap(creep);

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            const carryCapacity = this.carryCapacity(creep);

            // Harvest energy when room energy is not enough for creating an extra creep.
            if (carryCapacity + 700 > creep.room.energyAvailable) {

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

                        var source;

                        _.forEach(sources, s => {
                            // Harvest
                            if (s.memory.workers.length < s.memory.capacity) {
                                source = s;
                                return false;
                            }
                        });

                        if (!source) {
                            source = sources[0];
                        }

                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source);
                        }

                    }
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

        }

        if (creep.memory.lastTick != Game.time - 1) {
            console.log(creep.name + " missed a tick!");
        }
        creep.memory .lastTick = Game.time;
    }

    boostrap(creep) {
        if (Memory.controllers === undefined) {
            Memory.controllers = {};
        }

        const controllerId = creep.room.controller.id;

        if (controllerId && Memory.controllers[controllerId] === undefined) {

            var targets = creep.room.find(FIND_SOURCES, {filter: (s,i) => i < 2});
            // var targets = _.filter(sources, (source, index) => index < 2);

            const spawns = creep.room.find(FIND_MY_SPAWNS);

            if (spawns.length > 0) {
                targets.push(spawns[0]);
            }

            // console.log(JSON.stringify(targets, null, '\t'));
            // console.log(`targets ${targets}`)
            // console.log(`creep.room.controller ${creep.room.controller}`)
            var closest = creep.room.controller.pos.findClosestByPath(targets);
            // console.log(`closest.id ${closest.id}`)
            Memory.controllers[controllerId] = closest.id;
            // console.log(`Memory.controllers[${controllerId}] ${Memory.controllers[controllerId]}`)
        }
    }

    carryCapacity(creep) {
        const carryPartNum = creep.body.filter(part => part.type == CARRY).length;
        return carryPartNum * 50;
    }

}

const roleUpgrader = new RoleUpgrader();

module.exports = roleUpgrader;
