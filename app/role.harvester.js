const RoleBase = require('role-base');

class RoleHarvester extends RoleBase {

  run(creepControl) {
    const creep = creepControl.creep;
    creepControl.boot();
    creepControl.checkHealth();

    if (creep.store.getFreeCapacity() > 0) {
      // creep.say('harvesting');
      const source = this.getSource(creep);

      if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
      }
      else {
        this.getMoveTicks(creep);
      }
    }
    else {
      const moverCount = creepControl.getRoleCount('mover');

      // Drop energy when there is a mover.
      if (moverCount >= 1) {
        var containers = creep.pos.findInRange(FIND_STRUCTURES, 1,
          {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
              _.sum(i.store) < i.storeCapacity
          });

        if (containers.length == 0) {
          containers = creep.room.find(FIND_STRUCTURES,
            {
              filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                _.sum(i.store) < i.storeCapacity
            });
        }

        if (containers.length > 0) {
          if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containers[0]);
            // creep.drop(RESOURCE_ENERGY);
            // creep.say('Dropping');
          }
          else {
            creep.say('Transferring');
          }

        }
        else {
          creep.drop(RESOURCE_ENERGY);
          creep.say('Dropping');
        }

      }
      //
      else {
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER) &&
              structure.energy < structure.energyCapacity;
          }
        });

        if (targets.length > 0) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
      }

    }

  }

  getSource(creep) {
    let source;

    if (creep.memory.sourceId) {
      source = Game.getObjectById(creep.memory.sourceId);
    }
    else {
      let sources = creep.room.find(FIND_SOURCES);
      source = sources[0];
    }

    if (source.energy === 0) {
      let sources = creep.room.find(FIND_SOURCES, {
        filter: t => t.energy > 0,
      });
      source = sources[0];
      creep.memory.sourceId = source.id;
    }

    return source;
  }
}

const roleHarvester = new RoleHarvester();

module.exports = roleHarvester;
