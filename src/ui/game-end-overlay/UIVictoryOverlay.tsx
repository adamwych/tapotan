import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';
import UICircularMaskTransition from '../UICircularMaskTransition';
import Tapotan from '../../core/Tapotan';
import WorldLoader from '../../world/WorldLoader';
import { GameState } from '../../core/GameManager';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import APIRequest from '../../api/APIRequest';

require('./game-end-overlay.scss');
require('./victory-overlay.scss');

interface UIVictoryOverlayProps {
    inEditor: boolean;
    onCloseRequest: Function;
}

export default function UIVictoryOverlay(props: UIVictoryOverlayProps) {
    const textElement = useRef(null);
    const [isLoadingScoreboard, setIsLoadingScoreboard] = useState(true);
    const [scoreboard, setScoreboard] = useState(null);

    const handleMainMenuButtonClick = useCallback(event => {
        playUICircularMaskTransition(event.target, () => {
            props.onCloseRequest();
            Tapotan.getInstance().getScreenManager().startMainMenu();
        });
    }, []);

    const handlePlayAgainButtonClick = useCallback(event => {
        playUICircularMaskTransition(event.target, () => {
            props.onCloseRequest();

            const currentWorld = Tapotan.getInstance().getGameManager().getWorld();
            const world = WorldLoader.load(currentWorld.getRawData(), currentWorld.getAuthorName(), {
                compressed: false,
                mask: true,
                physics: false
            });
            world.setLevelPublicID(currentWorld.getLevelPublicID())
            world.setUserRating(currentWorld.getUserRating() || -1);
            Tapotan.getInstance().startLevel(world);
        });
    }, []);

    const handleContinueButtonClick = useCallback(event => {
        if (props.inEditor) {
            LevelEditorUIAgent.setInteractionEnabled(true);
            LevelEditorUIAgent.emitTogglePlaythrough();
            Tapotan.getInstance().getGameManager().setGameState(GameState.InEditor);
            props.onCloseRequest();
        } else {
            playUICircularMaskTransition(event.target, () => {
                props.onCloseRequest();

                APIRequest.get('/next_level', {
                    current: Tapotan.getInstance().getGameManager().getWorld().getLevelPublicID()
                }).then(response => {
                    // No more levels to play. :(
                    if (!response.data.success) {
                        Tapotan.getInstance().getScreenManager().startMainMenu();
                        return;
                    }

                    const world = WorldLoader.load(response.data.data, response.data.authorName);
                    if (!world) {
                        Tapotan.getInstance().getScreenManager().startMainMenu();
                        return;
                    }

                    world.setLevelPublicID(response.data.publicID);
                    world.setUserRating(response.data.rating || -1);
                    Tapotan.getInstance().startLevel(world);
                });
            });
        }

    }, []);

    const playUICircularMaskTransition = (element: HTMLElement, callback: Function) => {
        const rect = element.getBoundingClientRect();
        UICircularMaskTransition.instance.start(50, 50, () => {
            callback();
        });
    }

    useEffect(() => {
        if (props.inEditor) {
            LevelEditorUIAgent.setInteractionEnabled(false);
            setScoreboard([
                {
                    place: 1,
                    name: 'You',
                    score: Tapotan.getInstance().getGameManager().getWorld().calculatePlayerScore(),
                    player: true
                }
            ]);
            setIsLoadingScoreboard(false);
        } else {
            setTimeout(() => {
                setScoreboard([
                    {
                        place: 1,
                        name: 'Unknown Player',
                        score: 999
                    },
    
                    {
                        divider: true
                    },
    
                    {
                        place: 153,
                        name: 'You',
                        score: Tapotan.getInstance().getGameManager().getWorld().calculatePlayerScore(),
                        divider: false,
                        player: true
                    },
    
                    {
                        place: 154,
                        name: 'human',
                        score: 23
                    },
                ]);
                setIsLoadingScoreboard(false);
            }, 2500);
        }

        setTimeout(() => {
            textElement.current.addEventListener('animationend', () => {
                textElement.current.classList.add('attr--stage2');
            });
        });
    }, []);

    return (
        <div className="victory-overlay">
            <div className="victory-overlay-modal">
                <div className="victory-overlay-modal-text" ref={element => textElement.current = element} style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/VictoryModal/Text.svg') }}></div>
                <div className="victory-overlay-modal-flag" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/VictoryModal/Flag.svg') }}></div>
                <div className="victory-overlay-modal-flag-bg" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/VictoryModal/FlagBG.svg') }}></div>

                {!props.inEditor && (
                    <React.Fragment>
                        <div className="victory-overlay-main-menu-button" onClick={handleMainMenuButtonClick}>
                            <img src={getBundledResourceAsDataURL('Graphics/VictoryModal/MainMenuButton.svg', false)} />
                        </div>

                        <div className="victory-overlay-play-again-button" onClick={handlePlayAgainButtonClick}>
                            <img src={getBundledResourceAsDataURL('Graphics/VictoryModal/PlayAgainButton.svg', false)} />
                        </div>
                    </React.Fragment>
                )}

                <div className="victory-overlay-modal-content-background" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/VictoryModal/ContentBG.svg') }}>
                    <div className="victory-overlay-modal-scoreboard">
                        <div className="victory-overlay-modal-scoreboard-title">Scoreboard</div>
                        <div className="victory-overlay-modal-scoreboard-table">
                            {isLoadingScoreboard ? (
                                <div key="loading" className="victory-overlay-modal-scoreboard-row">
                                    <div></div>
                                    <div style={{ textAlign: 'center' }}>Loading...</div>
                                    <div></div>
                                </div>
                            ) : (
                                <React.Fragment>
                                    {scoreboard.map((entry, index) => (
                                        <React.Fragment key={index}>
                                            {entry.divider ? (
                                                <div className="victory-overlay-modal-scoreboard-row">
                                                    <div></div>
                                                    <div style={{ textAlign: 'center' }}>...</div>
                                                    <div></div>
                                                </div>
                                            ) : (
                                                <div className={`victory-overlay-modal-scoreboard-row ${entry.player ? 'attr--player' : ''}`}>
                                                    <div>{entry.place}</div>
                                                    <div>{entry.name}</div>
                                                    <div>{entry.score}</div>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            )}
                        </div>
                    </div>

                    <div className="victory-overlay-continue-button" onClick={handleContinueButtonClick}>
                        <img src={getBundledResourceAsDataURL('Graphics/VictoryModal/ContinueButton.svg', false)} />
                        <span>{props.inEditor ? 'Close' : 'Continue'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}