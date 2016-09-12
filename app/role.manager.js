const gameSettings = require('game.settings');

const roleManager = {
    getCreepSettings: (creep) => {
        const role = creep.memory.role;
        const model = creep.memory.model;
        const creepGroupSettings = gameSettings.creeps[role];
        var creepSettings;

        for (let index in creepGroupSettings) {
            if (creepGroupSettings[index].model == model) {
                creepSettings = creepGroupSettings[index];
                break;
            }
        }

        return creepSettings;
    }
}

module.exports = roleManager;
