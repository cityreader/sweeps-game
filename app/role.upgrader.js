const RoleBase = require('role-base');

class RoleUpgrader extends RoleBase {

  run(creepControl) {
    const creep = creepControl.creep;
    this.boostrap(creep);

    const isUpgrading = this.getStatus(creepControl);

    if (isUpgrading) {
      creepControl.upgrade();
    } else {
      this.findEnergy(creepControl);
    }
  }

  getStatus(creepControl) {
    const creep = creepControl.creep;
    let isUpgrading = creepControl.getMemory('upgrading');
    let newStatus = isUpgrading;

    if (isUpgrading && creep.carry.energy === 0) {
      newStatus = false;
    }
    
    if (!isUpgrading && creep.store.getFreeCapacity() === 0) {
      newStatus = true;
    }

    creepControl.setMemory('transferring', newStatus);
    return newStatus;
  }

  boostrap(creep) {
    if (Memory.controllers === undefined) {
      Memory.controllers = {};
    }

    const controllerId = creep.room.controller.id;

    if (controllerId && Memory.controllers[controllerId] === undefined) {

      var targets = creep.room.find(FIND_SOURCES, { filter: (s, i) => i < 2 });
      // var targets = _.filter(sources, (source, index) => index < 2);

      const spawns = creep.room.find(FIND_MY_SPAWNS);

      if (spawns.length > 0) {
        targets.push(spawns[0]);
      }

      // console.log(JSON.stringify(targets, null, '\t'));
      // console.log(`targets ${targets}`)
      // console.log(`creep.room.controller ${creep.room.controller}`)
      var closest = creep.room.controller.pos.findClosestByPath(targets);
      // console.log(`closest.id ${closest.id}`)
      Memory.controllers[controllerId] = closest.id;
      // console.log(`Memory.controllers[${controllerId}] ${Memory.controllers[controllerId]}`)
    }
  }

  findEnergy(creepControl) {
    const creep = creepControl.creep;
    const carryCapacity = creepControl.carryCapacity;
    let target;

    // Harvest energy when room energy is not enough for creating an extra creep.
    if (carryCapacity + 700 > creep.room.energyAvailable) {
 
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

const roleUpgrader = new RoleUpgrader();

module.exports = roleUpgrader;
