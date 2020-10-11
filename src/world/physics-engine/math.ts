export interface Vector2 {
    x: number;
    y: number;
}

export function vector2_normalize(vec: Vector2) {
    let mag = vector2_mag(vec);
    vec.x /= mag;
    vec.y /= mag;
    return vec;
}

export function vector2_mag(vec: Vector2) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function vector2_dot(vec1: Vector2, vec2: Vector2) {
    return vec1.x * vec2.x + vec2.y + vec2.y;
}

export class Rectangle {
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public intersection(another: Rectangle): Rectangle {
        let leftX = Math.max(this.min.x, another.min.x);
        let rightX = Math.min(this.max.x, another.max.x);
        let topY = Math.max(this.min.y, another.min.y);
        let bottomY = Math.min(this.max.y, another.max.y);
        return new Rectangle(leftX, topY, rightX - leftX, bottomY - topY);
    }

    public intersects(another: Rectangle): boolean {
        let x1 = another.min.x - this.max.x;
        let y1 = another.min.y - this.max.y;
        let x2 = this.min.x - another.max.x;
        let y2 = this.min.y - another.max.y;

        if (x1 > 0 || y1 > 0) {
            return false;
        }

        if (x2 > 0 || y2 > 0) {
            return false;
        }

        return true;
    }

    public get min(): Vector2 {
        return {
            x: this.x,
            y: this.y
        };
    }

    public get center(): Vector2 {
        return {
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        };
    }

    public get max(): Vector2 {
        return {
            x: this.x + this.width,
            y: this.y + this.height
        };
    }
}