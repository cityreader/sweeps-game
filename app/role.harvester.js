const creepManager = require('creep.manager');
const Role = require('Role');

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        this.bootstrap(creep);

        this.checkHealth(creep);

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

    },

    bootstrap(creep) {
        if (creep.memory.booted && !Memory.flush) {
            return;
        }

        console.log(`${creep} booting`);

        const sources = creep.room.find(FIND_SOURCES);

        for (let source of sources) {
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
    },

    checkHealth(creep) {
        if (!creep.memory.sourceId) {
            return;
        }

        const ticksToBuild = this.ticksToBuild(creep);



        if (!creep.memory.offspring && creep.ticksToLive <= creep.memory.moveTicks + ticksToBuild) {
            const source = Game.getObjectById(creep.memory.sourceId);

            source.memory.workers = source.memory.workers.filter(creepId => creepId != creep.id);

            const role = new Role(creep.spawn, creep.memory.role);
            if (role.creepNum + 1 > role.memory.cap) {
                return;
            }

            const spawns = creep.room.find(FIND_MY_SPAWNS);

            if (spawns.length > 0) {
                const spawn = spawns.shift();
                // creepManager.createCreep(spawn, creep.memory.role);
            }

            creep.memory.offspring = true;
        }
    },

    ticksToBuild(creep) {
        const spawnTime = 3;
        return creep.body.length * spawnTime;
    }

};

module.exports = roleHarvester;
