/**
 * Creep model.
 */
const creepModels = {
    b1: {
        sku: 'b1',
        parts: [WORK, CARRY, MOVE],
        description: 'Standard harvester'
    },

    b2: {
        sku: 'b2',
        parts: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE],
        description: 'Big harvester'
    },
}

module.exports = creepModels;