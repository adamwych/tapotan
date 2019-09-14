import * as PIXI from 'pixi.js';
import ContainerAnimator from '../../graphics/animation/ContainerAnimator';

export default class WidgetLevelEditorTopBarItem extends PIXI.Container {

    protected animator: ContainerAnimator;

    constructor() {
        super();

        this.animator = new ContainerAnimator(this);
    }

    public getScale(): number {
        return 3.5;
    }

    public getAnimator(): ContainerAnimator {
        return this.animator;
    }

}