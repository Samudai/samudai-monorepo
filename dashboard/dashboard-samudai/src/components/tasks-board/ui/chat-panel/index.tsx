import { GifIcon } from 'components/@pages/forum/ui/icons/gif-icon';
import { SmileIcon } from 'components/@pages/forum/ui/icons/smile-icon';
import React, { useState } from 'react';
import TextArea from 'ui/@form/TextArea/TextArea';
import SendIcon from 'ui/SVG/SendIcon';
import css from './chat-panel.module.scss';

interface ChatPanelProps {
    onSubmit?: (value: string) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ onSubmit }) => {
    const [inputValue, setInputValue] = useState('');
    return (
        <div className={css.panel}>
            <TextArea
                className={css.panel_input}
                placeholder="Type message..."
                value={inputValue}
                onChange={(ev) => setInputValue(ev.target.value)}
            />
            <div className={css.panel_controls}>
                <button className={css.panel_gifBtn}>
                    <GifIcon />
                </button>
                <button className={css.panel_smileBtn}>
                    <SmileIcon />
                </button>
                <button className={css.panel_submitBtn}>
                    <SendIcon />
                </button>
            </div>
        </div>
    );
};
