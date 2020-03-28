const creepManager = require('creep.manager');
const Role = require('Role');
const RoleBase = require('role-base');

class RoleHarvester extends RoleBase {

    run(creepControl) {
        const creep = creepControl.creep;
        this.bootstrap(creep);

        this.checkHealth(creepControl);

        if (creep.carry.energy < creep.carryCapacity) {
            // creep.say('harvesting');

            var target;

            if (creep.memory.sourceId) {
                target = Game.getObjectById(creep.memory.sourceId);
            }
            else {
                let targets = creep.room.find(FIND_SOURCES);
                target = targets[0];
            }

            if (target.energy == 0) {
                let targets = creep.room.find(FIND_SOURCES, {
                    filter: t => t.energy > 0,
                });
                target = targets[0];
            }

            if(creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            else {
                if (!creep.memory.moveTicks) {
                    creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
                }
            }
        }
        else {
            const moverRole = new Role(creep.spawn, 'mover');

            // Drop energy when there is a mover.
            if (moverRole.creepNum >= 1) {
                var containers = creep.pos.findInRange(FIND_STRUCTURES, 1,
                    {filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                                    _.sum(i.store) < i.storeCapacity});

                if (containers.length == 0) {
                    containers = creep.room.find(FIND_STRUCTURES,
                        {filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                        _.sum(i.store) < i.storeCapacity
                        });
                }

                if (containers.length > 0) {
                    if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0]);
                        // creep.drop(RESOURCE_ENERGY);
                        // creep.say('Dropping');
                    }
                    else {
                        creep.say('Transferring');
                    }

                }
                else {
                    creep.drop(RESOURCE_ENERGY);
                    creep.say('Dropping');
                }

            }
            //
            else {
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

        }

        if (creep.memory.lastTick != Game.time - 1) {
            console.log(creep.name + " missed a tick!");
        }
        creep.memory .lastTick = Game.time;

    }

    bootstrap(creep) {
        if (creep.memory.booted && !Memory.flush) {
            return;
        }

        console.log(`${creep} booting`);

        const sources = creep.room.find(FIND_SOURCES);

        for (const source of sources) {
            if (source.memory.blocked) {
                break;
            }

            let cap = source.memory.max || source.memory.capacity;
            if (source.memory.workers.length < cap) {

                source.memory.workers.push(creep.id);
                creep.memory.sourceId = source.id;
                break;
            }
        }

        if (!creep.memory.fullTicks) {
            creep.memory.fullTicks = creep.ticksToLive;
        }

        creep.memory.booted = true;
    }
}

const roleHarvester = new RoleHarvester();

module.exports = roleHarvester;
