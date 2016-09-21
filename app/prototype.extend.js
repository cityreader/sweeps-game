/**
 * =========== Room ===========
 */

Room.prototype.stats = function() {
    return {
        myCreepsCnt: this.find(FIND_MY_CREEPS).length,
        enemiesCnt: this.find(FIND_HOSTILE_CREEPS).length
    };
};

/**
 * =========== Source ===========
 */

/**
 * Add memory link to source object.
 */
Object.defineProperty(Source.prototype, 'memory', {
    get() {
        if (_.isUndefined(Memory.sources)) {
            Memory.sources = {};
        }

        if (!_.isObject(Memory.sources)) {
            return undefined;
        }

        Memory.sources[this.id] = Memory.sources[this.id] || {};
        return Memory.sources[this.id];
    },

    set(value) {
        if (_.isUndefined(Memory.sources)) {
            Memory.sources = {};
            Memory.sources[this.id] = {};
        }

        if (!_.isObject(Memory.sources)) {
            throw new Error('Could not set source memory');
        }

        Memory.sources[this.id] = value;
    }
});


/**
 * =========== Creep ===========
 */

/**
 * Print creep object.
 *
 * @returns {string}
 */
Creep.prototype.toString = function() {
    const colors = {
        harvester: '#FFD180',
        mover:     '#F48024',
        upgrader:  '#AE81FF',
        builder:   '#428BCA',
        repairer:  '#A6E22E',
        attacker:  '#FF0000',
    };
    const role = this.memory.role;
    return `<font color="${colors[role]}">${role}</font> ${this.name}`;
}

module.exports = {};
