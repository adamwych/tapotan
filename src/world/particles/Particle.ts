import WorldObject from "../WorldObject";
import World from "../World";

export default abstract class Particle extends WorldObject {

    constructor(world: World) {
        super(world);
    }
}