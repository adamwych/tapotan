import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import LevelEditorUIAgent from '../../editor/LevelEditorUIAgent';
import GameObjectComponentPlayer from '../../world/components/GameObjectComponentPlayer';
import World from '../../world/World';

export default function UIEditorDevTools() {
    const [gravity, setGravity] = useState({x: 0, y: 0});
    const [maxVelocityX, setMaxVelocityX] = useState(0);
    const [speedForce, setSpeedForce] = useState(0);
    const [airSpeedForce, setAirSpeedForce] = useState(0);
    const [jumpForce, setJumpForce] = useState(0);
    const [jumpContinueForce, setJumpContinueForce] = useState(0);
    let history = React.useRef([]);

    useEffect(() => {
        setGravity(World.instance.getPhysicsWorld().getGravity());

        LevelEditorUIAgent.onPlaythroughStarted(() => {
            history.current.push({
                gravity, maxVelocityX, speedForce, airSpeedForce, jumpForce, jumpContinueForce
            });

            console.log('Changes history:');
            console.log(history);

            setMaxVelocityX(World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).speed);
            setSpeedForce(World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).speedForce);
            setAirSpeedForce(World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).airSpeedForce);
            setJumpForce(World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).jumpForce);
            setJumpContinueForce(World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).jumpContinueForce);
        });
    }, []);

    return (
        <div className="editor-devtools">
            <div className="editor-devtools-field">
                <label>Gravity: {gravity.y}</label>
                <input type="range" value={gravity.y * 100} min="0" max="5000" onChange={e => {
                    let newGravity = {
                        x: 0,
                        y: parseInt(e.target.value) / 100
                    };

                    setGravity(newGravity);
                    World.instance.getPhysicsWorld().setGravity(newGravity);
                }} />
            </div>

            <div className="editor-devtools-field">
                <label>Max. velocity X: {maxVelocityX}</label>
                <input type="range" value={maxVelocityX * 100} min="0" max="500" onChange={e => {
                    setMaxVelocityX(parseInt(e.target.value) / 100);
                    World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).speed = parseInt(e.target.value) / 100;
                }} />
            </div>

            <div className="editor-devtools-field">
                <label>Move speed force: {speedForce}</label>
                <input type="range" value={speedForce * 100} min="0" max="15000" onChange={e => {
                    setSpeedForce(parseInt(e.target.value) / 100);
                    World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).speedForce = parseInt(e.target.value) / 100;
                }} />
            </div>

            <div className="editor-devtools-field">
                <label>Air flight force: {airSpeedForce}</label>
                <input type="range" value={airSpeedForce * 100} min="0" max="15000" onChange={e => {
                    setAirSpeedForce(parseInt(e.target.value) / 100);
                    World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).airSpeedForce = parseInt(e.target.value) / 100;
                }} />
            </div>

            <div className="editor-devtools-field">
                <label>Jump force: {jumpForce}</label>
                <input type="range" value={jumpForce * 100} min="0" max="15000" onChange={e => {
                    setJumpForce(parseInt(e.target.value) / 100);
                    World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).jumpForce = parseInt(e.target.value) / 100;
                }} />
            </div>

            <div className="editor-devtools-field">
                <label>Jump continue force: {jumpContinueForce}</label>
                <input type="range" value={jumpContinueForce * 100} min="0" max="15000" onChange={e => {
                    setJumpContinueForce(parseInt(e.target.value) / 100);
                    World.instance.getPlayer().getComponentByType<GameObjectComponentPlayer>(GameObjectComponentPlayer).jumpContinueForce = parseInt(e.target.value) / 100;
                }} />
            </div>
        </div>
    )
}