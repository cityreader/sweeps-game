const creepModelManager = require('creep.model.manager');

var creepManager = {
    manageCreeps: function (settings)  {
        for (let role in settings.creeps)  {
            const roleSettings = settings.creeps[role];

            for (let index in roleSettings) {
                this.keep(Game.creeps, role, roleSettings[index]);
            }

        }
    },

    keep: function (creeps, role, settings) {
        var targetCreeps = this.filterRole(creeps, role);

        if (settings.model === undefined) {
            settings.model = 'b1';
        }

        targetCreeps = this.filterModel(targetCreeps, settings.model);

        if(targetCreeps.length < settings.max) {
            console.log(`There is ${targetCreeps.length} ${role} creeps of model ${settings.model}.`);

            const body = creepModelManager.getModel(settings.model);

            const tryToCreatCreep = (spawn, role, body, name) => new Promise((resolve, reject) => {
                const result = spawn.canCreateCreep(body, name, {role: role});

                const createCreep = (spawn, role, model, body = [WORK,CARRY,MOVE], name) => {
                    const newName = spawn.createCreep(body, name, {role, model});
                    console.log(`New ${role} creep is created, name: ${newName}.`);
                }

                const cannotCreate = (error) => console.log(`Cannot create creep, error ${error}`);

                if (result == OK) {
                    createCreep(spawn, role, settings.model, body, name);
                    resolve();
                }
                else {
                    cannotCreate(result);
                    reject();
                }
            });

            if (body) {
                console.log(`body ${body}`)
                // @todo sort out whey promise does not work.
                tryToCreatCreep(Game.spawns['Spawn1'], role, body).then(()=>console.log('resolve')).catch(()=>console.log('reject'));
            }
            else {
                console.log(`Cannot get body of creep model ${settings.model}`);
            }
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

    filterModel: (creeps, model) => _.filter(creeps, creep => {
        if (creep.memory.model === undefined) {
            creep.memory.model = 'b1'
        }
        return creep.memory.model == model;
    }),

    swapRole: (creep, newRole) => {
        creep.memory.oldRole = creep.memory.role;
        creep.memory.role = newRole;
    }

}

module.exports = creepManager;
