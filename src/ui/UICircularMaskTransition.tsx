import * as React from 'react';
import Tapotan from '../core/Tapotan';
import TickHelper from '../core/TickHelper';
import Interpolation from '../utils/Interpolation';

require('./circular-mask-transition.scss');

export default class UICircularMaskTransition extends React.Component {

    public static instance: UICircularMaskTransition;

    private innerCircleElement = null;
    private outerCircleElement = null;

    private timer: number = 0;
    private stage: number = 0;

    private outerCircleRadius: number = 0;
    
    private inBetweenCallback: Function = null;

    private isPlaying: boolean = false;

    public state = {
        x: 0,
        y: 0
    }

    constructor(props) {
        super(props);

        UICircularMaskTransition.instance = this;
    }

    public start(x: number, y: number, inBetweenCallback: Function) {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        const width = Tapotan.getGameWidth();
        const height = Tapotan.getGameHeight();
        const d = Math.sqrt((width ** 2) + (height ** 2));
        const radius = d;

        this.timer = 0;
        this.stage = 0;

        this.outerCircleElement.setAttribute('r', radius);
        this.outerCircleRadius = radius;

        this.inBetweenCallback = inBetweenCallback;

        this.setState({
            x: x,
            y: y
        });

        TickHelper.add(this.handleTick);
    }

    private handleTick = (dt: number) => {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 0.5);
        if (alpha === 1) {
            this.timer = 0;

            if (this.stage === 1) {
                TickHelper.remove(this.handleTick);
                this.isPlaying = false;

                this.stage = 0;
                this.innerCircleElement.setAttribute('r', Interpolation.smooth(0, this.outerCircleRadius, alpha));
            } else if (this.stage === 0) {
                this.stage = 0.5;

                if (this.inBetweenCallback) {
                    this.inBetweenCallback();
                }

                this.innerCircleElement.setAttribute('r', 0);
            } else if (this.stage === 0.5) {
                this.stage = 1;
            }

            return;
        }

        if (this.stage === 0) {
            this.innerCircleElement.setAttribute('r', Interpolation.smooth(this.outerCircleRadius, 0, alpha));
        } else if (this.stage === 1) {
            this.innerCircleElement.setAttribute('r', Interpolation.smooth(0, this.outerCircleRadius, alpha));
        }
    }

    public render() {
        const posX = this.state.x;
        const posY = this.state.y;

        return (
            <div className="circular-mask-transition">
                <svg>
                    <defs>
                        <mask id="hole">
                            <rect width="100%" height="100%" fill="white"/>
                            <circle r={0} cx={posX + '%'} cy={posY + '%'} fill="black" ref={element => this.innerCircleElement = element} />
                        </mask>
                    </defs>

                    <circle r={0} cx={posX + '%'} cy={posY + '%'} mask="url(#hole)" ref={element => this.outerCircleElement = element} />
                </svg>
            </div>
        );
    }
}
