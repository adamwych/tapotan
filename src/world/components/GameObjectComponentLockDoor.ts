import * as PIXI from 'pixi.js';
import GameObjectComponent from "../GameObjectComponent";
import GameObjectComponentAnimator from './GameObjectComponentAnimator';
import * as p2 from 'p2';
import GameObjectComponentPhysicsBody from './GameObjectComponentPhysicsBody';

export default class GameObjectComponentLockDoor extends GameObjectComponent {

    private animator: GameObjectComponentAnimator;
    private physicsBody: p2.Body;

    private editorOverlay: PIXI.Graphics;
    private editorFadeTimer: number = 0;

    private locked: boolean = true;

    public initialize(): void {
        this.animator = this.gameObject.getComponentByType(GameObjectComponentAnimator);
        this.physicsBody = this.gameObject.getComponentByType<GameObjectComponentPhysicsBody>(GameObjectComponentPhysicsBody).getBody();

        this.editorOverlay = new PIXI.Graphics();
        this.editorOverlay.beginFill(0x37ba27);
        this.editorOverlay.drawRect(0, 0, this.gameObject.getWidth(), this.gameObject.getHeight());
        this.editorOverlay.endFill();
        this.editorOverlay.visible = false;
        this.gameObject.addChild(this.editorOverlay);
    }

    protected destroy(): void {

    }

    public tick = (dt: number) => {
        if (this.editorOverlay.visible) {
            this.editorFadeTimer += dt;

            let alpha = Math.min(2, this.editorFadeTimer / 0.5);
            if (alpha === 2) {
                this.editorFadeTimer = 0;
            }
    
            if (alpha > 1) {
                this.editorOverlay.alpha = 2 - alpha;
            } else {
                this.editorOverlay.alpha = alpha;
            }
        }
    }

    public setEditorOverlayVisible(visible: boolean) {
        this.editorOverlay.visible = visible;
        this.editorFadeTimer = 0;
    }

    public lock() {
        this.locked = true;
        this.animator.playAnimation('locked');
        this.physicsBody.collisionResponse = true;
    }

    public unlock() {
        this.locked = false;
        this.animator.playAnimation('unlocked');
        this.physicsBody.collisionResponse = false;
    }

    public isLocked(): boolean {
        return this.locked;
    }
    
}