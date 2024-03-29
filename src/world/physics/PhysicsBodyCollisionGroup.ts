enum PhysicsBodyCollisionGroup {
    Player = Math.pow(2, 0),
    Entity = Math.pow(2, 1),
    Block = Math.pow(2, 2),
    Collectable = Math.pow(2, 3),
    Sensor = Math.pow(2, 4)
};

const PhysicsBodyCollisionMasks = {
    Entity: (
        PhysicsBodyCollisionGroup.Player |
        PhysicsBodyCollisionGroup.Block |
        PhysicsBodyCollisionGroup.Entity |
        PhysicsBodyCollisionGroup.Collectable |
        PhysicsBodyCollisionGroup.Sensor
    ),

    Monster: (
        PhysicsBodyCollisionGroup.Player |
        PhysicsBodyCollisionGroup.Block |
        PhysicsBodyCollisionGroup.Collectable |
        PhysicsBodyCollisionGroup.Sensor
    )
}

export { PhysicsBodyCollisionMasks };
export default PhysicsBodyCollisionGroup;