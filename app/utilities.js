const ALL_COLORS = [
    COLOR_RED,
    COLOR_PURPLE,
    COLOR_BLUE,
    COLOR_CYAN,
    COLOR_GREEN,
    COLOR_YELLOW,
    COLOR_ORANGE,
    COLOR_BROWN,
    COLOR_GREY,
    COLOR_WHITE
];

var utilities = {
    getRandomValueFromArray(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    getRandomColor() {
        return this.getRandomValueFromArray(ALL_COLORS);

    },
};


module.exports = utilities;
