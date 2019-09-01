import * as p2 from 'p2';
import * as PIXI from 'pixi.js';
import Tileset from "./Tileset";
import World from "../World";
import WorldObject from '../WorldObject';
import SpritesheetAnimator from '../../graphics/SpritesheetAnimator';
import WorldObjectType from '../WorldObjectType';

export default class TileStar extends WorldObject {

    private animator: SpritesheetAnimator;
    private container: PIXI.Container;
    private variationIdx: number;

    constructor(world: World, tileset: Tileset, variationIdx: number) {
        super(world);

        this.name = 'STAR';
        this.worldObjectType = WorldObjectType.Star;
        this.variationIdx = variationIdx;

        const idleSpritesheet = tileset.getResourceByPath('Sky/Stars/Variation' + variationIdx + '_Idle').texture;
        const animationSpritesheet = tileset.getResourceByPath('Sky/Stars/Variation' + variationIdx + '_Animation').texture;

        idleSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        animationSpritesheet.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.animator = new SpritesheetAnimator(this);
        this.animator.addAnimation('idle', new PIXI.Sprite(idleSpritesheet), 1, 9999);
        this.animator.addAnimation('animation', new PIXI.Sprite(animationSpritesheet), 2, 300);
        this.animator.setCellWidth(16);
        this.animator.setCellHeight(16);
        this.animator.setTransformMultiplier(16);
        this.animator.playAnimation('animation');

        this.container = new PIXI.Container();
        this.container.addChild(this.animator);
        this.container.scale.set(1 / 16, 1 / 16);
        this.addChild(this.container);
    }

    public serialize() {
        return {
            ...super.serialize(),
            variationIdx: this.variationIdx
        }
    }

    public static fromSerialized(world, tileset, json) {
        return new TileStar(world, tileset, json.variationIdx);
    }

}