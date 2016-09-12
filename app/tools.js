const WATCHDOG_ERROR = 0;
const WATCHDOG_WARNING = 3;
const WATCHDOG_DEBUG = 6;

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

const getRandomValueFromArray = (myArray) => myArray[Math.floor(Math.random() * myArray.length)];

var tools = {
    errorDisplay: 6,

    watchDog: function (text, level = WATCHDOG_DEBUG) {
        if (this.errorDisplay <= level) {
            console.log(`${level}: ${text}`);
        }
    },

    getRandomColors: function(num = 2) {
        var result = [];

        for (let i = 0; i < num; i++) {
            const color = getRandomValueFromArray(ALL_COLORS);
            console.log(`find colour ${color}`);
            result.push(color);
        }

        return result;
    },

}

module.exports = tools;
