const roleHarvester = require('role.harvester');
const roleMover = require('role.mover');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleScouter = require('role.scouter');

const roleMap = {
  harvester: roleHarvester,
  mover: roleMover,
  upgrader: roleUpgrader,
  builder: roleBuilder,
  repairer: roleRepairer,
  scouter: roleScouter,
};

class CreepControl {
  constructor(creep) {
    this.creep = creep;
  }

  getRole() {
    return this.creep.memory.role;
  }

  run() {
    const role = this.getRole();
    const taskRunner = roleMap[role];
    taskRunner.run(this);
  }
  }
}

module.exports = CreepControl;
