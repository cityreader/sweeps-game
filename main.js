var gameSettings = require('game.settings');

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var creepManager = require('creep.manager');

var roomBuildingManager = require('room.building.manager');

const spawn1 = Game.spawns['Spawn1'];

module.exports.loop = function () {

    // var tower = Game.getObjectById('165d3aed5660381a7fd71d7b');
    // if (tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //         filter: (structure) => structure.hits < structure.hitsMax
    //     });
    //     if(closestDamagedStructure) {
    //         tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if (closestHostile) {
    //         tower.attack(closestHostile)
    //     }
    // }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    creepManager.manageCreeps(gameSettings);

    roomBuildingManager.run(spawn1.room);

    // creepManager.changeRole(Game.creeps, 'harvester', 'upgrader', 2);

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];

        // creep.moveTo(11, 15);
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
