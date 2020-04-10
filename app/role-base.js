class RoleBase {

  /**
   * Save ticks spent to move to the source.
   */
  saveMoveTicks(creep) {
    if (!creep.memory.moveTicks) {
      creep.memory.moveTicks = creep.memory.fullTicks - creep.ticksToLive;
    }
  }
}

module.exports = RoleBase;
