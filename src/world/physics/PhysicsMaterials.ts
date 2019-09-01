import * as p2 from 'p2';

const MaterialGround = new p2.Material();
const MaterialPlayer = new p2.Material();

export default {
    Ground: MaterialGround,
    Player: MaterialPlayer,

    setupContactMaterials: function (world: p2.World) {
        const playerGroundContactMaterial = new p2.ContactMaterial(MaterialGround, MaterialPlayer, {
            friction: 0.33
        });

        world.addContactMaterial(playerGroundContactMaterial);
    }
}