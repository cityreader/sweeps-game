const RoleBase = require('role-base');

class RoleBuilder extends RoleBase {
  run(creepControl) {
    const isBuilding = this.getStatus(creepControl);

    if (isBuilding) {
      this.buildConstructionSites(creepControl);
    } else {
      this.findEnergy(creepControl);
    }
  }

  getStatus(creepControl) {
    const creep = creepControl.creep;
    let isBuilding = creepControl.getMemory('building');
    let newStatus = isBuilding;

    if (isBuilding && creep.store[RESOURCE_ENERGY] === 0) {
      newStatus = false;
    }

    if (!isBuilding && creep.store.getFreeCapacity() === 0) {
      newStatus = true;
    }

    creepControl.setMemory('building', newStatus);
    return newStatus;
  }

  buildConstructionSites(creepControl) {
    let target = creepControl.findConstructionSites();
      
    if (target) {
      creepControl.build(target);
      return;
    }

    target = creepControl.findStructureWitchFreeCapacity([
      STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER
    ]);

    if (target) {
      creepControl.transferEnergy(target);
    }
  }

  findEnergy(creepControl) {
    const creep = creepControl.creep;
    const carryCapacity = creepControl.carryCapacity;
    let target;

    // Harvest energy when room energy is not enough for creating an extra creep.
    if (carryCapacity + 600 > creep.room.energyAvailable) {
    }

    target = creepControl.findDroppedResource();

    if (target) {
      creepControl.pickupEnergy(target);
      return;
    }

    target = creepControl.findContainerAndStorageWithEnergy();
    if (target) {
      creepControl.withdrawEnergy(target);
      return;
    }

    target = creepControl.getSource();
    creepControl.harvestEnergy(target);
  }

}

const roleBuilder = new RoleBuilder();

module.exports = roleBuilder;
