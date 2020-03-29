require('prototype.extend');

const godViewFactory = require('god-view');
const CreepControl = require('creep-control');

var utilities = require('utilities');

var ai = require('ai');

const CreepManager = require('creep.manager');

module.exports.loop = function () {
    // Export GodView to global object.
    global.GodView = godViewFactory();
    console.log('GodView', JSON.stringify(GodView));

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

    // Run creep role task runners.
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        const creepControl = new CreepControl(creep);
        creepControl.run();
    }

    Memory.flush = false;

};
