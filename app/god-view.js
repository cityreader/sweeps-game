const godViewFactory = () => {
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
    console.log(`Creep ${creep.name} [${creepRole}]`);
    stats[spawnName][creepRole] += 1;

    return stats;
  }, {});

  const creepCaps = Memory.roleControllers;

  return {
    creepCount: creeps.length,
    creepStats,
    creepCaps,
  };
};

module.exports = godViewFactory;
