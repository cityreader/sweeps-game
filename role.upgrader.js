const roleManager = require('role.manager');
const role = 'upgrader';

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        const creepSettings = roleManager.getCreepSettings(creep);
        this.echo(creep, creepSettings);

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
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1]);
            }
        }
    },

    echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${role} ${creepSettings.model}`)}

};

module.exports = roleUpgrader;
