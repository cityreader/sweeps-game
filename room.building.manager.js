const roomBuildingSettings = require('room.building.settings');

const BUILD_BUILDING = 0;
const BUILD_COMPLETE = 1;

const roomBuildingManager = {
    run: function(room) {
        const buildName = 'w1';
        this.build(room, buildName);
    },

    build: function(room, buildName) {
        if (!this.isCompleted(buildName)) {
            var {x, y} = this.findPos(room, buildName);
            console.log(`findPos x: ${x}, y: ${y}`);

            const build = this.getBuild(buildName);

            if (build) {
                this.createStructure(room, buildName, build.type, x, y);
            }
            else {
                console.log(`Cannot get build ${buildName}`);
            }
        }
    },

    getState: function(buildName) {
        if (Memory.builds === undefined) {
            Memory.builds = {};
        }

        if (Memory.builds[buildName] === undefined) {
            Memory.builds[buildName] = {};
        }

        return Memory.builds[buildName];
    },

    getStep: function(buildName) {
        const buildState = this.getState(buildName);

        if (buildState.step === undefined) {
            buildState.step = 0;
        }

        return buildState.step;
    },

    checkProgress: function(room, x, y) {
        const pos = room.getPositionAt(x, y);
        // var source = pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    },

    isCompleted: function(buildName) {
        const buildState = this.getState(buildName);

        if (buildState.status && buildState.status == BUILD_COMPLETE) {
            return true;
        }

        const step = this.getStep(buildName);

        if (step > (roomBuildingSettings[buildName].pos.length - 1)) {
            buildState.status = BUILD_COMPLETE;
            return true;
        }

        return false;
    },

    findPos: (room, buildName) => {
        const step = Memory.builds[buildName].step;
        return roomBuildingSettings[buildName].pos[step];
    },

    createStructure: (room, buildName, structureType, x, y) => {
        const result = room.createConstructionSite( x, y, structureType );
        console.log(`Create ${structureType} result ${result}`);

        if (result == OK || result == ERR_INVALID_TARGET) {
            Memory.builds[buildName].step++;
        }
    },

    getBuild: (buildName) => roomBuildingSettings[buildName] ? roomBuildingSettings[buildName] : false

}

module.exports = roomBuildingManager;
