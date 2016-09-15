// const roleManager = require('role.manager');
const role = 'harvester';

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.bootstrap === undefined) {
            this.bootstrap(creep);
        }

        // const creepSettings = roleManager.getCreepSettings(creep);
        // this.echo(creep, creepSettings);
// console.log(`roleHarvester starts`);
        if(creep.carry.energy < creep.carryCapacity) {
            // creep.say('harvesting');
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            creep.drop(RESOURCE_ENERGY);

            // // Move to Flag2 to not occupy mining place.
            // // creep.moveTo(Game.flags.Flag2);
            // var targets = creep.room.find(FIND_STRUCTURES, {
            //     filter: (structure) => {
            //         return (structure.structureType == STRUCTURE_EXTENSION ||
            //             structure.structureType == STRUCTURE_SPAWN ||
            //             structure.structureType == STRUCTURE_TOWER) &&
            //             structure.energy < structure.energyCapacity;
            //     }
            // });
            //
            // console.log(`targets.length ${targets.length}`);
            // if(targets.length > 0) {
            //     if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(targets[0]);
            //     }
            // }
        }
    },

    bootstrap(creep) {
        const mapWorkplace = (creep) => {
            var workLocations = [];

            _.forEach(Memory.rooms, (room) => {
                if (room.spawn !== undefined && room.sources !== undefined) {
                    let i = 0;
                    let maxSourceNum = 2;

                    room.sources.forEach((source) => {
                        i += 1;

                        if (source.harvestPos !== undefined) {
                            workLocations = workLocations.concat(source.harvestPos)
                        }

                        if (i >= maxSourceNum) {
                            return false;
                        }

                    });
                }
            });

            console.log(`workLocations ${workLocations.length}`);

            workLocations.forEach((location) => {
                if (location.creepId === undefined) {
                    location.creepId = creep.id;
                    creep.memory.mapWorkplace = true;
                    return false;
                }
            })
        }

        if (creep.memory.mapWorkplace === undefined) {
            mapWorkplace(creep);
        }



        // creep.memory.bootstrap = true;
    }

    // echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${creepSettings.model} ${role}`)}

};

module.exports = roleHarvester;
