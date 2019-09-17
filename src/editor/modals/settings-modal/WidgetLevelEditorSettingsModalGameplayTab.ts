import WidgetTabbedViewTab from "../../../screens/main-menu/widgets/WidgetTabbedViewTab";
import WidgetDropdown from '../../../screens/widgets/WidgetDropdown';
import World from '../../../world/World';
import { WorldGameOverTimeout } from '../../../world/WorldBehaviourRules';
import WidgetLevelEditorSettingsModalInput from './WidgetLevelEditorSettingsModalInput';
import WorldMask from "../../../world/WorldMask";

export default class WidgetLevelEditorSettingsModalGameplayTab extends WidgetTabbedViewTab {
    constructor(world: World, width: number) {
        super('Gameplay');

        this.initializeTimeoutParameter(world, width);
        this.initializeCharacterParameter(world, width);
        this.initializeMusicParameter(world, width);
        this.initializeMaskParameter(world, width);
    }

    private initializeTimeoutParameter(world: World, containerWidth: number) {
        const timeoutOptions = [
            { id: WorldGameOverTimeout.Unlimited, label: 'Unlimited' },
            { id: WorldGameOverTimeout.Seconds20, label: '20 seconds' },
            { id: WorldGameOverTimeout.Seconds30, label: '30 seconds' },
            { id: WorldGameOverTimeout.Minutes1, label: '1 minute' },
            { id: WorldGameOverTimeout.Minutes2, label: '2 minutes' },
        ];

        let timeoutDropdown = new WidgetDropdown(timeoutOptions, world.getBehaviourRules().getGameOverTimeout());
        timeoutDropdown.on('changed', id => {
            world.getBehaviourRules().setGameOverTimeout(id);
        });

        let timeoutInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Time limit', timeoutDropdown);
        timeoutInput.zIndex = 9;

        this.addChild(timeoutInput);
    }

    private initializeCharacterParameter(world: World, containerWidth: number) {
        const characterOptions = [
            { id: 'lawrence', label: 'Lawrence' },
        ];

        let characterDropdown = new WidgetDropdown(characterOptions, 'lawrence');
        characterDropdown.on('changed', id => {
            world.setBackgroundMusicID(id);
        });

        let characterInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Character', characterDropdown);
        characterInput.position.y = 48 * 1;
        characterInput.zIndex = 8;

        this.addChild(characterInput);
    }

    private initializeMusicParameter(world: World, containerWidth: number) {
        let musicDropdown = new WidgetDropdown(world.getTileset().getBackgroundMusic(), world.getBackgroundMusicID());
        musicDropdown.on('changed', id => {
            world.setBackgroundMusicID(id);
        });

        let musicInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Music', musicDropdown);
        musicInput.position.y = 48 * 2;
        musicInput.zIndex = 7;

        this.addChild(musicInput);
    }

    private initializeMaskParameter(world: World, containerWidth: number) {
        const options = [
            { id: 'none', label: 'None' }
        ];
        
        for (let [k, v] of Object.entries(World.MaskSizes)) {
            options.push({
                id: String(v),
                label: k
            });
        }

        let maskDropdown = new WidgetDropdown(options, world.getWorldMask() ? world.getWorldMask().getSize() : 'none');
        maskDropdown.on('changed', id => {
            if (id === 'none') {
                world.setWorldMask(null);
            } else {
                world.setWorldMask(new WorldMask(world, id));
            }
        });

        let maskInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Mask', maskDropdown);
        maskInput.position.y = 48 * 3;
        maskInput.zIndex = 6;

        this.addChild(maskInput);
    }
}