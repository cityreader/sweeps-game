var tools = require('tools');
var RoomManager = require('RoomManager');

const ai = {

    run: function() {

        _.forEach(Game.rooms, (room) => {

            if (room.memory.bootstrap === undefined) {

                console.log(`ai: roomManager does not exist for room ${room.name}`);

                new RoomManager(room);

                room.memory.bootstrap = true;

            }

        });

    },

}

module.exports = ai;
