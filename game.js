import { Point } from "./point.js";

export class Game {

    /**
     * @param {{ canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D }} param0
     */
    constructor({canvas, ctx}) {
        /** @type { number } */
        this.time = 0;
        /** @type { Point[] } */
        this.points = [];
        /** @type { HTMLCanvasElement } */
        this.canvas = canvas;
        /** @type { CanvasRenderingContext2D } */
        this.ctx = ctx;
        this.resize();
        window.addEventListener('resize', () => this.resize(), false);

        for (let i = 0; i < 2500; i++) {
            this.points.push(new Point({ canvasWidth: canvas.width, canvasHeight: canvas.height }));
        }
    }

    draw() {
        this.points.forEach((point) => {
            point.draw(this.ctx);
        });
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update() {
        let command = 'moving';
        if (this.time === 1) {
            command = 'beforeMove';
        } else if (this.time === Point.animationLength) {
            this.time = 0;
            command = 'endMove';
        }

        this.time++;
        this.points.forEach((point) => {
            point.update(command, this.canvas.width, this.canvas.height);
        });
    }

}