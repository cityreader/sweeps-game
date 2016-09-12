/**
 * Useful scripts.
 */

Game.rooms['E58N16'].createConstructionSite(10, 16, Game.STRUCTURE_EXTENSION);


/**
 * Create extension.
 */
Game.spawns['Spawn1'].room.createConstructionSite( 14, 38, STRUCTURE_EXTENSION );

/**
 * Create road.
 */
Game.spawns['Spawn1'].room.createConstructionSite(8, 39, STRUCTURE_ROAD);

/**
 * Create wall.
 */
Game.spawns['Spawn1'].room.createConstructionSite(8, 42, STRUCTURE_WALL);

/**
 * Create tower.
 */
Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );

/**
 *==========================
 *

/**
 * Show energy available in all rooms.
 */
for(var name in Game.rooms) {
    console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
}

/**
 *==========================
 */

/**
 * Create a heavy worker.
 */
Game.spawns['Spawn1'].createCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], 'HarvesterBig', { role: 'harvester' } );
