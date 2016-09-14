const maxCreepNum = 1;

const roleSettings = {
    harvester : {
        weight: 0.2,
        body: [
            [WORK, CARRY, MOVE],
        ],
        max: 3,
    },
    // mover : {
    //     weight: 0.2,
    //     body: [
    //         [CARRY, MOVE],
    //     ],
    //     max: 3,
    // },
    // upgrader : {
    //     weight: 0.2,
    //     body: [
    //         [WORK, CARRY, MOVE],
    //     ],
    //     max: 3,
    // },
    // builder : {
    //     weight: 0.2,
    //     body: [
    //         [WORK, CARRY, MOVE],
    //     ],
    //     max: 3,
    // },
    // repairer : {
    //     weight: 0.2,
    //     body: [
    //         [WORK, CARRY, MOVE],
    //     ],
    //     max: 3,
    // }
}

var creepManager = {

    run: function(spawn) {
        this.spawn = spawn;

        const targetCountRoles = this.calculateTargetNum();
        const currentCountRoles = this.calculateCurrentNum();

        if (Memory.rolePriority === undefined) {
            Memory.rolePriority = 0;
        }

        console.log(`Object.keys(Game.creeps).length ${Object.keys(Game.creeps).length}`)

        var currentCount = 0;
        _.forEach(Game.creeps, (creep) => {
            currentCount++;
        });

        var roleTypeCount = 0;
        _.forEach(targetCountRoles, (role) => {
            roleTypeCount++;
        });

        console.log(`currentCount ${currentCount}`);
        console.log(`maxCreepNum ${maxCreepNum}`);
        console.log(`Memory.rolePriority ${Memory.rolePriority}`);

        while (currentCount < maxCreepNum) {

            let pointer = 0;

            _.forEach(targetCountRoles, (_targetCount, role) => {

                if ( pointer === Memory.rolePriority ) {

                    console.log();

                    let _currentCount = currentCountRoles[role];

                    if ( _currentCount < _targetCount ) {
                        const result = this.createCreep(role);

                        if (result === false) {
                            currentCount++;
                            return false;
                        }

                        const newName = spawn.createCreep(body, name, {role, model});
                        console.log(`New ${role} creep is created, name: ${newName}.`);

                        currentCount++;

                        if (currentCount >= maxCreepNum) {
                            return false;
                        }

                    }

                }

                pointer++;

                if (pointer >= roleTypeCount) {
                    pointer = 0;
                }
            });

        }

        Memory.rolePriority = pointer;
    },

    calculateTargetNum: function() {
        var countRoles = {};
        var total = 0;

        _.forEach(roleSettings, (settings, role) => {

            let num = Math.ceil(maxCreepNum * settings.weight);

            if (settings.max !== undefined && num > settings.max ) {
                num = settings.max;
            }

            countRoles[role] = num;

            total += num;

        });

        while (total < maxCreepNum) {

            _.forEach(roleSettings, (settings, role) => {

                if (settings.max === undefined) {
                    countRoles[role]++;
                    total++;
                }

                if (total >= maxCreepNum) {
                    return false;
                }

            });
        }

        return countRoles;
    },

    calculateCurrentNum() {

        var countRoles = {};

        _.forEach(Game.creeps, (creep) => {

            let role = creep.memory.role;

            if (countRoles[role] === undefined) {
                countRoles[role] = 1;
            }
            else {
                countRoles[role]++;
            }

        });

        return countRoles;
    },

    createCreep(role) {

        const result = spawn.canCreateCreep(body);

        if (result == OK) {
            const newName = this.spawn.createCreep(body, undefined, {role});
            console.log(`[${role} ${newName}] is created.`);

            var creep;

            _.forEach(Game.creeps, (_creep, name) => {
                if (name == newName) {
                    creep = _creep;
                }
            });

            return creep;
        }
        else {
            console.log(`Cannot create creep, error ${result}`);

            return false;
        }

    },

    // keep(creeps, role, settings) {
    //     var targetCreeps = this.filterRole(creeps, role);
    //
    //     if (settings.model === undefined) {
    //         settings.model = 'b1';
    //     }
    //
    //     targetCreeps = this.filterModel(targetCreeps, settings.model);
    //
    //     if(targetCreeps.length < settings.max) {
    //         console.log(`There is ${targetCreeps.length} ${role} creeps of model ${settings.model}.`);
    //
    //         const body = creepModelManager.getModel(settings.model);
    //
    //         const tryToCreatCreep = (spawn, role, body, name) => new Promise((resolve, reject) => {
    //             const result = spawn.canCreateCreep(body, name, {role: role});
    //
    //             const createCreep = (spawn, role, model, body = [WORK,CARRY,MOVE], name) => {
    //                 const newName = spawn.createCreep(body, name, {role, model});
    //                 console.log(`New ${role} creep is created, name: ${newName}.`);
    //             }
    //
    //             const cannotCreate = (error) => console.log(`Cannot create creep, error ${error}`);
    //
    //             if (result == OK) {
    //                 createCreep(spawn, role, settings.model, body, name);
    //                 resolve();
    //             }
    //             else {
    //                 cannotCreate(result);
    //                 reject();
    //             }
    //         });
    //
    //         if (body) {
    //             console.log(`body ${body}`)
    //             // @todo sort out whey promise does not work.
    //             tryToCreatCreep(Game.spawns['Spawn1'], role, body).then(()=>console.log('resolve')).catch(()=>console.log('reject'));
    //         }
    //         else {
    //             console.log(`Cannot get body of creep model ${settings.model}`);
    //         }
    //     }
    // },
    //
    // changeRole: function (creeps, oldRole, newRole, number) {
    //     var targetCreeps = this.filterRole(creeps, oldRole);
    //
    //     var counter = 0;
    //     for (var name in targetCreeps) {
    //         if (counter >= number) {
    //             return false;
    //         }
    //         this.swapRole(targetCreeps[name], newRole);
    //         counter++;
    //     }
    // },
    //
    // filterRole: (creeps, role) => _.filter(creeps, creep => creep.memory.role == role),
    //
    // filterModel: (creeps, model) => _.filter(creeps, creep => {
    //     if (creep.memory.model === undefined) {
    //         creep.memory.model = 'b1'
    //     }
    //     return creep.memory.model == model;
    // }),
    //
    // swapRole: (creep, newRole) => {
    //     creep.memory.oldRole = creep.memory.role;
    //     creep.memory.role = newRole;
    // }

}

module.exports = creepManager;
