var tools = require('tools');
var RoomManager = require('RoomManager');

const ai = {

    run: function() {

        console.log(`ai is running`);

        if (this.roomManagers === undefined) {
            this.roomManagers = [];
        }

        _.forEach(Game.rooms, (room) => {

            if (this.roomManagers.indexOf(room.name) === -1) {

                console.log(`ai: roomManager does not exist for room ${room.name}`);

                var RoomManagerInstance = new RoomManager(room);
                this.roomManagers[room.name] = RoomManagerInstance;

            }

        });

        _.forEach(this.roomManagers, (roomManager) => {
            roomManager.run();
        });

    },

}

module.exports = ai;
