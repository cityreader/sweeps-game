const creepModels = require('creep.models');

const creepModelManager = {
    getModel: (sku) => creepModels[sku] ? creepModels[sku].parts
        : false
}

module.exports = creepModelManager;
