import ContactMaterial from '../physics-engine/ContactMaterial';
import Material from '../physics-engine/Material';
import PhysicsWorld from '../physics-engine/PhysicsWorld';

const MaterialGround = new Material();
const MaterialPlayer = new Material();

export default {
    Ground: MaterialGround,
    Player: MaterialPlayer,

    setupContactMaterials: function (world: PhysicsWorld) {
        const playerGroundContactMaterial = new ContactMaterial(MaterialPlayer, MaterialGround, {
            friction: 0.345,
            restitution: 0
        });

        world.addContactMaterial(playerGroundContactMaterial);
    }
}