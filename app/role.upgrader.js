const { CreepCustomStatus } = require('constants');
const RoleBase = require('role-base');

class RoleUpgrader extends RoleBase {

  run(creepControl) {
    const creep = creepControl.creep;
    this.boostrap(creep);

    if (creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('⛏ harvest');
    }
    
    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('upgrading');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
    else {
      const carryCapacity = creepControl.carryCapacity;

      // Harvest energy when room energy is not enough for creating an extra creep.
      if (carryCapacity + 700 > creep.room.energyAvailable) {

        let containers = creepControl.findContainerWitchMinimumEnergy(100);

        // Fetch energy from container.
        if (containers.length > 0) {
          containers = containers.filter(container => container.store);
          containers.sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]);

          if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containers[0]);
          }
          else {
            creep.say('Container transferring');
          }
        }
        else {
          var targets = creep.room.find(FIND_DROPPED_RESOURCES);
          // Pickup dropped energy.
          if (targets.length > 0) {
            targets.sort((a, b) => b.energy - a.energy)

            if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0]);
            }
            else {
              creep.say('Picking up');
              this.saveMoveTicks(creep);
            }

          }
          else {
            const sources = creep.room.find(FIND_SOURCES);

            var source;

            _.forEach(sources, s => {
              // Harvest
              if (s.memory.workers.length < s.memory.capacity) {
                source = s;
                return false;
              }
            });

            if (!source) {
              source = sources[0];
            }

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source);
            }

          }
        }

      }
      // Withdraw energy from closest place.
      else {
        let targets = creep.room.find(FIND_DROPPED_RESOURCES);
        if (targets.length > 0) {
          targets.sort((a, b) => b.energy - a.energy)

          if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
          else {
            this.saveMoveTicks(creep);
            creepControl.say(CreepCustomStatus.PICK_UP_ENERGY);
          }

        } else {
          const controllerId = creep.room.controller.id;
          const energySourceId = Memory.controllers[controllerId];
          const energySource = Game.getObjectById(energySourceId);

          if (creep.withdraw(energySource, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(energySource);
          }
          else {
            creep.say('Withdrawing');
          }
        }


      }

    }

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

}

const roleUpgrader = new RoleUpgrader();

module.exports = roleUpgrader;
