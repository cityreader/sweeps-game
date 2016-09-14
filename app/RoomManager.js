var tools = require('tools');
var CreepManager = require('CreepManager');

// "use strict";


// const makeParent = (fields, object={}) => {
//     var fields_arr = fields.split('.');
//
//     const first = fields_arr.shift();
//     const remaining = fields_arr;
//
//     console.log(`first ${first} ${remaining}`);
//
//     return (remaining.length) ?
//         makeParent(remaining.join('.'), object[first]) : (object[first] !== undefined ? object[first] : object[first] = {})
// }

const compose = (fns) =>
    (arg) => {
        return fns.reduce(
            (composed, f) => f(composed),
            arg
        );
    }

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

const bootstrap = (RoomManagerObj) => {
    tools.watchDog('bootstrap is started');

    /**
     * Currying function to create flags.
     *
     * @param keyName
     * @param prefix
     */
    const createFlags = (keyName, prefix = '') =>
        (obj) => {
            _.map(obj[keyName], (target, index) => {
                let flagName = `${prefix}${index}`;
                let colors = tools.getRandomColors(2);

                const result = obj.room.createFlag(target.pos, flagName, colors[0], colors[1]);

                if (result == OK) {
                    tools.watchDog(`Create new flag ${flagName}`);
                }
            });

            return obj;
        }

    /**
     * Currying function to find path of two pos.
     *
     * @param flag1
     * @param flag2
     * @param opts
     * @param memoryName
     */
    const findPath = (flag1, flag2, opts, memoryName = '') =>
        (obj) => {
            console.log(`${flag1} ${flag2}`);
            console.log(`${flag1} ${flag2}`);
            const result = obj.room.findPath(obj.flags[flag1].pos, obj.flags[flag2].pos, opts);
            if (result) {
                tools.watchDog(`Find path from ${flag1} to ${flag1}`);

                if (memoryName != '') {
                    makeParent('paths', Memory);
                    Memory.paths[memoryName] = result;
                    tools.watchDog(`Save path to Memory.paths.${memoryName}`);
                }
            }

            return obj;
        }

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

        const found = targets.reduce((keenTargets, target) => {

            const look = room.lookAt(target.x, target.y);

            const filterInaccessibleLook = filterLookByRule(ruleFindInaccessibleLook);

            const result = filterInaccessibleLook(look);

            // There is no wall or lava ^_^
            if (result.length == 0) {
                keenTargets.push(target);
            }

            return keenTargets;

        }, []);

        return found;
    }


    const findSpawn = (obj) => {

        console.log(`bootstrap: findSpawn starts`);

        const spawns = obj.room.find(FIND_MY_SPAWNS);
        const spawn = spawns.shift();

        obj.spawn = spawn;

        obj.memory.spawn = {
            name: spawn.name,
            x: spawn.pos.x,
            y: spawn.pos.y,
        }

        console.log(`bootstrap: findSpawn completed`);

        return obj;
    }


    // const findFirstRoom = (obj) => {
    //     const room = _.reduce(obj.rooms, (result, room) => room, {});
    //
    //     tools.watchDog(`Find default room ${room.name}`);
    //
    //     return Object.assign({}, obj, {room});
    // };

    const findSources = (obj) => {

        console.log(`bootstrap: findSources starts`);

        const sources = obj.room.find(FIND_SOURCES);

        obj.sources = sources;

        obj.memory.sources = [];

        _.forEach(sources, (source, index) => {
            obj.memory.sources[index] = {
                x: source.pos.x,
                y: source.pos.y,
            }
        });

        console.log(`bootstrap: findSources completed`);

        return obj;
    }

    const findAccessiblePosAroundSource = (obj) => {

        console.log(`bootstrap: findAccessiblePosAroundSource starts`);

        _.forEach(obj.memory.sources, (sourceHash, index) => {

            const found = findAccessiblePos(obj.room, sourceHash);

            obj.memory.sources[index].harvestPos = [];
            _.forEach(found, (pos) => {
                obj.memory.sources[index].harvestPos.push(pos);
            });

        });

        console.log(`bootstrap: findAccessiblePosAroundSource completed`);

        return obj;
    }

    // const createRoomControllerFlag = (obj) => {
    //     const flagName = 'RC';
    //     const result = obj.room.createFlag(obj.room.controller.pos, flagName, COLOR_BLUE, COLOR_CYAN);
    //     if (result == OK) {
    //         tools.watchDog(`Create new flag ${flagName}`);
    //     }
    //
    //     return obj;
    // }



    const createFirstContainer = (obj) => {
        const flag = Game.flags.Energy0;
        // const result = obj.room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER);
        // if (result == OK) {
        //     tools.watchDog(`Create new container`);
        // }

        return obj;
    }



    const createInitialCreeps = (obj) => {

        console.log(`bootstrap: createInitialCreeps starts`);

        var harvestLocation = obj.memory.sources[0].harvestPos[0];
        var spawnLocation = obj.memory.spawn;

        obj.creepManager.create('harvester', {
            source: obj.sources[0],
            at: harvestLocation,
        });
        // obj.creepManager.create('mover', {
        //     from: harvestLocation,
        //     to: spawnLocation,
        // });

        console.log(`bootstrap: createInitialCreeps completed`);

        return obj;
    };


    const fns = [
        // findFirstRoom,
        findSpawn,
        findSources,
        // createFlags('sources', 'Source'),
        // createFlags('spawns'),
        findAccessiblePosAroundSource,
        // createRoomControllerFlag,
        // findPath('Spawn1', 'Source0', undefined, 'PathSource0'),
        // findPath('Spawn1', 'RC', undefined, 'PathRC'),
        // createFirstContainer,
        // createFirstMiner,
        createInitialCreeps,
    ];


    const processing = compose(fns);


    processing(RoomManagerObj);


    // const room = findFirstRoom(Game.rooms);
    // tools.watchDog(`Find default room ${room.name}`);

    // const sources = room.find(FIND_SOURCES);

    // sources.map((source, index) => {
    //     tools.watchDog(`Find source ${index} x ${source.pos.x} y ${source.pos.y}`);
    //
    //     const flagName = `Energy${index}`;
    //     const result = room.createFlag(source.pos, flagName, COLOR_PURPLE, COLOR_BLUE);
    //     if (result == OK) {
    //         tools.watchDog(`Create new flag ${flagName}`);
    //     }
    // });
    //
    // const createContainer = (flag) => {
    //     const result = room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER);
    //     if (result == OK) {
    //         tools.watchDog(`Create new container`);
    //     }
    // }
    // createContainer(Game.flags.Energy0);


}

class RoomManager {

    constructor(room) {

        console.log(`RoomManager: constructor starts`);

        this.room = room;

        this.creepManager = new CreepManager(this);

        Memory.rooms[room.name] = {};

        this.memory = Memory.rooms[room.name];

        console.log(`RoomManager: bootstrap starts`);

        bootstrap(this);

        console.log(`RoomManager: constructor completed`);
    }


    run() {
        this.creepManager.run();
    }

}

module.exports = RoomManager;
