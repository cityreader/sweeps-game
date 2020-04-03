const { CreepCustomStatus, CreepCustomMessage } = require('constants');

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

      source.memory.workers = source.memory.workers.filter(creepId => creepId != this.creep.id);
      const creepWithSameRoleCount = this.getRoleCount();

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
    return GodView.creepCaps[this.creep.spawn.name].roles[roleName].cap;
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
    if (this.getMemory('lastTick') !== Game.time - 1) {
      console.log(`${this.creep.name} (${this.getMemory('role')}) missed a tick!`);
    }
    this.setMemory('lastTick', Game.time);
  }

  getSource() {
    let source;
    const sourceId = this.getMemory('sourceId');

    if (sourceId) {
      source = Game.getObjectById(sourceId);
    }

    if (!source || source.energy === 0 || this.sourceCapcityIsFull(sourceId)) {
      let sources = this.creep.room.find(FIND_SOURCES_ACTIVE, {
        filter: s => s.id !== sourceId,
      });
      source = sources[0];
    }

    this.updateSource(source);
    return source;
  }

  sourceCapcityIsFull(sourceId) {
    const occupiedNumber = Object.values(Game.creeps).filter(
      c => c.memory.lastStatus === CreepCustomStatus.HARVEST_ENERGY &&
           c.memory.sourceId === sourceId
    );

    return occupiedNumber >= Memory.sources[sourceId];
  }

  updateSource(source) {
    if (this.getMemory('sourceId') !== source.id) {
      this.creep.memory.sourceId = source.id;
      this.creep.say('🔄 source');
    }
  }

  /**
   * Computed attributes
   */

  /**
   * 
   */
  get carryCapacity() {
    const carryPartNum = this.creep.body.filter(part => part.type == CARRY).length;
    return carryPartNum * 50;
  }



  /**
   * Creep utils
   */

  say(status) {
    const message = CreepCustomMessage[status];
    if (message) {
      this.updateStatus(status, message);
    }
  }

  updateStatus(status, message) {
    const lastStatus = this.getMemory('lastStatus');
    if (lastStatus !== status) {
      this.setMemory('lastStatus', status);
      this.creep.say(message);
    }
  }

  /**
   * Search utils.
   */

  findStructure(types, customFilter = undefined) {
    const filter = s => {
      if (!types.includes(s.structureType) || !s.isActive()) {
        return false;
      }

      if (customFilter) {
        return customFilter(s);
      }
      
      return true;
    };
    
    return this.creep.room.find(FIND_STRUCTURES, {
      filter,
    });
  }

  findStructureWitchFreeCapacity(types) {
    const customFilter = s => s.store.getFreeCapacity([RESOURCE_ENERGY]);
    return this.findStructure(types, customFilter);
  }

  findContainerWitchMinimumEnergy(minEnergy) {
    const customFilter = s => s.store[RESOURCE_ENERGY] > minEnergy;
    return this.findStructure([STRUCTURE_CONTAINER], customFilter);
  }

  /**
   * General utils.
   */

  getMemory(prop) {
    return this.creep.memory[prop];
  }

  setMemory(prop, value) {
    this.creep.memory[prop] = value;
  }
}

module.exports = CreepControl;
