import Tapotan from "../core/Tapotan";

type RenderCallbackFunction = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;

export default class DebugCanvas {

    private static canvas: HTMLCanvasElement;
    private static context: CanvasRenderingContext2D;

    private static renderCallbacks: Array<RenderCallbackFunction> = [];

    public static create() {
        DebugCanvas.canvas = document.createElement('canvas');
        DebugCanvas.context = DebugCanvas.canvas.getContext('2d');

        DebugCanvas.canvas.setAttribute('id', 'debugCanvas');
        DebugCanvas.canvas.style.position = 'absolute';
        DebugCanvas.canvas.style.zIndex = '2';
        DebugCanvas.canvas.style.top = '0';
        DebugCanvas.canvas.style.left = '0';
        DebugCanvas.canvas.style.pointerEvents = 'none';
        DebugCanvas.canvas.width = Tapotan.getGameWidth();
        DebugCanvas.canvas.height = Tapotan.getGameHeight();
        DebugCanvas.context.imageSmoothingEnabled = false;

        function render() {
            window.requestAnimationFrame(render);
            DebugCanvas.context.clearRect(0, 0, Tapotan.getGameWidth(), Tapotan.getGameHeight());
            DebugCanvas.context.beginPath();

            DebugCanvas.renderCallbacks.forEach(callback => {
                callback(DebugCanvas.context, DebugCanvas.canvas);
            });

            DebugCanvas.renderCallbacks = [];
        }
        
        window.requestAnimationFrame(render);

        document.body.appendChild(DebugCanvas.canvas);
    }

    public static drawLine(x1: number, y1: number, x2: number, y2: number) {
        DebugCanvas.renderCallbacks.push((context, canvas) => {
            const scale = Tapotan.getBlockSize();

            context.strokeStyle = '#ff0000';
            context.lineWidth = 4;
            context.moveTo(x1 * scale, y1 * scale);
            context.lineTo(x2 * scale, y2 * scale);
            context.stroke();
        });
    }
}