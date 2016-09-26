const creepManager = require('creep.manager');
const Role = require('Role');

const roleScouter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // console.log('sss');
        // if(creep.room.controller) {
        // if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        // creep.moveTo(35,49);
        creep.moveTo(Game.flags.Spawn2);
        // }
        // }

        if (creep.memory.lastTick != Game.time - 1) {
            console.log(creep.name + " missed a tick!");
        }
        creep.memory .lastTick = Game.time;

    },

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
    },

    checkHealth(creep) {
        if (!creep.memory.sourceId) {
            return;
        }

        const ticksToBuild = this.ticksToBuild(creep);

        if (creep.ticksToLive <= creep.memory.moveTicks + ticksToBuild) {
            const source = Game.getObjectById(creep.memory.sourceId);
            source.memory.moverId = null;

            const role = new Role(creep.spawn, creep.memory.role);
            if (role.creepNum + 1 > role.memory.cap) {
                return;
            }

            const spawns = creep.room.find(FIND_MY_SPAWNS);
            creepManager.createCreep(spawns[0], creep.memory.role);
        }
    },

};

module.exports = roleScouter;
