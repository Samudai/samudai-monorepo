import React, { useRef } from 'react';
import clsx from 'clsx';
import useInput from 'hooks/useInput';
import Input from 'ui/@form/Input/Input';
import SendIcon from 'ui/SVG/SendIcon';
import css from './message-panel.module.scss';

interface MessagePanelProps {
    className?: string;
    initialText?: string;
    placeholder?: string;
    onSend?: (value: string) => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({
    className,
    initialText,
    placeholder,
    onSend,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue, _, clearValue] = useInput(initialText || '');

    const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;
        if (target.closest('button')) return;
        inputRef.current?.focus();
    };

    const onSubmit = (ev?: React.MouseEvent<HTMLButtonElement>) => {
        if (onSend) onSend(value);
        clearValue();
    };

    return (
        <div
            className={clsx(css.panel, className)}
            onClick={onClick}
            data-analytics-click="message-panel"
        >
            <Input
                inputRef={inputRef}
                value={value}
                onChange={setValue}
                className={css.panel_input}
                placeholder={placeholder || 'Type text...'}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        if (value.trim() === '') return;
                        onSubmit();
                    }
                }}
                data-analytics-click="message-panel"
            />
            <div className={css.panel_controls}>
                {/* <button className={css.panel_smileBtn} data-analytics-click="emoji_button">
                    <SmileIcon />
                </button> */}
                <button
                    className={css.panel_sendBtn}
                    onClick={onSubmit}
                    type="submit"
                    data-analytics-click="send_message_button"
                >
                    <SendIcon />
                    <span>Send</span>
                </button>
            </div>
        </div>
    );
};

export default MessagePanel;
