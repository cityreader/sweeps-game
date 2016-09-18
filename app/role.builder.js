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
                const sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1]);
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
                    if (creep.pickup(energySource) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energySource);
                    }
                }
            }

        }
    },

    carryCapacity(creep) {
        const carryPartNum = creep.body.filter(part => part.type == CARRY).length;
        return carryPartNum * 50;
    },

};


module.exports = roleBuilder;
