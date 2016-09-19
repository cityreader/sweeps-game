const creepManager = require('creep.manager');
const Role = require('Role');

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
                if (!creep.memory.moveTicks) {
                    creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
                }
            }
        }
        else {
            const moverRole = new Role('mover');

            // Drop energy when there is a mover.
            if (moverRole.creepNum >= 1) {
                // const containers = creep.pos.findInRange(FIND_STRUCTURES, 1,
                //     {filter: {structureType: STRUCTURE_CONTAINER}});

                var containers = creep.room.find(FIND_STRUCTURES,
                    {filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                    _.sum(i.store) < i.storeCapacity
                    });

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

    },

    bootstrap(creep) {
        if (creep.memory.booted) {
            return;
        }

        console.log(`${creep} booting`);

        const sources = creep.room.find(FIND_SOURCES);

        _.forEach(sources, (source) => {
            if (!source.memory.blocked &&
                source.memory.workers.length < source.memory.capacity) {

                source.memory.workers.push(creep.id);
                creep.memory.sourceId = source.id;
                return false;
            }
        });

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

        if (creep.ticksToLive <= creep.memory.moveTicks + ticksToBuild) {
            const source = Game.getObjectById(creep.memory.sourceId);

            source.memory.workers = source.memory.workers.filter(creepId => creepId != creep.id);

            const role = new Role(creep.memory.role);
            if (role.creepNum + 1 > role.memory.cap) {
                return;
            }

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
