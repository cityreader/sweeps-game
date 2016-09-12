var tools = require('tools');

var bootstrap = {

    run: function() {
        tools.watchDog('bootstrap is started');

        const compose = (fns) =>
            (arg) => {
                return fns.reduce(
                    (composed, f) => f(composed),
                    arg
                );
            }


        /**
         * Currying function to create flags.
         *
         * @param keyName
         * @param prefix
         */
        const createFlags = (keyName, prefix) =>
            (obj) => {
                _.map(obj[keyName], (target, index) => {
                    const flagName = `${prefix}${index}`;
                    const colors = tools.getRandomColors(2);

                    console.log(`color1 ${colors[0]} color2 ${colors[1]}`);
                    const result = obj.room.createFlag(target.pos, flagName, colors[0], colors[1]);

                    if (result == OK) {
                        tools.watchDog(`Create new flag ${flagName}`);
                    }
                });

                return obj;
            }

        const findFirstRoom = (obj) => {
            const room = _.reduce(obj.rooms, (result, room) => room, {});

            tools.watchDog(`Find default room ${room.name}`);

            return Object.assign({}, obj, {room});
        };

        const findSources = (obj) => {
            const sources = obj.room.find(FIND_SOURCES);

            return Object.assign({}, obj, {sources});
        };

        const createRoomControllerFlag = (obj) => {
            const flagName = 'RC';
            const result = obj.room.createFlag(obj.room.controller.pos, flagName, COLOR_BLUE, COLOR_CYAN);
            if (result == OK) {
                tools.watchDog(`Create new flag ${flagName}`);
            }

            return obj;
        };

        const findPathToEnergySource0 = (obj) => {
            obj.room.findPath

        };

        const findPathToRoomController = (obj) => {


        };

        const createFirstContainer = (obj) => {
            const flag = Game.flags.Energy0;
            // const result = obj.room.createConstructionSite(flag.pos, STRUCTURE_CONTAINER);
            // if (result == OK) {
            //     tools.watchDog(`Create new container`);
            // }

            return obj;
        };



        const createFirstMiner = (obj) => {

        };


        const fns = [
            findFirstRoom,
            findSources,
            createFlags('sources', 'Source'),
            createFlags('spawns', 'Spawn'),
            createRoomControllerFlag,
            createFirstContainer,
            findPathToEnergySource0,
            findPathToRoomController,
            createFirstMiner,
        ];


        const processing = compose(fns);

        processing(Game);




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

}

const ai = {
    run: function() {
        tools.watchDog('ai is started');
        bootstrap.run();


    },
}

module.exports = ai;
