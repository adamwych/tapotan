import World from "../World";
import WorldObject from "../WorldObject";
import Tileset from "./Tileset";
import WorldObjectType from "../WorldObjectType";

export default abstract class Tile extends WorldObject {

    protected tileset: Tileset;

    constructor(world: World, tileset: Tileset) {
        super(world);
        
        this.tileset = tileset;
        this.worldObjectType = WorldObjectType.Tile;
    }
}