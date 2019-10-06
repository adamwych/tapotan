import * as React from 'react';
import Tapotan from '../../core/Tapotan';
import TickHelper from '../../core/TickHelper';
import Interpolation from '../../utils/Interpolation';

export default class UITheatreSpotlight extends React.Component {

    private outerCircleRadius: number = 0;

    private spotlightRadius: number = 0;
    private spotlightElement: SVGCircleElement;

    private maskRectElement: SVGRectElement;

    private startSpotlightRadius: number = 0;
    private targetSpotlightRadius: number = 0;

    private timer: number = 0;

    private shouldAnimateOpacity: boolean = true;
    private opacityTimer: number = 0;

    constructor(props) {
        super(props);

        const width = Tapotan.getGameWidth();
        const height = Tapotan.getGameHeight();

        this.outerCircleRadius = Math.sqrt((width ** 2) + (height ** 2));

        this.startSpotlightRadius = this.outerCircleRadius / 4;
        this.targetSpotlightRadius = this.outerCircleRadius / 4;
    }

    public componentDidMount() {
        TickHelper.add(this.tick);
    }

    public componentWillUnmount() {
        TickHelper.remove(this.tick);
    }

    private tick = (dt: number) => {
        this.timer += dt;

        if (this.timer >= 0.33) {
            const actualTimer = this.timer - 0.33;
            const alpha = Math.min(1, actualTimer / 1.5);

            if (alpha === 1) {
                this.timer = 0.33;

                this.startSpotlightRadius = this.spotlightRadius;
                this.targetSpotlightRadius = (this.outerCircleRadius / 4) + (Math.random() * 50);

                return;
            }

            this.spotlightRadius = Interpolation.smooth(this.startSpotlightRadius, this.targetSpotlightRadius, alpha);
            this.spotlightElement.setAttribute('r', String(this.spotlightRadius));
        }

        if (this.shouldAnimateOpacity) {
            this.opacityTimer += dt;

            if (this.opacityTimer > 0.8) {
                const actualTimer = this.opacityTimer - 0.8;
                const alpha = Math.min(1, actualTimer / 0.5);
                if (alpha === 1) {
                    this.shouldAnimateOpacity = false;
                }

                this.maskRectElement.setAttribute('fill', 'rgba(255, 255, 255, ' + Interpolation.smooth(0, 0.75, alpha) + ')');
            }
        }
    }

    public render() {
        return (
            <div className="screen-theatre-layer-spotlight">
                <svg>
                    <defs>
                        <mask id="hole_spotlight">
                            <rect width="100%" height="100%" fill="rgba(255, 255, 255, 0)" ref={element => this.maskRectElement = element} />
                            <circle r={this.targetSpotlightRadius} cx="50%" cy="75%" fill="black" ref={element => this.spotlightElement = element} />
                        </mask>
                    </defs>

                    <circle r={this.outerCircleRadius} cx="0%" cy="0%" mask="url(#hole_spotlight)" />
                </svg>
            </div>
        )
    }
}