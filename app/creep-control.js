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

    this.checkMissedTick();
  }

  buildTime() {
    const spawnTime = 3;
    return this.creep.body.length * spawnTime;
  }

  boot() {
    if (this.getMemory('booted') && !Memory.flush) {
      return;
    }

    console.log(`${this.creep} booting`);

    const sources = this.creep.room.find(FIND_SOURCES);

    for (const source of sources) {
      if (source.memory.blocked) {
        break;
      }

      let cap = source.memory.max || source.memory.capacity;
      if (source.memory.workers.length < cap) {
        source.memory.workers.push(this.creep.id);
        this.setMemory('sourceId', source.id);
        break;
      }
    }

    if (!this.getMemory('fullTicks')) {
      this.setMemory('fullTicks', this.creep.ticksToLive);
    }

    this.setMemory('booted', true);
  }

  checkHealth() {
    if (!this.getMemory('sourceId')) {
      return;
    }

    if (this.isTimeToCreateOffspring()) {
      const source = Game.getObjectById(this.creep.memory.sourceId);

      source.memory.workers = source.memory.workers.filter(creepId => creepId != creep.id);
      const creepWithSameRoleCount = creepControl.getRoleCount();

      if (creepWithSameRoleCount + 1 > this.getRoleCap()) {
        return;
      }

      const spawns = this.creep.room.find(FIND_MY_SPAWNS);

      if (spawns.length > 0) {
        const spawn = spawns.shift();
        // creepManager.createCreep(spawn, creep.memory.role);
      }

      this.setMemory('offspring', true);
    }
  }

  getRoleCount(roleName = this.getMemory('role')) {
    return GodView.creepStats[this.creep.spawn.name][roleName];
  }

  getRoleCap(roleName = this.getMemory('role')) {
    return GodView.creepCap[this.creep.spawn.name].roles[role].cap;
  }

  isTimeToCreateOffspring() {
    const buildTime = this.buildTime();
    return !this.hasOffspring() &&
           this.creep.ticksToLive <= this.getMemory('moveTicks') + buildTime;
  }

  hasOffspring() {
    return this.getMemory('offspring');
  }

  checkMissedTick() {
    if (this.getMemory('lastTick') != Game.time - 1) {
      console.log(`${this.creep.name} (${this.getMemory('role')}) missed a tick!`);
    }
    this.setMemory('lastTick', Game.time);
  }

  getMemory(prop) {
    return this.creep.memory[prop];
  }

  setMemory(prop, value) {
    this.creep.memory[prop] = value;
  }
}

module.exports = CreepControl;
