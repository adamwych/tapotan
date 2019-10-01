import InputManager from '../core/input/InputManager';
import Tapotan from "../core/Tapotan";
import UIMainMenuRootComponent from '../ui/main-menu/UIMainMenuRootComponent';
import GameObjectComponentAnimator from '../world/components/GameObjectComponentAnimator';
import GameObjectComponentSprite from '../world/components/GameObjectComponentSprite';
import GameObjectComponentTransform, { GameObjectVerticalAlignment } from '../world/components/GameObjectComponentTransform';
import GameObject from '../world/GameObject';
import Prefabs from '../world/prefabs/Prefabs';
import World from '../world/World';
import Screen from "./Screen";

export default class ScreenMainMenu extends Screen {

    private world: World;
    
    private flyingIsland: GameObject;
    private playerObject: GameObject;
    private playerYDeviation: number = 0;

    private pathfindingPoints = [];
    private targetPoint = null;

    private currentPlayerFollowPath = null;
    private currentPlayerFollowPathIndex: number = 0;

    private timer: number = 0;

    public static flyingIslandPositionY: number = 0;

    constructor(game: Tapotan) {
        super(game);

        this.createFakeWorld();

        game.getViewport().top = 0;
        game.getViewport().left = 0;
    }

    public onRemovedFromScreenManager() {
        super.onRemovedFromScreenManager();
        this.removeChildren();
    }

    private createFakeWorld() {
        const tileset = this.game.getAssetManager().getTilesetByName('Pixelart');
        this.world = new World(this.game, 1000, 1000, tileset);
        this.world.handleGameStart();
        this.generateFakeWorldObjects(this.world);

        this.flyingIsland = this.world.createGameObject();
        let spriteComponent = this.flyingIsland.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
        spriteComponent.initialize(this.game.getAssetManager().getResourceByPath('Graphics/MainMenu/FlyingIsland.png').resource);
        this.flyingIsland.createComponent(GameObjectComponentTransform);
        this.flyingIsland.transformComponent.setScale(0.825, 0.825);
        this.flyingIsland.transformComponent.setPosition(
            this.game.getViewport().left + ((Tapotan.getViewportWidth() - this.flyingIsland.width) / 2),
            ((Tapotan.getViewportHeight() - this.flyingIsland.height) / 2) + 0.75
        );

        this.playerObject = Prefabs.CharacterMainMenuLawrence(this.world, 0, 0);
        this.playerObject.transformComponent.setPosition(
            (Tapotan.getViewportWidth() - 1) / 2,
            (Tapotan.getViewportHeight() - 1) / 2,
        );

        this.playerObject.transformComponent.setScale(0.5, 0.5);
        this.playerObject.getComponentByType<GameObjectComponentAnimator>(GameObjectComponentAnimator).playAnimation('run');

        this.pathfindingPoints = [
            [4.2, 4.15],
            [5, 4.25],
            [5.75, 4.2],
            [4.5, 4.4],
            [3.25, 4.9],
            [3.75, 5],
            [4.4, 4.8],
            [4.7, 5.15],
        ];

        this.pathfindingPoints.forEach(point => {
            point[0] = this.flyingIsland.transformComponent.getPositionX() + point[0];
            point[1] = this.flyingIsland.transformComponent.getPositionY() + point[1];
            point[3] = point[1];
        });

        this.pathfindingPoints.forEach(point => {
            let obj = this.world.createGameObject();
            let spriteComponent = obj.createComponent<GameObjectComponentSprite>(GameObjectComponentSprite);
            spriteComponent.initialize(this.game.getAssetManager().getResourceByPath('Tilesets/Pixelart/Pixel.png').resource);

            obj.createComponent(GameObjectComponentTransform);
            obj.transformComponent.setPosition(point[0], point[1]);
            obj.alpha = 0;

            point[2] = obj;
        });

        this.addChild(this.world);
    }

    private generateFakeWorldObjects(world: World) {
        const viewportWidth = Tapotan.getViewportWidth();

        for (let blockIndex = 0; blockIndex < viewportWidth / 2; blockIndex++) {
            const water = Prefabs.environment_water(world, blockIndex * 2, 0, {
                resource: 'environment_water',
                ignoresPhysics: true
            });

            water.transformComponent.setVerticalAlignment(GameObjectVerticalAlignment.Bottom);
            water.setLayer(5);
        }
    }

    protected tick = (dt: number): void => {
        this.timer += dt;

        this.tickIslandFloating(dt);
        this.tickPlayerMovement();

        ScreenMainMenu.flyingIslandPositionY = this.flyingIsland.transformComponent.getPositionY();
    }

    private tickIslandFloating(dt: number) {
        let floatDeviation = this.getIslandFloatDeviation();
        let viewportWidth = Tapotan.getViewportWidth();
        let viewportHeight = Tapotan.getViewportHeight();

        this.flyingIsland.transformComponent.setPosition(
            this.game.getViewport().left + ((viewportWidth - this.flyingIsland.width) / 2),
            ((viewportHeight - this.flyingIsland.height) / 2) + 0.75 + floatDeviation
        );

        this.playerObject.transformComponent.setPositionY(((viewportHeight - 1) / 2) + floatDeviation + this.playerYDeviation);

        this.pathfindingPoints.forEach(point => {
            point[1] = point[3] + floatDeviation;
            point[2].transformComponent.setPositionY(point[1]);
        });
    }

