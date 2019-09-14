import * as PIXI from 'pixi.js';
import WidgetModal from '../../screens/widgets/modal/WidgetModal';
import WidgetModalButton from '../../screens/widgets/modal/WidgetModalButton';
import WidgetDropdown from '../../screens/widgets/WidgetDropdown';
import World from '../../world/World';
import { WorldCameraBehaviour, WorldCameraSpeed, WorldGameOverTimeout } from '../../world/WorldBehaviourRules';
import WidgetLevelEditorSettingsModalInput from './WidgetLevelEditorSettingsModalInput';

export default class WidgetLevelEditorSettingsModal extends WidgetModal {

    private cameraMoveSpeedDropdown: WidgetDropdown;

    constructor(world: World) {
        super('Level settings');

        let container = new PIXI.Container();
        container.position.y = 106 + 24;
        container.position.x = 32;
        container.sortableChildren = true;
        
        const containerWidth = this.getBodyWidth() - container.position.x - container.position.x;

        this.initializeSkyColorParameter(world, containerWidth, container);
        this.initializeCameraBehaviourParameter(world, containerWidth, container);
        this.initializeCameraSpeedParameter(world, containerWidth, container);
        this.initializeTimeoutParameter(world, containerWidth, container);
        this.initializeMusicParameter(world, containerWidth, container);
        this.initializeCharacterParameter(world, containerWidth, container);

        this.bodyContainer.addChild(container);

        let closeButton = new WidgetModalButton('Save');
        closeButton.on('click', () => {
            this.emit('close');
            this.destroy({ children: true });
        });

        this.footerContainer.addChild(closeButton);
    }

    private initializeSkyColorParameter(world: World, containerWidth: number, container: PIXI.Container) {
        const skyColorOptions = [
            { id: 'blue', label: 'Blue' },
            { id: 'dark-blue', label: 'Dark Blue' },

            { id: 'red', label: 'Red' },
            { id: 'dark-red', label: 'Dark Red' },

            { id: 'black', label: 'Black' },

            { id: 'pink', label: 'Pink' },
        ];

        let skyColorInputDropdown = new WidgetDropdown(skyColorOptions, world.getSkyColor());
        let skyColorInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Sky color', skyColorInputDropdown);
        skyColorInput.zIndex = 9;

        skyColorInputDropdown.on('changed', id => {
            world.setSkyColor(id);
        });

        container.addChild(skyColorInput);
    }

    private initializeCameraBehaviourParameter(world: World, containerWidth: number, container: PIXI.Container) {
        const cameraBehaviourOptions = [
            { id: WorldCameraBehaviour.FollowingPlayer, label: 'Follow player' },
            { id: WorldCameraBehaviour.EverMoving, label: 'Move forward' },
        ];

        let cameraBehaviourDropdown = new WidgetDropdown(cameraBehaviourOptions, world.getBehaviourRules().getCameraBehaviour());
        let cameraBehaviourInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Camera behavior', cameraBehaviourDropdown);
        cameraBehaviourInput.position.y = 48;
        cameraBehaviourInput.zIndex = 8;

        cameraBehaviourDropdown.on('changed', id => {
            world.getBehaviourRules().setCameraBehaviour(id);
            this.cameraMoveSpeedDropdown.setEnabled(id === WorldCameraBehaviour.EverMoving);
        });

        container.addChild(cameraBehaviourInput);
    }

    private initializeCameraSpeedParameter(world: World, containerWidth: number, container: PIXI.Container) {
        const cameraSpeedOptions = [
            { id: WorldCameraSpeed.Slow, label: 'Slow' },
            { id: WorldCameraSpeed.Medium, label: 'Medium' },
            { id: WorldCameraSpeed.Fast, label: 'Fast' },
            { id: WorldCameraSpeed.VeryFast, label: 'Very Fast' },
        ];

        this.cameraMoveSpeedDropdown = new WidgetDropdown(cameraSpeedOptions, world.getBehaviourRules().getCameraSpeed());
        this.cameraMoveSpeedDropdown.setEnabled(world.getBehaviourRules().getCameraBehaviour() === WorldCameraBehaviour.EverMoving);
        this.cameraMoveSpeedDropdown.on('changed', id => {
            world.getBehaviourRules().setCameraSpeed(id);
        });

        let cameraMoveSpeedInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Camera speed', this.cameraMoveSpeedDropdown);
        cameraMoveSpeedInput.position.y = 48 * 2;
        cameraMoveSpeedInput.zIndex = 7;

        container.addChild(cameraMoveSpeedInput);
    }

    private initializeTimeoutParameter(world: World, containerWidth: number, container: PIXI.Container) {
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
        timeoutInput.position.y = 48 * 3;
        timeoutInput.zIndex = 6;

        container.addChild(timeoutInput);
    }

    private initializeMusicParameter(world: World, containerWidth: number, container: PIXI.Container) {
        let musicDropdown = new WidgetDropdown(world.getTileset().getBackgroundMusic(), world.getBackgroundMusicID());
        musicDropdown.on('changed', id => {
            world.setBackgroundMusicID(id);
        });

        let musicInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Music', musicDropdown);
        musicInput.position.y = 48 * 4;
        musicInput.zIndex = 5;

        container.addChild(musicInput);
    }

    private initializeCharacterParameter(world: World, containerWidth: number, container: PIXI.Container) {
        const characterOptions = [
            { id: 'lawrence', label: 'Lawrence' },
        ];

        let characterDropdown = new WidgetDropdown(characterOptions, 'lawrence');
        characterDropdown.on('changed', id => {
            world.setBackgroundMusicID(id);
        });

        let characterInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Character', characterDropdown);
        characterInput.position.y = 48 * 5;
        characterInput.zIndex = 4;

        container.addChild(characterInput);
    }
}