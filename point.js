
export class Point {

    constructor({canvasWidth, canvasHeight}) {
        this.position = Point.getPosition(canvasWidth, canvasHeight);
        Point.setMap(this.position);
        this.progress = 1;
        this.color = Point.getColor();
    }

    /**
     * @param { {x: number, y: number} } newPos
     * @param { number } canvasWidth
     * @param { number } canvasHeight
     */
    moveTo(newPos, canvasWidth, canvasHeight) {
        const isFreely = Point.isFreelyPosition(newPos, canvasWidth, canvasHeight);
        if (isFreely) {
            Point.setMap(newPos, true);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        const offsetX = this.newPosition && (this.newPosition.x - this.position.x) || 0;
        const offsetY = this.newPosition && (this.newPosition.y - this.position.y) || 0;

        const start = {
            x: this.position.x + (this.progress < 0.5 ? 0 : offsetX * (this.progress - 0.5) * 2),
            y: this.position.y + (this.progress < 0.5 ? 0 : offsetY * (this.progress - 0.5) * 2)
        }

        const end = {
            x: this.position.x + offsetX * this.progress,
            y: this.position.y + offsetY * this.progress
        }
    
        const middle = {
            x: (start.x + end.x) / 2,
            y: (start.y + end.y) / 2
        }
        ctx.arc(start.x * Point.size, start.y * Point.size, Point.size * 0.4, 0, 2 * Math.PI, false);
        ctx.arc(middle.x * Point.size, middle.y * Point.size, Point.size * 0.4, 0, 2 * Math.PI, false);
        ctx.arc(end.x * Point.size, end.y * Point.size, Point.size * 0.4, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    /**
     * 
     * @param { string } command
     * @param { number } canvasWidth
     * @param { number } canvasHeight
     */
    update(command, canvasWidth, canvasHeight) {
        switch (command) {
            case 'beforeMove':
                const needMove = Math.random() < 0.4;
                if (!needMove) {
                    break;
                }
                this.newPosition = this.getNewPosition(canvasWidth, canvasHeight);
                if (this.newPosition) {
                    this.progress = 0;
                    this.moveTo(this.newPosition, canvasWidth, canvasHeight);
                }
                break;
            case 'moving':
                if (this.progress < 1) {
                    this.progress += 1 / Point.animationLength;
                }
                break;
            case 'endMove':
                if (this.newPosition) {
                    Point.setMap(this.position, false);
                    this.position = this.newPosition;
                    this.newPosition = null;
                    this.progress = 1;
                }
                break;
            default:
                break;
        }
    }

    /**
     * @param { number } canvasWidth
     * @param { number } canvasHeight
     * @returns { {x: number, y: number} | null }
     */
    getNewPosition(canvasWidth, canvasHeight) {
        const { x, y } = this.position;
        const allPositions = [
            { x: x - 1, y },
            { x: x + 1, y },
            { x, y: y - 1 },
            { x, y: y + 1 }
        ]
        const positions = allPositions.filter((point) => Point.isFreelyPosition(point, canvasWidth, canvasHeight));

        if (positions.length) {
            return positions[Point.rand(positions.length)]
        }
        return null;
    }

    static size = 10;
    static map = {};
    static animationLength = 10;

    /**
     * @param { number } canvasWidth
     * @param { number } canvasHeight
     * @returns { {x: number, y: number} }
     */
    static getPosition(canvasWidth, canvasHeight) {
        let x, y;
        let maxIteration = 1000;
        do {
            x = Point.rand(Math.floor(canvasWidth / Point.size));
            y = Point.rand(Math.floor(canvasHeight / Point.size));
            maxIteration--;
        } while (maxIteration && !Point.isFreelyPosition({ x, y }, canvasWidth, canvasHeight));
        return { x, y }
    }

    static getKey({ x, y }) {
        return `${x}|${y}`;
    }

    /**
     * @param { {x: number, y: number} } pos
     * @param { number } width
     * @param { number } height
     * @returns 
     */
    static isFreelyPosition(pos, width, height) {
        const key = Point.getKey(pos);
        return !Point.map[key] &&
            pos.x > 0 &&
            pos.x < width / Point.size &&
            pos.y > 0 &&
            pos.y < height / Point.size;
    }

    static setMap(pos, value = true) {
        const key = Point.getKey(pos);
        Point.map[key] = value;
    }

    /**
     * @returns { string }
     */
    static getColor() {
        return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
    }

    /**
     * @param { number } max
     * @returns { number }
     */
    static rand(max) {
        return Math.floor(Math.random() * max);
    }
}
