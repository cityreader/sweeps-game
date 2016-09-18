var tools = require('tools');


const filterLookByRule = (rule) =>
    (look) => look.reduce((result, lookObject) => rule(result, lookObject), []);

const ruleFindInaccessibleLook = (result, lookObject) => {
    if (lookObject.type == LOOK_TERRAIN && ['wall', 'lava'].indexOf(lookObject.terrain) !== -1) {

        result.push(lookObject);
        return result;
    }
    else {
        return result;
    }
}

/**
 * ===============================================
 */

const bootstrap = (room) => {

    /**
     *
     * @param pos
     */
    const findAccessiblePos = (room, pos) => {
        const x = pos.x;
        const y = pos.y;

        const targets = [
            {x: x -1, y: y-1}, {x: x, y: y-1}, {x: x+1, y: y-1},
            {x: x -1, y: y},                   {x: x+1, y: y},
            {x: x -1, y: y+1}, {x: x, y: y+1}, {x: x+1, y: y+1},
        ];

        const total = targets.reduce((count, target) => {

            const look = room.lookAt(target.x, target.y);

            const filterInaccessibleLook = filterLookByRule(ruleFindInaccessibleLook);

            const result = filterInaccessibleLook(look);

            // There is no wall or lava ^_^
            if (result.length === 0) {
                count += 1
            }

            return count;

        }, 0);

        return total;
    }

    const findAccessiblePosAroundSource = (room) => {
        var sources = room.find(FIND_SOURCES);

        _.forEach(sources, (source) => {
            const total = findAccessiblePos(room, source.pos);

            const data = {
                capacity: total,
                workers: [],
                max: false,
                moverId: null,
            }

            source.memory = data;
        });
    }

    findAccessiblePosAroundSource(room);
}

class RoomManager {

    constructor(room) {
        bootstrap(room);
    }

}

module.exports = RoomManager;
