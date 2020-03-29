const creepManager = require('creep.manager');
const RoleBase = require('role-base');

class RoleMover extends RoleBase {

    run(creepControl) {
        const creep = creepControl.creep;

        creepControl.boot();

        // creepControl.checkHealth();

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
                else {
                    creep.say('Transferring')

                    console.log(`${creep.room} energy ${creep.room.energyAvailable}`);
                }
            }

        }
        else {
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (i) =>
                    i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0
            });

            // Fetch energy from container.
            if (containers.length > 0) {
                // console.log(JSON.stringify(containers, null, '\t'))
                // containers = containers.filter(container => container.store);
                containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])

                if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0]);
                }
                else {
                    creep.say('Container transferring');
                }
            }
            else {
                var targets = creep.room.find(FIND_DROPPED_RESOURCES);
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
            }

        }

        if (creep.memory.lastTick != Game.time - 1) {
            console.log(creep.name + " missed a tick!");
        }
        creep.memory .lastTick = Game.time;

    }

    bootstrap(creep) {
        if (creep.memory.booted) {
            return;
        }
        console.log(`${creep} booting`);

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

        if (!creep.memory.fullTicks) {
            creep.memory.fullTicks = creep.ticksToLive;
        }

        creep.memory.booted = true;
    }

}

const roleMover = new RoleMover();

module.exports = roleMover;
