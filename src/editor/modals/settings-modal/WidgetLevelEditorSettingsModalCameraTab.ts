import WidgetTabbedViewTab from "../../../screens/main-menu/widgets/WidgetTabbedViewTab";
import WidgetDropdown from '../../../screens/widgets/WidgetDropdown';
import World from '../../../world/World';
import { WorldCameraBehaviour, WorldCameraSpeed } from '../../../world/WorldBehaviourRules';
import WidgetLevelEditorSettingsModalInput from './WidgetLevelEditorSettingsModalInput';

export default class WidgetLevelEditorSettingsModalCameraTab extends WidgetTabbedViewTab {

    private cameraMoveSpeedDropdown: WidgetDropdown;

    constructor(world: World, width: number) {
        super('Background');

        this.initializeCameraBehaviourParameter(world, width);
        this.initializeCameraSpeedParameter(world, width);
    }

    private initializeCameraBehaviourParameter(world: World, containerWidth: number) {
        const cameraBehaviourOptions = [
            { id: WorldCameraBehaviour.FollowingPlayer, label: 'Follow player' },
            { id: WorldCameraBehaviour.EverMoving, label: 'Move forward' },
        ];

        let cameraBehaviourDropdown = new WidgetDropdown(cameraBehaviourOptions, world.getBehaviourRules().getCameraBehaviour());
        let cameraBehaviourInput = new WidgetLevelEditorSettingsModalInput(containerWidth, 'Camera behavior', cameraBehaviourDropdown);
        cameraBehaviourInput.zIndex = 8;

        cameraBehaviourDropdown.on('changed', id => {
            world.getBehaviourRules().setCameraBehaviour(id);
            this.cameraMoveSpeedDropdown.setEnabled(id === WorldCameraBehaviour.EverMoving);
        });

        this.addChild(cameraBehaviourInput);
    }

    private initializeCameraSpeedParameter(world: World, containerWidth: number) {
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
        cameraMoveSpeedInput.position.y = 48 * 1;
        cameraMoveSpeedInput.zIndex = 7;

        this.addChild(cameraMoveSpeedInput);
    }
}