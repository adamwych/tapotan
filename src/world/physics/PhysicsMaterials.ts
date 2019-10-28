import * as p2 from 'p2';

const MaterialGround = new p2.Material();
const MaterialPlayer = new p2.Material();

export default {
    Ground: MaterialGround,
    Player: MaterialPlayer,

    setupContactMaterials: function (world: p2.World) {
        const playerGroundContactMaterial = new p2.ContactMaterial(MaterialPlayer, MaterialGround, {
            friction: 0.345,
            restitution: 0
        });

        world.addContactMaterial(playerGroundContactMaterial);
    }
}