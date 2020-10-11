import Material from './Material';

export interface ContactMaterialOptions {
    friction?: number;
    restitution?: number;
}

export default class ContactMaterial {

    private id: number;
    private materialA: Material;
    private materialB: Material;
    private options: ContactMaterialOptions;

    constructor(materialA: Material, materialB: Material, options: ContactMaterialOptions) {
        const defaultOptions: ContactMaterialOptions = {
            friction: 0.4,
            restitution: 1
        };

        this.id = Math.random();
        this.materialA = materialA;
        this.materialB = materialB;
        this.options = {
            ...defaultOptions,
            ...options
        };
    }

    public getId() {
        return this.id;
    }

    public getMaterialA() {
        return this.materialA;
    }

    public getMaterialB() {
        return this.materialB;
    }
    
    public get friction() {
        return this.options.friction;
    }

    public get restitution() {
        return this.options.restitution;
    }

}