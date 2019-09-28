import * as React from 'react';
import { useCallback, useState } from 'react';
import APIRequest from '../../../api/APIRequest';
import LevelEditorUIAgent from '../../../editor/LevelEditorUIAgent';
import WorldSerializer from '../../../world/WorldSerializer';
import getBundledResourceAsDataURL from '../../lib/getBundledResourceAsDataURL';
import useSharedValue from '../../lib/useSharedValue';
import UIEditorSharedValues from '../UIEditorSharedValues';

export default function UIEditorPublishPopup() {
    const [isBusy, setBusy] = useState(false);
    const [wasPublished, setWasPublished] = useState(false);
    const [publishedLevelPublicID, setPublishedLevelPublicID] = useState('');
    const [levelTitleInputValue, setLevelTitleInputValue] = useState('My Amazing Level');
    const [levelAuthorInputValue, setLevelAuthorInputValue] = useState('An Awesome Human');
    const [levelTagsInputValue, setLevelTagsInputValue] = useState('');
    const [publishPopupVisible, setPublishPopupVisible] = useSharedValue(UIEditorSharedValues.PublishPopupVisible, false);

    const handleCloseButtonClick = useCallback(() => {
        setPublishPopupVisible(false);
    }, []);

    const handleSubmitButtonClick = useCallback(() => {
        if (isBusy) {
            return;
        }

        setBusy(true);
        setWasPublished(false);

        setTimeout(() => {
            const world = LevelEditorUIAgent.getEditorContext().getWorld();
            world.setWorldName(levelTitleInputValue);
            world.setAuthorName(levelAuthorInputValue);

            const worldData = WorldSerializer.serialize(world);

            APIRequest.post('/publish', {
                data: worldData,
                author: levelAuthorInputValue,
                tags: levelTagsInputValue
            }).then(response => {
                setBusy(false);

                if (response.data.success) {
                    setWasPublished(true);
                    setPublishedLevelPublicID(response.data.publicID);
                }
            }).catch(e => {
                setBusy(false);
            });
        }, 200);
    }, []);

    return (
        <React.Fragment>
            <div className="editor-publish-popup-overlay"></div>
            <div className="editor-publish-popup" style={{ backgroundImage: getBundledResourceAsDataURL('Graphics/Editor/PublishBackground.svg') }}>
                <div className="editor-publish-close-button" onClick={handleCloseButtonClick}>
                    <img src={getBundledResourceAsDataURL('Graphics/Editor/PublishCloseButton.svg', false)} />
                </div>

                <div className="editor-publish-popup-title">Publish your level</div>
                <div className="editor-publish-popup-body">
                    {wasPublished ? (
                        <React.Fragment>
                            <div className="editor-publish-popup-success-wrapper">
                                <div className="editor-publish-popup-message">
                                    Your level was successfully published!<br />
                                    It is now available for everyone to play. :)<br /><br />

                                    <a href={`https://tapotan.com/#play${publishedLevelPublicID}`}>https://tapotan.com/#play{publishedLevelPublicID}</a>
                                </div>

                                <div className="editor-publish-popup-submit-button" onClick={handleCloseButtonClick}>
                                    Close
                                </div>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="editor-publish-popup-fields">
                                <div className="editor-publish-popup-field">
                                    <div className="editor-publish-popup-field-label">Level Title</div>
                                    <div className="editor-publish-popup-field-input">
                                        <input type="text" value="My Amazing Level" onChange={e => setLevelTitleInputValue(e.target.value)} />
                                    </div>
                                </div>

                                <div className="editor-publish-popup-field">
                                    <div className="editor-publish-popup-field-label">Your Name</div>
                                    <div className="editor-publish-popup-field-input">
                                        <input type="text" value="An Awesome Human" onChange={e => setLevelAuthorInputValue(e.target.value)} />
                                    </div>
                                </div>

                                <div className="editor-publish-popup-field">
                                    <div className="editor-publish-popup-field-label">Tags</div>
                                    <div className="editor-publish-popup-field-input">
                                        <input type="text" value="" onChange={e => setLevelTagsInputValue(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <div className="editor-publish-popup-submit-button" onClick={handleSubmitButtonClick}>
                                {isBusy ? '...' : 'Publish'}
                            </div>
                        </React.Fragment>
                    )}
                    
                </div>
            </div>
        </React.Fragment>
    );
}