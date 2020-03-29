const creeps = Object.values(Game.creeps);

const creepStats = creeps.reduce((stats, creep) => {
  const spawnName = creep.spawn.name;
  if (!stats[spawnName]) {
    stats[spawnName] = {};
  }

  const creepRole = creep.memory.role;
  if (!stats[spawnName][creepRole]) {
    stats[spawnName][creepRole] = 0;
  }

  stats[spawnName][creepRole] += 1;

  return stats;
}, {});

const creepCaps = Memory.roleControllers;

GodView = {
  creepCount: creeps.length,
  creepStats,
  creepCaps,
};

// Export GodView to global object.
global.GodView = GodView;

module.exports = GodView;
