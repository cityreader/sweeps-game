var creepManager = {
    manageCreeps: function (settings)  {
        for (let role in settings.creeps)  {
            this.keep(Game.creeps, role, settings.creeps[role]);
        }
    },

    keep: function (creeps, role, max) {
        var targetCreeps = this.filterRole(creeps, role);

        if(targetCreeps.length < max) {
            console.log(`There is ${targetCreeps.length} ${role} creeps.`);

            const tryToCreatCreep = (spawn, role, body, name) => new Promise((resolve, reject) => {
                const result = spawn.canCreateCreep(body, name, {role: role});

                const createCreep = (spawn, role, body = [WORK,CARRY,MOVE], name) => {
                    const newName = spawn.createCreep(body, name, {role: role});
                    console.log(`New ${role} creep is created, name: ${newName}.`);
                }

                const cannotCreate = (error) => console.log(`Cannot create creep, error ${error}`);

                if (result == OK) {
                    createCreep(spawn, role, body, name);
                    resolve();
                }
                else {
                    cannotCreate(result);
                    reject();
                }
            });

            // @todo sort out whey promise does not work.
            tryToCreatCreep(Game.spawns['Spawn1'], role, [WORK,CARRY,MOVE]).then(()=>console.log('resolve')).catch(()=>console.log('reject'));
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

    filterRole: (creeps, role) => _.filter(creeps, creep => creep.memory.role == role),

    swapRole: (creep, newRole) => {
        creep.memory.oldRole = creep.memory.role;
        creep.memory.role = newRole;
    }

}

module.exports = creepManager;
