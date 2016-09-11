var gameSettings = {
    creeps: {
        harvester: [
            // {
            //     echo: true,
            //     model: 'b1',
            //     max: 1
            // },
            {
                echo: true,
                model: 'b2',
                max: 3,
                source: 1,
            }
        ],
        upgrader: [
            {
                echo: false,
                model: 'b2',
                max: 4,
                source: 0
            }
        ],
        builder: [
            // {
            //     echo: true,
            //     model: 'b1',
            //     max: 1
            // },
            {
                echo: true,
                model: 'b2',
                max: 3,
                source: 1,
            }
        ]
    }
}

module.exports = gameSettings;
