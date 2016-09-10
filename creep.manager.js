var creepManager = {
    keep: function (creeps, role, max) {
      var targetCreeps = this.filterRole(creeps, role);
      // console.log('Harvesters: ' + harvesters.length);

      if(targetCreeps.length < max) {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: role});
      }
    },

    changeRole: function (creeps, oldRole, newRole, number) {
      var targetCreeps = this.filterRole(creeps, oldRole);

      var counter = 0;
      for (var name in targetCreeps) {
        if (counter >= number) {
          break;
        }
        this.swapRole(targetCreeps[name], newRole);
        counter++;
      }
    },

    filterRole: (creeps, role) => _.filter(creeps, (creep) => {creep.memory.role == role}),

    swapRole: (creep, newRole) => {
      creep.memory.oldRole = creep.memory.role;
      creep.memory.role = newRole;
    }

}

module.exports = creepManager;
