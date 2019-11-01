import Tapotan from '../core/Tapotan';
import * as p2 from 'p2';

export default class PhysicsDebugRenderer {

    public static current = null;

    public static create(world: p2.World) {
        if (PhysicsDebugRenderer.current) {
            PhysicsDebugRenderer.current.destroy();
        }

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.style.position = 'absolute';
        canvas.style.zIndex = '1';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.width = Tapotan.getGameWidth();
        canvas.height = Tapotan.getGameHeight();
        context.imageSmoothingEnabled = false;

        document.body.appendChild(canvas);
        let shouldStop = false;
        let scale = 16;

        const render = () => {
            if (shouldStop) {
                return;
            }
            
            let bodies = world.bodies;

            window.requestAnimationFrame(render);

            context.fillStyle = '#d0d0d0';
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();

            for (var i = 0; i < bodies.length; i += 1) {
                let body = bodies[i];
                let a1 = body.aabb.lowerBound[0];
                let a2 = body.aabb.lowerBound[1];
                let b1 = body.aabb.upperBound[0];
                let b2 = body.aabb.upperBound[1];

                let x1 = [a1 * scale, a2 * scale];
                let x2 = [b1 * scale, a2 * scale];
                let x3 = [b1 * scale, b2 * scale];
                let x4 = [a1 * scale, b2 * scale];

                context.moveTo(x1[0], x1[1]);
                context.lineTo(x2[0], x2[1]);
                context.lineTo(x3[0], x3[1]);
                context.lineTo(x4[0], x4[1]);
                context.lineTo(x1[0], x1[1]);
            }

            context.lineWidth = 1;
            context.strokeStyle = '#d0d0d0';
            context.stroke();
        };
        render();

        PhysicsDebugRenderer.current = {
            destroy: () => {
                canvas.remove();
                shouldStop = true;
            }
        };
    }
}