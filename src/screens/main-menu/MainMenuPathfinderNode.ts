import GameObject from "../../world/GameObject";

export interface MainMenuPathfinderNode {
    x: number;
    y: number;
    originalY?: number;

    gameObject: GameObject;

    wall: boolean;
}