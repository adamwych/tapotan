import ContainerAnimationScale from "./ContainerAnimationScale";

/** Generic animation used for most buttons on mouseout event. */
export default class ContainerAnimationButtonMouseOut extends ContainerAnimationScale {
    constructor(targetScale: number = 1) {
        super(targetScale);
    }
}