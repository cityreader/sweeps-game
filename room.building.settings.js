var roomBuildingSettings = {
    // Main road
    m1: {
        type: STRUCTURE_ROAD,
        pos: [
            {x: 13, y: 34},
            {x: 14, y: 33},
            {x: 15, y: 32},
            {x: 16, y: 31},
            {x: 17, y: 30},
            {x: 18, y: 29},
            {x: 19, y: 28},
            {x: 20, y: 27},
            {x: 21, y: 26},
            {x: 22, y: 25},
            {x: 23, y: 24},
            {x: 23, y: 23},
            {x: 23, y: 22},
            {x: 23, y: 21},
            {x: 23, y: 20},
            {x: 23, y: 19},
            {x: 23, y: 18},
            {x: 23, y: 17},
            {x: 23, y: 16},
            {x: 24, y: 16},
            {x: 24, y: 15},
            {x: 25, y: 15},
            {x: 26, y: 15},
            {x: 27, y: 15},
            {x: 27, y: 16},
            {x: 28, y: 16},
            {x: 28, y: 17},
            {x: 28, y: 18},
            {x: 28, y: 19},
        ]
    },

    // Small roads
    m2: {
        type: STRUCTURE_ROAD,
        pos: [
            {x: 6, y: 39},
            {x: 7, y: 39},

            {x: 7, y: 40},
            {x: 7, y: 41},

            {x: 14, y: 27},
            {x: 14, y: 28},
            {x: 14, y: 29},
            {x: 14, y: 30},
            {x: 14, y: 31},
            {x: 14, y: 32},

            {x: 15, y: 26},
            {x: 16, y: 26},
            {x: 17, y: 26},
            {x: 18, y: 26},
            {x: 19, y: 26},
            {x: 20, y: 26},

            {x: 21, y: 18},
            {x: 22, y: 18},

            {x: 20, y: 28},
            {x: 21, y: 28},
            {x: 22, y: 28},
            {x: 23, y: 28},
            {x: 24, y: 28},
            {x: 25, y: 28},

            {x: 23, y: 25},
            {x: 24, y: 26},
            {x: 25, y: 27},
        ]
    },

    w1: {
        type: STRUCTURE_WALL,
        pos: [
            // south
            {x: 5, y: 38},
            // {x: 5, y: 39},
            {x: 5, y: 40},
            {x: 5, y: 41},
            {x: 5, y: 42},
            {x: 6, y: 42},
            // {x: 7, y: 42},
            {x: 9, y: 42},
            {x: 10, y: 42},
            {x: 11, y: 42},
            {x: 12, y: 42},
            {x: 13, y: 41},
            {x: 14, y: 40},
            {x: 15, y: 39},
            {x: 16, y: 38},
            {x: 17, y: 37},
            // {x: 18, y: 36},
            {x: 19, y: 35},
            {x: 20, y: 34},

            // west
            {x: 12, y: 28},
            {x: 13, y: 27},
            // {x: 14, y: 26},
            {x: 15, y: 25},
            {x: 16, y: 24},


            {x: 18, y: 22},
            {x: 19, y: 21},
            {x: 20, y: 20},

            {x: 20, y: 19},
            // {x: 20, y: 18},
            {x: 20, y: 17},
            {x: 20, y: 16},
            {x: 20, y: 15},

            // east
            {x: 24, y: 30},
            {x: 25, y: 29},
            {x: 27, y: 27},
            {x: 28, y: 26},

            // north-west
            {x: 22, y: 12},
            {x: 23, y: 11},
            {x: 24, y: 10},

            // north-east
            {x: 26, y: 10},
            {x: 27, y: 11},
            {x: 28, y: 12},
            {x: 29, y: 13},
            {x: 30, y: 14},
            {x: 31, y: 15},
            {x: 32, y: 16},
            {x: 33, y: 17},

            // rampart
            {x: 5, y: 39},
            {x: 7, y: 42},
            {x: 18, y: 36},
            {x: 14, y: 26},
            {x: 20, y: 18},
            {x: 26, y: 28},

        ]
    },

    r1: {
        type: STRUCTURE_RAMPART,
        pos: [
            {x: 5, y: 39},
            {x: 7, y: 42},
            {x: 18, y: 36},
            {x: 14, y: 26},
            {x: 20, y: 18},
            {x: 26, y: 28},
        ]
    }
}

module.exports = roomBuildingSettings;