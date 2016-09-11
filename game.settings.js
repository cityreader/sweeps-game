var gameSettings = {
    creeps: {
        harvester: [
            {
                echo: true,
                model: 'b1',
                max: 1
            },
            {
                echo: true,
                model: 'b2',
                max: 2
            }
        ],
        upgrader: [
            {
                echo: true,
                model: 'b2',
                max: 2
            }
        ],
        builder: [
            {
                echo: true,
                model: 'b1',
                max: 2
            },
            {
                echo: true,
                model: 'b2',
                max: 1
            }
        ]
    }
}

module.exports = gameSettings;
