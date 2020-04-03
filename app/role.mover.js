const { CreepCustomStatus } = require('constants');
const RoleBase = require('role-base');

class RoleMover extends RoleBase {

  run(creepControl) {
    const creep = creepControl.creep;

    creepControl.boot();

    // creepControl.checkHealth();

    if (creep.memory.transferring) {
      creep.memory.transferring = creep.carry.energy > 0;
    } else {
      creep.memory.transferring = creep.carry.energy === creep.carryCapacity;
    }

    if (creep.memory.transferring) {
      let targets = creepControl.findStructureWitchFreeCapacity([STRUCTURE_EXTENSION]);

      // Transfer to container if extension is full.
      if (!targets) {
        targets = creepControl.findStructureWitchFreeCapacity([STRUCTURE_CONTAINER]);
      }

      console.log('targets', JSON.stringify(targets));

      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
        else {
          creepControl.say(CreepCustomStatus.TRANSFER_ENERGY);
        }
      }

    }
    else {
      let targets = creep.room.find(FIND_DROPPED_RESOURCES);
      if (targets.length > 0) {
        targets.sort((a, b) => b.energy - a.energy)

        if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
        else {
          this.getMoveTicks(creep);
          creepControl.say(CreepCustomStatus.PICK_UP_ENERGY);
        }

      } else {
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (i) =>
            i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0
        });

        // Fetch energy from container.
        if (containers.length > 0) {
          // console.log(JSON.stringify(containers, null, '\t'))
          // containers = containers.filter(container => container.store);
          containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

          if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containers[0]);
          }
          else {
            creepControl.say(CreepCustomStatus.WITHDRAW_ENERGY);
          }
        }
      }

    }

  }

  bootstrap(creep) {
    if (creep.memory.booted) {
      return;
    }
    console.log(`${creep} booting`);

    const sources = creep.room.find(FIND_SOURCES);

    _.forEach(sources, (source) => {
      if (!source.memory.blocked &&
        !source.memory.moverId &&
        source.memory.workers.length > 0) {

        source.memory.moverId = creep.id;
        creep.memory.sourceId = source.id;
        return false;
      }
    });

    if (!creep.memory.fullTicks) {
      creep.memory.fullTicks = creep.ticksToLive;
    }

    creep.memory.booted = true;
  }

}

const roleMover = new RoleMover();

module.exports = roleMover;
