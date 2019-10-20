import * as React from 'react';
import getBundledResourceAsDataURL from '../lib/getBundledResourceAsDataURL';

interface UIEditorObjectActionButtonProps {
    label: string;
    type: 'Rotate' | 'Flip' | 'Key' | 'NoteChange' | 'Remove';
    onClick: React.MouseEventHandler;
}

export default function UIEditorObjectActionButton(props: UIEditorObjectActionButtonProps) {
    let backgroundColor = '#0053cc';

    if (props.type === 'Remove') {
        backgroundColor = '#cc0000';
    }

    return (
        <div className="editor-object-action-button" onClick={props.onClick}>
            <div className="editor-object-action-button-tooltip" style={{ background: backgroundColor }}>{props.label}</div>
            <div className="editor-object-action-button-icon">
                <img src={getBundledResourceAsDataURL('Graphics/Editor/ObjectAction' + props.type + '.svg', false)} />
            </div>
        </div>
    )
}