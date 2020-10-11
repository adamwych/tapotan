export default class Material {
    public static DEFAULT: Material = new Material();

    public id: number;

    constructor() {
        this.id = Math.random();
    }
}