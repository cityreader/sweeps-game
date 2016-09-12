const WATCHDOG_ERROR = 0;
const WATCHDOG_WARNING = 3;
const WATCHDOG_DEBUG = 6;

var tools = {
    errorDisplay: 6,

    watchDog: function (text, level = WATCHDOG_DEBUG) {
        if (this.errorDisplay <= level) {
            console.log(`${level}: ${text}`);
        }
    },

}

module.exports = tools;
