/*import Tileset from "../world/tiles/Tileset";

const Data = {
    __Name: 'Pixelart',
    __Version: 1,
    __Categories: {
        'Sky': 'Sky',
        'Environment': 'Environment',
        'Monsters': 'Monsters',
        'Background': 'BackgroundDecals',
        'Ground decals': 'GroundDecals',
        'Ground': 'Ground',
    },

    __Music: [
        { id: 'pixelart__main_theme', label: 'Main Theme'},
        { id: 'pixelart__dark_thoughts', label: 'Dark Thoughts'},
        { id: 'pixelart__bounce', label: 'Bounce'}
    ],

    Sky: [
        'Clouds/Variation0',
        'Clouds/Variation1',
        'Clouds/Variation2',
        'Clouds/Variation3',

        'Stars/Variation0_Idle',
    ],

    BackgroundDecals: [
        'Trees/Tree1',
        'Trees/Tree2',
        'Trees/Tree3',
        'Trees/Tree4',
        'Trees/Tree7',
        'Trees/Tree10',
        'Trees/Tree8',
        'Trees/Tree5',
        'Trees/Tree6',
        'Trees/Tree9',
        
        'Mountains/Mountain1',
        'Mountains/Mountain2',
        'Mountains/Mountain3',
        'Mountains/Mountain4',
        'Mountains/Mountain5',
        'Mountains/Mountain6',
        'Mountains/Mountain7',
        'Mountains/Mountain8',
        'Mountains/Mountain9',
        'Mountains/Mountain10',
        'Mountains/Mountain11',
        'Mountains/Mountain12',

        'MazeWall/BlackVariation',
        'MazeWall/WhiteVariation',
    ],

    Ground: [
        'Grass/Side',
        'Grass/Corner',
        'Grass/Variation0',
        'Grass/Variation1',
        'Grass/Variation2',
        'Grass/FlyingVariation0',
        'Grass/Background',
        
        'RedGrass/Side',
        'RedGrass/Corner',
        'RedGrass/Variation0',
        'RedGrass/Variation1',
        'RedGrass/Variation2',
        'RedGrass/FlyingVariation0',
        'RedGrass/Background',
        
        'DarkGrass/Side',
        'DarkGrass/Corner',
        'DarkGrass/Variation0',
        'DarkGrass/FlyingVariation0',
        'DarkGrass/Background',

        'DarkBricks/SideLeft',
        'DarkBricks/Side',
        'DarkBricks/Variation0',
        'DarkBricks/Variation1',
        'DarkBricks/Background',

        'Bricks/SideLeft',
        'Bricks/Side',
        'Bricks/Variation0',
        'Bricks/Variation1',
        'Bricks/Background',

        'Royal Bricks/SideLeft',
        'Royal Bricks/Side',
        'Royal Bricks/Variation0',
        'Royal Bricks/Background',
    ],

    GroundDecals: [
        'Grass/Variation0',
        'Grass/Variation1',
        'Grass/Variation2',
        'Grass/Variation3',

        'Flowers/Variation0',
        'Flowers/Variation1',
        'Flowers/Variation2',

        'Red Flowers/Variation0',
        'Red Flowers/Variation1',
        'Red Flowers/Variation2',
    ],

    Environment: [
        'Invisible Block/Block',

        'Lava/Idle',

        'Coin/Idle',

        'Spikes/Variation0',
        'Spikes/Variation1',
        'Spikes/Variation2',

        'Spring/Idle',

        'Speeder/RightIdle',

        'Lock/Locked',
        'Lock/Key',

        'Ladder/Ladder',

        'Sign/Variation0',
        'Sign/Variation1',
        'Sign/Variation2',
        'Sign/Variation3',
        'Sign/Variation4',
        'Sign/Variation5',
        'Sign/Variation6',
        'Sign/Variation7',
        'Sign/Variation8',
        'Sign/Variation9',
        'Sign/Variation10',
        'Sign/Variation11',

        // todo
        //'Gravity Inverter/InverterTop',
        //'Gravity Inverter/InverterBottom',

        
    ],

    Monsters: [
        'Apple/Idle',
        'Carrot/Idle',
        'Snake/Idle',
        'Ghost/Idle',
    ],

    Impenetrable: [
        'Sky/Clouds/Variation0',
        'Sky/Clouds/Variation1',
        'Sky/Clouds/Variation2',
        'Sky/Clouds/Variation3',

        'GroundDecals/Grass/Variation0',
        'GroundDecals/Grass/Variation1',
        'GroundDecals/Grass/Variation2',
        'GroundDecals/Grass/Variation3',

        'GroundDecals/Flowers/Variation0',
        'GroundDecals/Flowers/Variation1',
        'GroundDecals/Flowers/Variation2',

        'GroundDecals/Red Flowers/Variation0',
        'GroundDecals/Red Flowers/Variation1',
        'GroundDecals/Red Flowers/Variation2',
        
        'BackgroundDecals/Trees/Tree1',
        'BackgroundDecals/Trees/Tree2',
        'BackgroundDecals/Trees/Tree3',
        'BackgroundDecals/Trees/Tree4',
        'BackgroundDecals/Trees/Tree5',
        'BackgroundDecals/Trees/Tree6',
        'BackgroundDecals/Trees/Tree7',
        'BackgroundDecals/Trees/Tree8',
        'BackgroundDecals/Trees/Tree9',
        'BackgroundDecals/Trees/Tree10',

        'BackgroundDecals/Mountains/Mountain1',
        'BackgroundDecals/Mountains/Mountain2',
        'BackgroundDecals/Mountains/Mountain3',
        'BackgroundDecals/Mountains/Mountain4',
        'BackgroundDecals/Mountains/Mountain5',
        'BackgroundDecals/Mountains/Mountain6',
        'BackgroundDecals/Mountains/Mountain7',
        'BackgroundDecals/Mountains/Mountain8',
        'BackgroundDecals/Mountains/Mountain9',
        'BackgroundDecals/Mountains/Mountain10',
        'BackgroundDecals/Mountains/Mountain11',
        'BackgroundDecals/Mountains/Mountain12',

        'BackgroundDecals/MazeWall/BlackVariation',
        'BackgroundDecals/MazeWall/WhiteVariation',

        'Ground/DarkBricks/Background',
        'Ground/Bricks/Background',
        'Ground/Royal Bricks/Background',

        'Environment/Spikes/Variation0',
        'Environment/Spikes/Variation1',
        'Environment/Spikes/Variation2',

        'Environment/Gravity Inverter/InverterTop',
        'Environment/Gravity Inverter/InverterBottom',

        'Environment/Sign/Variation0',
        'Environment/Sign/Variation1',
        'Environment/Sign/Variation2',
        'Environment/Sign/Variation3',
        'Environment/Sign/Variation4',
        'Environment/Sign/Variation5',
        'Environment/Sign/Variation6',
        'Environment/Sign/Variation7',
        'Environment/Sign/Variation8',
        'Environment/Sign/Variation9',
        'Environment/Sign/Variation10',
        'Environment/Sign/Variation11',
    ],

    BackgroundObjects: [
        'Environment/Coin/Idle',
        'Environment/Speeder/LeftIdle',
        'Environment/Speeder/RightIdle',
        'Environment/Ladder/Ladder',
    ]
};

export default class TilesetPixelart extends Tileset {

    constructor() {
        super('Pixelart', Data.__Music);
    }

    public load() {
        Data.Sky.forEach(resourceName => this.addResource('Sky/' + resourceName + '.png'));
        Data.BackgroundDecals.forEach(resourceName => this.addResource('BackgroundDecals/' + resourceName + '.png'));
        Data.Ground.forEach(resourceName => this.addResource('Ground/' + resourceName + '.png'));
        Data.GroundDecals.forEach(resourceName => this.addResource('GroundDecals/' + resourceName + '.png'));
        Data.Environment.forEach(resourceName => this.addResource('Environment/' + resourceName + '.png'));
        Data.Monsters.forEach(resourceName => this.addResource('Monsters/' + resourceName + '.png'));

        [
            ...Data.Impenetrable,
            ...Data.BackgroundObjects
        ].forEach(resourceName => this.setResourceAsBackground(resourceName));

        this.addResource('Sky/Stars/Variation0_Animation.png');

        this.addResource('Environment/Spring/Animation.png');
        this.addResource('Environment/Coin/Animation.png');
        this.addResource('Environment/Speeder/RightAnimation.png');
        this.addResource('Environment/Lock/Unlocked.png');
        this.addResource('Environment/Lava/Animation.png');
        this.addResource('Environment/Sign/TextBubble/Caret.png');

        this.addResource('404.png');
        this.addResource('VictoryFlag.png');
        
        this.addResource('Monsters/Apple/RunAnimation.png');
        this.addResource('Monsters/Apple/RunRightAnimation.png');
        this.addResource('Monsters/Carrot/RunAnimation.png');
        this.addResource('Monsters/Carrot/RunRightAnimation.png');
        this.addResource('Monsters/Snake/MoveAnimation.png');
        this.addResource('Monsters/Snake/MoveRightAnimation.png');
        this.addResource('Monsters/Ghost/MoveAnimation.png');
        this.addResource('Monsters/Ghost/MoveRightAnimation.png');

        this.addResource('Effects/GroundTouchAfterJump/Animation.png');

        this.addResource('Characters/Lawrence_SpawnPoint.png');
        this.addResource('Characters/Lawrence_Idle.png');
        this.addResource('Characters/Lawrence_IdleLeft.png');
        this.addResource('Characters/Lawrence_Midair.png');
        this.addResource('Characters/Lawrence_MidairLeft.png');
        this.addResource('Characters/Lawrence_Run.png');
        this.addResource('Characters/Lawrence_RunLeft.png');
        this.addResource('Characters/Lawrence_WallSlide.png');
        this.addResource('Characters/Lawrence_WallSlideLeft.png');
        this.addResource('UI/Editor/DrawerCategory/Sky.png');
        this.addResource('UI/Editor/DrawerCategory/Environment.png');
        this.addResource('UI/Editor/DrawerCategory/GroundDecals.png');
        this.addResource('UI/Editor/DrawerCategory/Ground.png');
        this.addResource('UI/Editor/DrawerCategory/BackgroundDecals.png');
        this.addResource('UI/Editor/DrawerCategory/Monsters.png');
        this.addResource('UI/Editor/DrawerCategorySpawnPoint.png');
        this.addResource('UI/Editor/DrawerCategoryEndPoint.png');
        this.addResource('UI/Editor/TopbarIconSave.png');
        this.addResource('UI/Editor/TopbarIconLoad.png');
        this.addResource('UI/Editor/TopbarIconHelp.png');
        this.addResource('UI/Editor/TopbarIconSettings.png');
        this.addResource('UI/Editor/TopbarIconPlaythroughStart.png');
        this.addResource('UI/Editor/ObjectActionRotate.png');
        this.addResource('UI/Editor/ObjectActionRemove.png');
        this.addResource('UI/Editor/ObjectActionBringToFront.png');
        this.addResource('UI/Editor/ObjectActionBringToBack.png');
        this.addResource('UI/Editor/ObjectActionLinkWithDoor.png');
        this.addResource('UI/Editor/ObjectActionSetText.png');
        this.addResource('UI/Loader.png');
        this.addResource('UI/DropdownCaret.png');

        this.addResource('UI/MusicOn.png');
        this.addResource('UI/MusicOff.png');

        for (let [label, name] of Object.entries(Data.__Categories)) {
            this.addEditorCategory({
                name: name,
                label: label,
                resources: Data[name]
            });
        }
    }
}*/