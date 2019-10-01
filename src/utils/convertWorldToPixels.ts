import Tapotan from "../core/Tapotan";

export default function convertWorldToPixels(world: number): number {
    return world * (Tapotan.getGameHeight() / Tapotan.getViewportHeight());
}