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
            this.createRoad(room, roadName, x, y);
        }
    },

    getState: function(roadName) {
        if (Memory.road === undefined) {
            Memory.road = {};
        }

        if (Memory.road[roadName] === undefined) {
            Memory.road[roadName] = {};
        }

        return Memory.road[roadName];
    },

    getStep: function(roadName) {
        const roadState = this.getState(roadName);

        if (roadState.step === undefined) {
            roadState.step = 0;
        }

        return roadState.step;
    },

    checkProgress: function(room, x, y) {
        const pos = room.getPositionAt(x, y);
        // var source = pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    },

    isCompleted: function(roadName) {
        const roadState = this.getState(roadName);

        if (roadState.status && roadState.status == ROAD_COMPLETE) {
            return true;
        }

        const step = this.getStep(roadName);

        if (step > (roadSettings[roadName].length - 1)) {
            roadState.status = ROAD_COMPLETE;
            return true;
        }

        return false;
    },

    findPos: (room, roadName) => {
        const step = Memory.road[roadName].step;
        return roadSettings[roadName][step];
    },

    createRoad: (room, roadName, x, y) => {
        const result = room.createConstructionSite( x, y, STRUCTURE_ROAD );
        console.log(`Create road result ${result}`);

        if (result == OK || result == ERR_INVALID_TARGET) {
            Memory.road[roadName].step++;
        }
    }
}

module.exports = spawnBuildingRoad;
