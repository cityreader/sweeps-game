var gameSettings = require('game.settings');

var tools = require('tools');

var ai = require('ai');

var roleHarvester = require('role.harvester');
var roleMover = require('role.mover');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRpairer = require('role.repairer');

var creepManager = require('creep.manager');

var roomBuildingManager = require('room.building.manager');

const spawn1 = Game.spawns['Spawn1'];

module.exports.loop = function () {

    ai.run();

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

    // creepManager.manageCreeps(gameSettings);
    //
    // roomBuildingManager.run(spawn1.room);
    //
    // // creepManager.changeRole(Game.creeps, 'harvester', 'upgrader', 2);
    //
    _.forEach(Game.creeps, (creep) => {
        console.log(`creep.memory.role ${creep.memory.role}`);
        switch (creep.memory.role) {
            case 'harvester':
                roleHarvester.run(creep);
                break;

            case 'mover':
                roleMover.run(creep);
                break;

            case 'upgrader':
                roleUpgrader.run(creep);
                break;

            case 'builder':
                roleBuilder.run(creep);
                break;

            case 'repairer':
                roleRepairer.run(creep);
                break;
        }

    });


    _.forEach(Game.spawns, (spawn) => {
        creepManager.run(spawn);
    });


    // const createInitialCreeps = (obj) => {
    //
    //     console.log(`bootstrap: createInitialCreeps starts`);
    //
    //     var harvestLocation = obj.memory.sources[0].harvestPos[0];
    //     var spawnLocation = obj.memory.spawn;
    //
    //     obj.creepManager.create('harvester', {
    //         source: obj.sources[0],
    //         at: harvestLocation,
    //     });
    //     // obj.creepManager.create('mover', {
    //     //     from: harvestLocation,
    //     //     to: spawnLocation,
    //     // });
    //
    //     console.log(`bootstrap: createInitialCreeps completed`);
    //
    //     return obj;
    // };

}
