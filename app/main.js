require('prototype.extend');
var utilities = require('utilities');

var ai = require('ai');

var roleHarvester = require('role.harvester');
var roleMover = require('role.mover');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleScouter = require('role.scouter');

const CreepManager = require('creep.manager');

module.exports.loop = function () {

    ai.run();

    var tower = Game.getObjectById('57dfcffeb4a8672d0fe825b5');
    if (tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile)
        }

        // Only repair when tower energy is more than 75%.
        if (tower.energy > tower.energyCapacity * 0.95) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
        }

    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            // console.log('Clearing non-existing creep memory:', name);
        }
    }

    _.forEach(Memory.sources, memory => {
        if (_.isUndefined(memory.workers)) {
            return;
        }

        memory.workers = memory.workers.filter(creepId => {
            let creep = Game.getObjectById(creepId);
            if (creep && creep.memory.role == 'harvester') {
                return true;
            }

            return false;
        });
    });


    for (let i in Game.spawns) {
        let spawn = Game.spawns[i];
        const creepManager = new CreepManager(spawn);
        creepManager.run();
    }

    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
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

            case 'scouter':
                roleScouter.run(creep);
        }

    }

    Memory.flush = false;

}
