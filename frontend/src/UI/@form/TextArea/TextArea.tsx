import { TextareaHTMLAttributes, useEffect } from 'react';
import React from 'react';
import clsx from 'clsx';
import { useResize } from 'hooks/useResize';
import './TextArea.scss';

type TextAreaType = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    cancelAutoHeight?: boolean;
    extraText?: string;
    analyticsId?: string;
    onClickPass?: () => void;
    changeColor?: boolean;
};

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaType>(
    (
        { className, cancelAutoHeight, extraText, changeColor, analyticsId, onClickPass, ...props },
        ref
    ) => {
        const { elementRef } = useResize<HTMLTextAreaElement>();

        useEffect(() => {
            if (ref && typeof ref === 'object') {
                ref.current = elementRef.current;
            }
            if (cancelAutoHeight) return;
            const textarea = elementRef.current;
            if (textarea) {
                textarea.style.height = '';
                textarea.style.height = `${textarea.scrollHeight}px`;
            }
        });

        return (
            <React.Fragment>
                <textarea
                    ref={elementRef}
                    className={clsx('textarea', className)}
                    style={{
                        color: changeColor ? '#a0a0a0e0' : '',
                        marginBottom: changeColor ? '5px' : '',
                    }}
                    {...props}
                ></textarea>
                {extraText && (
                    <span
                        style={{
                            font: '400 14px/1.25 "Lato", sans-serif',
                            color: '#FDC087',
                            cursor: 'pointer',
                        }}
                        data-analytics-click={`${analyticsId}`}
                        onClick={onClickPass}
                    >
                        {extraText}
                    </span>
                )}
            </React.Fragment>
        );
    }
);

TextArea.displayName = 'TextArea';

export default TextArea;
