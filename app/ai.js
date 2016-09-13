var tools = require('tools');
var RoomManager = require('RoomManager');

const ai = {

    run: function() {

        if (this.roomManagers === undefined) {
            this.roomManagers = [];
        }

        _.forEach(Game.rooms, (room) => {

            if (this.roomManagers.indexOf(room.name) === -1) {

                var RoomManagerInstance = new RoomManager(room);
                this.roomManagers.push(RoomManagerInstance);

            }

        });

    },

}

module.exports = ai;
