import GameObject from "./GameObject";

/**
 * This is a simple view that lists all components and custom properties
 * assigned to a game object on the screen for easier debugging.
 * 
 * It uses regular HTML and CSS to display everything.
 */
export default class GameObjectDebugView {

    /**
     * Element that wraps the entire view.
     */
    private displayContainer: HTMLElement;
    private stylesheetElement: HTMLStyleElement;

    /**
     * Element that wraps data of game object that is being inspected.
     */
    private gameObjectDebugInfoContainer: HTMLElement;

    /**
     * Game object that is being inspected.
     */
    private currentGameObject: GameObject;

    /**
     * Whether the view has been initialized successfully.
     */
    private initialized: boolean;

    /**
     * Creates all required DOM elements, and adds them to current document's body.
     */
    public initialize() {
        if (this.initialized) {
            return;
        }

        this.initializeDisplayContainer();
        this.initializeStylesheet();

        this.initialized = true;
    }

    private initializeDisplayContainer() {
        this.displayContainer = document.createElement('div');
        this.displayContainer.setAttribute('id', 'GameObjectDebugView');
        document.body.append(this.displayContainer);
    }

    private initializeStylesheet() {
        this.stylesheetElement = document.createElement('style');
        this.stylesheetElement.innerHTML = `
        #GameObjectDebugView {
            position: fixed;
            top: 0;
            right: 0;
            background: #545454;
            width: 320px;
            height: 100vh;
            font-family: 'Segoe UI';
            font-size: 14px;
            color: #ffffff;
            cursor: default;
            overflow-y: auto;
            opacity: 0.75;
            transition: opacity 100ms;
        }

        #GameObjectDebugView:hover {
            opacity: 1;
            transition: opacity 100ms;
        }

        .GameObjectDebugView__Object {
            padding: 1rem;
        }

        .GameObjectDebugView__Label {
            font-weight: 300;
            font-size: 1.2rem;
            margin-bottom: 1rem;
        }

        .GameObjectDebugView__Component {
            padding-top: 0.5rem;
            background: #6b6b6b;
            margin: 0 -1rem;
        }

        #GameObjectDebugView .GameObjectDebugView__Component > span {
            display: block;
            padding: 0 1rem;
        }

        #GameObjectDebugView .GameObjectDebugView__Component > div {
            background: #404040;
            border-top: 1px solid #808080;
            padding: 0.5rem 0;
            margin-top: 0.5rem;
        }

        #GameObjectDebugView .GameObjectDebugView__Component .GameObjectDebugView__ComponentProperty {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.15rem 1rem;
        }

        #GameObjectDebugView .GameObjectDebugView__Component .GameObjectDebugView__ComponentProperty > span:nth-child(1) {
            font-weight: 600;
        }

        #GameObjectDebugView .GameObjectDebugView__Component .GameObjectDebugView__ComponentProperty > span:nth-child(2) {
            margin-left: 10px;
            overflow-x: hidden;
            text-overflow: ellipsis;
        }
        
        .GameObjectDebugView__Section {

        }

        .GameObjectDebugView__Section__Caption {
            font-weight: 600;
            text-transform: uppercase;
            margin: 0.25rem 0;
        }
        `;
        document.body.append(this.stylesheetElement);
    }

    /**
     * Destroys the view and removes it from the DOM.
     */
    public destroy() {
        if (!this.initialized) {
            return;
        }

        this.displayContainer.remove();
        this.stylesheetElement.remove();
    }

    /**
     * Sets the game object that is being inspected.
     * @param gameObject 
     */
    public inspectGameObject(gameObject: GameObject) {
        if (!this.initialized) {
            return;
        }

        if (this.gameObjectDebugInfoContainer) {
            this.currentGameObject.setDebuggerAttached(false);
            this.gameObjectDebugInfoContainer.remove();
        }

        this.currentGameObject = gameObject;
        gameObject.setDebuggerAttached(true);
        gameObject.setDebuggerCallback(() => {
            this.inspectGameObject(gameObject);
        });

        this.gameObjectDebugInfoContainer = document.createElement('div');
        this.gameObjectDebugInfoContainer.classList.add('GameObjectDebugView__Object');
        this.gameObjectDebugInfoContainer.setAttribute('id', 'GameObjectDebugView__' + gameObject.getId());
        this.gameObjectDebugInfoContainer.innerHTML = `
            <div class="GameObjectDebugView__Label">Game Object #${gameObject.getId()} (${gameObject.name})</div>
        `;

        // Load components.
        const componentsContainer = document.createElement('div');
        componentsContainer.classList.add('GameObjectDebugView__Section');

        gameObject.getComponents().forEach(component => {
            const componentInfoElement = document.createElement('div');
            componentInfoElement.classList.add('GameObjectDebugView__Component');
            componentInfoElement.innerHTML = `
                <span style="font-weight: 600;">${component.constructor.name}</span>
            `;

            const componentPropertiesContainer = document.createElement('div');
            component.getDebugProperties().forEach(debugProperty => {
                const label = debugProperty[0];
                const value = debugProperty[1];

                const element = document.createElement('div');
                element.classList.add('GameObjectDebugView__ComponentProperty');
                element.innerHTML = `
                    <span>${label}</span>
                    <span>${value}</span>
                `;

                componentPropertiesContainer.appendChild(element);
            });
            componentInfoElement.appendChild(componentPropertiesContainer);

            componentsContainer.appendChild(componentInfoElement);
        });

        this.gameObjectDebugInfoContainer.appendChild(componentsContainer);

        this.displayContainer.appendChild(this.gameObjectDebugInfoContainer);
    }

}