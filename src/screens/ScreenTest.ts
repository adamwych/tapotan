import * as PIXI from 'pixi.js';
import Tapotan from "../core/Tapotan";
import GameObjectComponentKillOnTouch from "../world/components/GameObjectComponentKillOnTouch";
import GameObjectComponentPhysicsAwareTransform from "../world/components/GameObjectComponentPhysicsAwareTransform";
import GameObjectComponentPhysicsBody from "../world/components/GameObjectComponentPhysicsBody";
import GameObjectComponentSpritesheet from "../world/components/GameObjectComponentSpritesheet";
import { GameObjectVerticalAlignment } from "../world/components/GameObjectComponentTransform";
import GameObjectDebugView from "../world/GameObjectDebugView";
import PhysicsBodyCollisionGroup from "../world/physics/PhysicsBodyCollisionGroup";
import PhysicsMaterials from "../world/physics/PhysicsMaterials";
import Prefabs from "../world/prefabs/Prefabs";
import Screen from "./Screen";
import GameObjectComponentLivingEntity from '../world/components/GameObjectComponentLivingEntity';

export default class ScreenTest extends Screen {

    constructor(game: Tapotan) {
        super(game);

        const world = this.game.getGameManager().getWorld();

        for (let i = 0; i < 12; i++) {
            const ground = Prefabs.BasicBlock(world, i, 0, {
                resource: 'ground_grass_variation0'
            });
            ground.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);

            const bodyComponent = ground.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
            bodyComponent.setMaterial(PhysicsMaterials.Ground);
            bodyComponent.setCollisionGroup(PhysicsBodyCollisionGroup.Block);
            bodyComponent.setCollisionMask(PhysicsBodyCollisionGroup.Entity | PhysicsBodyCollisionGroup.Player);
            
            ground.createComponent<GameObjectComponentKillOnTouch>(GameObjectComponentKillOnTouch).initialize();
        }

        let testObject = world.createGameObject();
        {
            testObject.createComponent<GameObjectComponentLivingEntity>(GameObjectComponentLivingEntity);

            const body = testObject.createComponent<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody);
            body.initializeBox(1, 1, {
                mass: 1,
                fixedRotation: true,
            });

            body.setMaterial(PhysicsMaterials.Player);
            body.setCollisionGroup(PhysicsBodyCollisionGroup.Player);
            body.setCollisionMask(PhysicsBodyCollisionGroup.Block);

            testObject.createComponent<GameObjectComponentPhysicsAwareTransform>(GameObjectComponentPhysicsAwareTransform);
            testObject.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            testObject.transformComponent.translate(2, 6);
            const texture = Tapotan.getInstance().getGameManager().getWorld().getTileset().getResourceByID('environment_coin_animation').texture;
            const spritesheetComponent = testObject.createComponent<GameObjectComponentSpritesheet>(GameObjectComponentSpritesheet);
            spritesheetComponent.initialize();
            spritesheetComponent.addAnimation('animation', new PIXI.Sprite(texture), 8, 100);
            spritesheetComponent.playAnimation('animation');
        }

        this.addChild(world);

        const gameObjectDebugView = new GameObjectDebugView();
        gameObjectDebugView.initialize();
        gameObjectDebugView.inspectGameObject(testObject);
    }
}