    private getIslandFloatDeviation() {
        return Math.cos(this.timer * 2.5) / 12;
    }

    private tickPlayerMovement() {
        let mouseX = InputManager.instance.getMouseX() / Tapotan.getBlockSize();
        let mouseY = InputManager.instance.getMouseY() / Tapotan.getBlockSize();

        let minDistance = Infinity;
        let minDistancePoint = null;

        // Find closest points.
        this.pathfindingPoints.forEach(point => {
            let distance = (
                (point[0] - mouseX) ** 2 +
                (point[1] - mouseY) ** 2
            );

            if (distance < minDistance) {
                minDistance = distance;
                minDistancePoint = point;
            }
        });

        if (minDistancePoint) {
            if (minDistancePoint !== this.targetPoint) {
                let playerPosition = [...this.playerObject.transformComponent.getPosition()];
                this.currentPlayerFollowPath = this.findPath([playerPosition[0] + 0.5, playerPosition[1] + 0.5], [minDistancePoint[0], minDistancePoint[1]]);
                this.currentPlayerFollowPathIndex = 0;

                this.targetPoint = minDistancePoint;
            }
        }

        if (this.currentPlayerFollowPath) {
            let currentFollowPathPoint = this.currentPlayerFollowPath[this.currentPlayerFollowPathIndex].position;
            let lastFollowPathPoint = this.currentPlayerFollowPath[this.currentPlayerFollowPath.length - 1];

            const speed = 0.02;
            const precision = 0.02;
            let y = currentFollowPathPoint[1] - 0.5 + this.getIslandFloatDeviation();

            let playerPosition = [...this.playerObject.transformComponent.getPosition()];
            const distanceLeftX = Math.abs(currentFollowPathPoint[0] - 0.5 - playerPosition[0]);
            const distanceLeftY = Math.abs(y - playerPosition[1]);
            const animatorComponent = this.playerObject.getComponentByType<GameObjectComponentAnimator>(GameObjectComponentAnimator);

            if (distanceLeftX < precision && distanceLeftY < precision) {
                this.currentPlayerFollowPathIndex++;
                if (this.currentPlayerFollowPathIndex === this.currentPlayerFollowPath.length) {
                    this.currentPlayerFollowPath = null;
                    animatorComponent.playAnimation('idle');
                };
            } else {
                if (lastFollowPathPoint.position[0] > playerPosition[0]) {
                    animatorComponent.playAnimation('run');
                } else {
                    animatorComponent.playAnimation('run_left');
                }

                if (distanceLeftX > precision) {
                    if (playerPosition[0] < currentFollowPathPoint[0] - 0.5) {
                        playerPosition[0] += speed;
                    } else if (playerPosition[0] > currentFollowPathPoint[0] - 0.5) {
                        playerPosition[0] -= speed;
                    }
                }
    
                if (distanceLeftY > precision) {
                    if (playerPosition[1] < y) {
                        this.playerYDeviation += speed;
                    } else if (playerPosition[1] > y) {
                        this.playerYDeviation -= speed;
                    }
                }

                this.playerObject.transformComponent.setPositionX(playerPosition[0]);
            }
        }
    }

    /**
     * Tries to find the shortest path between specified points.
     * 
     * @param from 
     * @param to 
     */
    private findPath(from: number[], to: number[]) {
        interface Node {
            position?: number[];
            distanceFromStart?: number;
            distanceToEnd?: number;
        }

        let nodes: Array<Node> = [...this.pathfindingPoints].map(x => ({
            position: [x[0], x[1]],
            distance: 0
        }));

        // Find node closest to the start position.
        let nodeClosestToStart: Node = {
            distanceFromStart: Infinity,
            distanceToEnd: Infinity
        };

        nodes.forEach(node => {
            node.distanceFromStart = ((from[0] - node.position[0]) ** 2) + ((from[1] - node.position[1]) ** 2);
            node.distanceToEnd = ((to[0] - node.position[0]) ** 2) + ((to[1] - node.position[1]) ** 2);

            if (node.distanceFromStart < nodeClosestToStart.distanceFromStart) {
                nodeClosestToStart = node;
            }
        });

        let path = [ nodeClosestToStart ];
        let currentNode = nodeClosestToStart;
        
        nodes.splice(nodes.indexOf(nodeClosestToStart), 1);
        
        while (nodes.length > 0) {
            if (currentNode.position[0] === to[0] && currentNode.position[1] === to[1]) {
                break;
            }

            let closestNodeDistance = Infinity;
            let closestNode = null;

            // Find closest node.
            nodes.forEach(node => {
                let distanceToCurrentNode = ((currentNode.position[0] - node.position[0]) ** 2) + ((currentNode.position[1] - node.position[1]) ** 2);
                if (distanceToCurrentNode < closestNodeDistance) {
                    closestNodeDistance = distanceToCurrentNode;
                    closestNode = node;
                }
            });

            // Mark that node as visited.
            nodes.splice(nodes.indexOf(closestNode), 1);

            // If we're closer to the end than we were at previous node,
            // then continue, otherwise iterate again and find a different node.
            if (closestNode.distanceToEnd <= currentNode.distanceToEnd) {
                currentNode = closestNode;
                path.push(currentNode);
            }
        }

        return path;
    }

    public getUIRootComponent() {
        return UIMainMenuRootComponent;
    }

}