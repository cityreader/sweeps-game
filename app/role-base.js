class RoleBase {
  getMoveTicks(creep) {
    if (!creep.memory.moveTicks) {
      creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
    }
  }
}

module.exports = RoleBase;
