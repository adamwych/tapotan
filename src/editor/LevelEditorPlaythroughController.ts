import { GameState } from "../core/GameManager";
import WidgetSignTextBubble from "../screens/widgets/WidgetSignTextBubble";
import GameObjectComponentAI from "../world/components/ai/GameObjectComponentAI";
import GameObjectComponentCollectableCollector from "../world/components/GameObjectComponentCollectableCollector";
import GameObjectComponentLockKey from "../world/components/GameObjectComponentLockKey";
import LevelEditorContext from "./LevelEditorContext";
import GameObjectComponentParallaxBackground from "../world/components/backgrounds/GameObjectComponentParallaxBackground";
import GameObject from "../world/GameObject";

export default class LevelEditorPlaythroughController {

    private context: LevelEditorContext;
    private playing: boolean = false;

    constructor(context: LevelEditorContext) {
        this.context = context;
    }

    public toggle() {
        if (this.playing) {
            this.stop();
        } else {
            this.play();
        }

        return this.playing;
    }

    public play(spawnPlayer: boolean = true) {
        this.playing = true;

        this.context.getGame().getViewport().top = 0;
        this.context.getGame().getViewport().left = 0;

        const world = this.context.getWorld();
        world.getGameObjects().forEach(gameObject => {
            gameObject.interactive = false;
            gameObject.alpha = 1;

            if (gameObject.hasComponentOfType(GameObjectComponentAI)) {
                gameObject.getComponentByType<GameObjectComponentAI>(GameObjectComponentAI).setAIEnabled(true);
                gameObject.setCustomProperty('monster.startPositionX', gameObject.transformComponent.getPositionX());
                gameObject.setCustomProperty('monster.startPositionY', gameObject.transformComponent.getPositionY());
            }
        });

        if (spawnPlayer) {
            world.spawnPlayer();
        }

        this.context.getGame().getGameManager().setGameState(GameState.Playing);
        this.context.getEditorScreen().getSpawnPointShadeObject().visible = false;

        this.context.emit('playthroughStarted');
        this.context.emit('hideUI');

        this.context.getEditorScreen().handleRightMouseButtonClick();
        this.context.getEditorScreen().blurActiveAndHoveredObjectOutline();

        world.handleGameStart();
    }

    public stop() {
        this.playing = false;

        this.context.getGame().getGameManager().setGameState(GameState.InEditor);
        this.context.getGame().getGameManager().setHasEnded(false);

        const world = this.context.getWorld();
        const player = world.getPlayer();

        world.getGameObjects().forEach(gameObject => {
            if (gameObject.hasComponentOfType(GameObjectComponentAI)) {
                gameObject.getComponentByType<GameObjectComponentAI>(GameObjectComponentAI).setAIEnabled(false);

                gameObject.transformComponent.setPosition(
                    gameObject.getCustomProperty('monster.startPositionX'),
                    gameObject.getCustomProperty('monster.startPositionY')
                );
            }
        });

        // Bring back collected collectables.
        const collector = player.getComponentByType<GameObjectComponentCollectableCollector>(GameObjectComponentCollectableCollector);
        collector.getCollectables().forEach(collectable => {
            collectable.getGameObject().visible = true;
        });

        player.destroy();
        world.removeGameObject(player);

        if (WidgetSignTextBubble.getCurrentlyVisibleBubble()) {
            WidgetSignTextBubble.getCurrentlyVisibleBubble().hide();
        }

        this.context.getEditorScreen().getSpawnPointShadeObject().visible = true;
        this.context.getEditorScreen().handleCurrentLayerChange(this.context.getCurrentLayer());

        this.context.emit('playthroughStopped');
        this.context.emit('showUI');

        world.handleGameEnd(null);
    }

}