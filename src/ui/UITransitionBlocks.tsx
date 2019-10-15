import * as React from 'react';
import Tapotan from '../core/Tapotan';
import TickHelper from '../core/TickHelper';

require('./transition-blocks.scss');

export default class UITransitionBlocks extends React.Component {

    public static instance: UITransitionBlocks;

    private timer: number = 0;

    private inBetweenCallback: Function = null;

    private isPlaying: boolean = false;

    public state = {
        stage: null
    }

    constructor(props) {
        super(props);

        UITransitionBlocks.instance = this;
    }

    public start(inBetweenCallback: Function) {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        this.timer = 0;
        this.setState({
            stage: 0
        });

        this.inBetweenCallback = inBetweenCallback;

        TickHelper.add(this.handleTick);
    }

    private handleTick = (dt: number) => {
        this.timer += dt;

        let alpha = Math.min(1, this.timer / 1);
        if (alpha === 1) {
            this.timer = 0;

            if (this.state.stage === 0) {
                this.inBetweenCallback();
                this.setState({
                    stage: 1
                });
            } else {
                TickHelper.remove(this.handleTick);
                this.setState({
                    stage: null
                });
            }
        }
    }

    public render() {
        if (this.state.stage === null) {
            return <React.Fragment></React.Fragment>;
        }

        const blocks = [];

        let widthBlocksNumber = Math.round(Tapotan.getGameWidth() / 96) + 1;
        let heightBlocksNumber = Math.round(Tapotan.getGameHeight() / 96) + 1;
        let idx = 0;
        for (let x = 0; x < widthBlocksNumber; x++) {
            for (let y = 0; y < heightBlocksNumber; y++) {
                idx++;

                blocks.push(
                    <div key={idx}
                        className={`ui-transition-blocks-block ${this.state.stage === 0 ? 'attr--stage-0' : 'attr--stage-1'}`}
                        style={{
                            left: (x * 96) + 'px',
                            top: (y * 96) + 'px',
                            animationDelay: (Math.max(0, (x + y)) * 20) + 'ms'
                        }}
                    ></div>
                );
            }
        }

        return (
            <div className="ui-transition-blocks">
                {blocks}
            </div>
        );
    }
}
