class Role {

    constructor(name, settings, totalMax) {
        this.name = name;
        this.max = _.isUndefined(settings.max) ? -1 : settings.max;
        this.weight = settings.weight;
        this.body = settings.body;
        this.totalMax = totalMax;
    }

    get memory() {
        if (_.isUndefined(Memory.roles)) {
            Memory.roles = {};
        }

        if (_.isUndefined(Memory.roles)) {
            Memory.roles = {};
        }

        if (!_.isObject(Memory.roles)) {
            return undefined;
        }

        Memory.roles[this.name] = Memory.roles[this.name] || {};
        return Memory.roles[this.name];
    }

    set memory(value) {
        console.log('aaa')
        console.log(`value ${value}`)

        if (_.isUndefined(Memory.roles)) {
            Memory.roles = {};
            Memory.roles[this.name] = {};
        }

        if (!_.isObject(Memory.roles)) {
            throw new Error('Could not set role memory');
        }

        Memory.roles[this.name] = value;
    }

    get creepNum() {
        return _.filter(Game.creeps, (creep) => creep.memory.role === this.name);
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

        this.memory;

        this.memory.cap = cap;
    }

    isCapacityFull() {
        return this.creepNum == this.memory.cap;
    }

}

module.exports = Role;
