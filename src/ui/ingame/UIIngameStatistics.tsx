import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Tapotan from '../../core/Tapotan';
import TickHelper from '../../core/TickHelper';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

require('./ingame-statistics.scss');

export default function UIIngameStatistics() {
    const world = Tapotan.getInstance().getGameManager().getWorld();
    const scoreValueElement = useRef(null);
    const coinsValueElement = useRef(null);
    const [animateCoinsValue, setAnimateCoinsValue] = useState(false);

    const handleTick = useCallback(() => {
        if (scoreValueElement.current) {
            scoreValueElement.current.innerHTML = world.calculatePlayerScore();
        }

        if (coinsValueElement.current) {
            if (!animateCoinsValue && world.getCoinsCollectedByPlayerCount() !== parseInt(coinsValueElement.current.innerHTML)) {
                setAnimateCoinsValue(true);
                
                setTimeout(() => {
                    setAnimateCoinsValue(false);
                }, 300);
            }

            coinsValueElement.current.innerHTML = world.getCoinsCollectedByPlayerCount();
        }
    }, [animateCoinsValue, scoreValueElement.current, coinsValueElement.current]);

    useEffect(() => {
        TickHelper.add(handleTick);

        return () => {
            TickHelper.remove(handleTick);
        };
    }, [handleTick]);

    return (
        <div className="ingame-stats">
            <div className="ingame-stats-value">
                <span>SCORE</span>
                <span ref={element => scoreValueElement.current = element}>0</span>
            </div>

            <div className={`ingame-stats-value attr--small ${animateCoinsValue ? 'attr--animate-scale' : ''}`}>
                <span>COINS</span>
                <span ref={element => coinsValueElement.current = element}>0</span>
            </div>
        </div>
    );
}