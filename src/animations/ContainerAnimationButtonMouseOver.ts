import ContainerAnimationScale from "./ContainerAnimationScale";

/** Generic animation used for most buttons on mouseover event. */
export default class ContainerAnimationButtonMouseOver extends ContainerAnimationScale {
    constructor(targetScale: number = 1.05) {
        super(targetScale);
    }
}