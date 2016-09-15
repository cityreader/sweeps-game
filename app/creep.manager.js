var defaultMaxCreepNum = 8;

const roleSettings = {
    harvester : {
        weight: 0.2,
        body: [
            [WORK, CARRY, MOVE],
        ],
        max: 3,
    },
    mover : {
        weight: 0.2,
        body: [
            [CARRY, MOVE],
        ],
        max: 3,
    },
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

    run: function (spawn) {

        this.spawn = spawn;

        this.keep();
    },

    keep: function() {

        const panOutTargetNum = (getNoCapRoles, map, total, maxCreepNum) => {

            _.forEach(getNoCapRoles, (settings, role) => {
                map.set(role, map.get(role) + 1);
                total++;

                if (total >= maxCreepNum) {
                    return false;
                }
            });

            return (total >= maxCreepNum) ? map : panOutTargetNum(getNoCapRoles, map, total, maxCreepNum);
        }

        const calculateTargetNum = (getNoCapRoles) => {
            let map = new Map();
            let total = 0;

            _.forEach(roleSettings, (settings, role) => {

                let num = Math.ceil(defaultMaxCreepNum * settings.weight);

                if (settings.max !== undefined && num > settings.max ) {
                    num = settings.max;
                }

                map.set(role, num);
                total += num;
            });

            if (getNoCapRoles.length > 0) {
                map = panOutTargetNum(getNoCapRoles);
            }

            return map;
        }

        const calculateCurrentNum = (roleNames) => {
            let map = new Map();

            roleNames.forEach((role) => {
                map.set(role, 0);
            })

            _.forEach(Game.creeps, (creep) => {

                let role = creep.memory.role;
                map.set(role, map.get(role) + 1);

            });

            return map;
        }

        const getCreepMaxNum = (targetCountRoles) => {
            let maxNum = 0;

            for (let entry of targetCountRoles) {
                maxNum += entry[1];
            }

            return maxNum;
        }

        const createNextCreep = (targetCountRoles, currentCountRoles, roleNames, creepMaxNum, totalCreepNum) => {
            // console.log(`createNextCreep starts`)

            var result;

            for (let entry of targetCountRoles) {
                let role = entry[0];

                // console.log(`Memory.rolePriority ${Memory.rolePriority}`);
                // console.log(`role ${role}`);
                // console.log(`roleNames ${roleNames.join(', ')}`);

                if (roleNames[Memory.rolePriority] === role) {
                    console.log(`find role ${role}`);
                    Memory.rolePriority++;
                    if (Memory.rolePriority == roleNames.length) {
                        Memory.rolePriority = 0;
                    }

                    // console.log(`Memory.rolePriority2 ${Memory.rolePriority}`);

                    let targetNum = entry[1];
                    let currentNum = currentCountRoles.get(role);

                    // console.log(`targetNum ${targetNum}`);
                    // console.log(`currentNum ${currentNum}`);

                    if (currentNum < targetNum) {
                        result = this.createCreep(role);

                        if (result !== false ) {
                            currentCountRoles.set(role, currentCountRoles.get(role) + 1);
                            totalCreepNum += 1;
                        }

                        break;
                    }

                }
            }

            // console.log(`result ${result}`);
            // console.log(`totalCreepNum ${totalCreepNum}`);
            // console.log(`creepMaxNum ${creepMaxNum}`);

            if (result === false) {
                return;
            }
            else if (totalCreepNum < creepMaxNum) {
                createNextCreep(targetCountRoles, currentCountRoles, roleNames, creepMaxNum, totalCreepNum);
            }

        }

        const roleNames = _.map(roleSettings, (settings, role) => role);
        const getNoCapRoles = _.filter(roleSettings, (settings, role) => settings.max === undefined);
        var targetCountRoles = calculateTargetNum(getNoCapRoles);
        var currentCountRoles = calculateCurrentNum(roleNames);
        const creepMaxNum = getCreepMaxNum(targetCountRoles);

        // console.log(`currentCountRoles.size ${currentCountRoles.size}`)


        var totalCreepNum = Object.keys(Game.creeps).length;

        if (Memory.rolePriority === undefined) {
            Memory.rolePriority = 0;
        }

        // console.log(`maxCreepNum ${defaultMaxCreepNum}`);
        // console.log(`totalCreepNum ${totalCreepNum}`);
        // console.log(`Memory.rolePriority ${Memory.rolePriority}`);

        // return;

        createNextCreep(targetCountRoles, currentCountRoles, roleNames, creepMaxNum, totalCreepNum);


        //
        // while (currentCount < defaultMaxCreepNum) {
        //
        //     let pointer = 0;
        //
        //     _.forEach(targetCountRoles, (_targetCount, role) => {
        //
        //         if ( pointer === Memory.rolePriority ) {
        //
        //             console.log();
        //
        //             let _currentCount = currentCountRoles[role];
        //
        //             if ( _currentCount < _targetCount ) {
        //                 const result = this.createCreep(role);
        //
        //                 if (result === false) {
        //                     currentCount++;
        //                     return false;
        //                 }
        //
        //                 const newName = spawn.createCreep(body, name, {role, model});
        //                 console.log(`New ${role} creep is created, name: ${newName}.`);
        //
        //                 currentCount++;
        //
        //                 if (currentCount >= defaultMaxCreepNum) {
        //                     return false;
        //                 }
        //
        //             }
        //
        //         }
        //
        //         pointer++;
        //
        //         if (pointer >= roleTypeCount) {
        //             pointer = 0;
        //         }
        //     });
        //
        // }
        //
        // Memory.rolePriority = pointer;
    },



    createCreep(role) {

        const body = this.getBody(role);

        const result = this.spawn.canCreateCreep(body);

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

    getBody(role) {
        return roleSettings[role].body[0];
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
