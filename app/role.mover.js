const RoleBase = require('role-base');

class RoleMover extends RoleBase {

  run(creepControl) {
    creepControl.boot();

    // creepControl.checkHealth();

    const isTranferring = this.getStatus(creepControl);

    if (isTranferring) {
      this.transferEnergyToStructure(creepControl);
    } else {
      this.findEnergy(creepControl);
    }
  }

  getStatus(creepControl) {
    const creep = creepControl.creep;
    let isTransferring = creepControl.getMemory('transferring') || false;
    let newStatus;

    if (isTransferring) {
      newStatus = creep.carry.energy > 0;
    } else {
      newStatus = creep.carry.energy === creep.carryCapacity;
    }
    creepControl.setMemory('transferring', newStatus);
    return newStatus;
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

  transferEnergyToStructure(creepControl) {
    // Structure type order matters!!!
    const target = creepControl.findStructureWitchFreeCapacity([
      STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_STORAGE, STRUCTURE_CONTAINER
    ]);

    if (target) {
      creepControl.transferEnergy(target);
    }
  }

  findEnergy(creepControl) {
    let target = creepControl.findDroppedResource();

    if (target) {
      creepControl.pickupEnergy(target);
      return;
    }

    target = creepControl.findContainerAndStorageWithEnergy();
    if (target) {
      creepControl.withdrawEnergy(target);
    }
  }

}

const roleMover = new RoleMover();

module.exports = roleMover;
