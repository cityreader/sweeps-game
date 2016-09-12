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



        const findFirstRoom = (obj) => {
            const room = _.reduce(obj.rooms, (result, room) => room, {});

            tools.watchDog(`Find default room ${room.name}`);

            obj.room = room;
            return obj;
        };

        const findSources = (obj) => {
            const sources = obj.room.find(FIND_SOURCES);

            obj.sources = sources;

            return obj;
        };

        const createEnergyFlags = (obj) => {
            obj.sources.map((source, index) => {
                tools.watchDog(`Find source ${index} x ${source.pos.x} y ${source.pos.y}`);

                const flagName = `Energy${index}`;
                const result = obj.room.createFlag(source.pos, flagName, COLOR_PURPLE, COLOR_BLUE);
                if (result == OK) {
                    tools.watchDog(`Create new flag ${flagName}`);
                }
            });

            return obj;
        };

        const createRoomControllerFlag = (obj) => {
            const flagName = 'RC';
            const result = obj.room.createFlag(obj.room.controller.pos, flagName, COLOR_BLUE, COLOR_CYAN);
            if (result == OK) {
                tools.watchDog(`Create new flag ${flagName}`);
            }

            return obj;
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
            createEnergyFlags,
            createRoomControllerFlag,
            createFirstContainer
            createFirstMiner,
        ];


        const processing = compose(fns);

        var obj = {
            rooms: Game.rooms,
        }

        processing(obj);




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
