class Role {

    constructor(spawn, name, settings = null, totalMax = null) {
        this.spawn = spawn;
        this.name = name;

        if (settings && totalMax) {
            this.max = _.isUndefined(settings.max) ? -1 : settings.max;
            this.weight = settings.weight;
            this.body = settings.body;
            this.totalMax = totalMax;
        }
    }

    get memory() {
        if (_.isUndefined(Memory.roleControllers)) {
            Memory.roleControllers = {};
        }

        if (_.isUndefined(Memory.roleControllers[this.spawn.name])) {
            Memory.roleControllers[this.spawn.name] = {};
        }

        if (_.isUndefined(Memory.roleControllers[this.spawn.name].roles)) {
            Memory.roleControllers[this.spawn.name].roles = {};
        }

        if (!_.isObject(Memory.roleControllers[this.spawn.name].roles)) {
            return undefined;
        }

        Memory.roleControllers[this.spawn.name].roles[this.name] = Memory.roleControllers[this.spawn.name].roles[this.name] || {};
        return Memory.roleControllers[this.spawn.name].roles[this.name];
    }

    set memory(value) {
        console.log(`set memory ${value}`);
        if (_.isUndefined(Memory.roleControllers)) {
            Memory.roleControllers = {};
        }

        if (_.isUndefined(Memory.roleControllers[this.spawn.name])) {
            Memory.roleControllers[this.spawn.name] = {};
        }

        if (_.isUndefined(Memory.roleControllers[this.spawn.name].roles)) {
            Memory.roleControllers[this.spawn.name].roles = {};
        }

        if (!_.isObject(Memory.roleControllers[this.spawn.name].roles)) {
            throw new Error('Could not set role memory');
        }

        Memory.roleControllers[this.spawn.name].roles[this.name] = value;
    }

    get creepNum() {
        return _.reduce(Game.creeps,
            (sum, creep) => {
                if (creep.room === this.spawn.room && creep.memory.role === this.name) {
                    return sum + 1;
                }
                else {
                    return sum;
                }

            }
            , 0);
    }

    getCapByWeight() {
        return Math.ceil(this.weight * this.totalMax);
    }

    calculateCap() {

        const capByWeight = this.getCapByWeight();
        var cap = capByWeight;

        // Max value is set in settings.
        if (this.max >= 0 && cap > this.max) {
            cap = this.max;
        }

        this.memory.cap = cap;
    }

    isCapacityFull() {
        return this.creepNum >= this.memory.cap;
    }

}

module.exports = Role;
