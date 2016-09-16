// const roleManager = require('role.manager');
const role = 'upgrader';

const roleUpgrader = {

    /** @param {Creep} creep **/
    run(creep) {

        if (!creep.memory.booted) {
            this.boostrap(creep);
        }

        // const creepSettings = roleManager.getCreepSettings(creep);
        // this.echo(creep, creepSettings);

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
// return;
            const controllerId = creep.room.controller.id;
            const energySourceId = Memory.controllers[controllerId];


            // var sources = creep.room.find(FIND_SOURCES);
            // if(creep.harvest(sources[creepSettings.source]) == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(sources[creepSettings.source]);
            // }

            const energySource = Game.getObjectById(energySourceId);

            if (energySource.energyCapacity !== undefined) {
                if(creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }
            else {
                if (creep.pickup(energySource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energySource);
                }
            }

        }
    },

    boostrap(creep) {
        if (Memory.controllers === undefined) {
            Memory.controllers = {};
        }

        const controllerId = creep.room.controller.id;

        if (Memory.controllers[controllerId] === undefined) {

            var targets = creep.room.find(FIND_SOURCES, {filter: (s,i) => i < 2});
            // var targets = _.filter(sources, (source, index) => index < 2);

            const spawns = creep.room.find(FIND_MY_SPAWNS);

            targets.push(spawns[0]);
            console.log(`targets ${targets}`)
            console.log(`creep.room.controller ${creep.room.crontroller}`)
            var closest = creep.room.controller.pos.findClosestByPath(targets);
console.log(`closest.id ${closest.id}`)
            Memory.controllers[controllerId] = closest.id;
            console.log(`Memory.controllers[${controllerId}] ${Memory.controllers[controllerId]}`)
        }
    },

    // echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${role} ${creepSettings.model}`)}

};

module.exports = roleUpgrader;
