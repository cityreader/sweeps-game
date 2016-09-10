const roadSettings = require('road.settings');

const ROAD_BUILDING = 0;
const ROAD_COMPLETE = 1;

var spawnBuildingRoad = {
    run: function(room) {
        const roadName = 'm1';
        this.build(room, roadName);
    },

    build: function(room, roadName) {
        if (!this.isCompleted(roadName)) {
            var {x, y} = this.findPos(room, roadName);
            console.log(`findPos x: ${x}, y: ${y}`);
            this.createRoad(room, x, y);
        }
    },

    isCompleted: (roadName) => {
        if (Memory.road === undefined) {
            Memory.road = {};
        }

        if (Memory.road[roadName] === undefined) {
            Memory.road[roadName] = {};
        }

        const roadState = Memory.road[roadName];

        if (roadState.status && roadState.status == ROAD_COMPLETE) {
            return true;
        }

        if (roadState.step === undefined) {
            roadState.step = 0;
        }

        if (roadState.step > (roadSettings[roadName].length - 1)) {
            roadState.status = ROAD_COMPLETE;
            return true;
        }

        return false;
    },

    findPos: (room, roadName) => {
        const step = Memory.road[roadName].step;
        return roadSettings[roadName][step];
    },

    createRoad: (room, x, y) => {
        const result = room.createConstructionSite( x, y, STRUCTURE_ROAD );
        console.log(`Create road result ${result}`);
    }
}

module.exports = spawnBuildingRoad;
