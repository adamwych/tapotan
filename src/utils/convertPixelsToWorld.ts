import Tapotan from "../core/Tapotan";

export default function convertPixelsToWorld(pixels: number): number {
    return pixels / (Tapotan.getGameHeight() / Tapotan.getViewportHeight());
}