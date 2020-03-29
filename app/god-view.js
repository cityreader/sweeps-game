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

GodView = {
  creepCount: creeps.length,
  creepStats,
};

global.GodView = GodView;

module.exports = GodView;
