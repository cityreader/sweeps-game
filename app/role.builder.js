const role = 'builder';

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        // const creepSettings = roleManager.getCreepSettings(creep);
        // this.echo(creep, creepSettings);
        //
        // if(creep.memory.building && creep.carry.energy == 0) {
        //     creep.memory.building = false;
        //     creep.say('harvesting');
        // }
        // if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        //     creep.memory.building = true;
        //     creep.say('building');
        //
        //     creep.moveTo(Game.flags.Flag2);
        // }
        //
        // if(creep.memory.building) {
        //     var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        //     if(targets.length) {
        //         if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(targets[0]);
        //         }
        //     }
        // }
        // else {
        //     var sources = creep.room.find(FIND_SOURCES);
        //     if(creep.harvest(sources[creepSettings.source]) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(sources[creepSettings.source]);
        //     }
        // }
    },

    // echo: (creep, creepSettings) => {creepSettings.echo && creep.say(`${role} ${creepSettings.model}`)}

};


module.exports = roleBuilder;
