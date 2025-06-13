import React, { useRef, useState } from 'react';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import TextArea from 'ui/@form/TextArea/TextArea';
import PlusIcon from 'ui/SVG/PlusIcon';
import css from './creator.module.scss';

interface CreatorProps {
    columnId?: number;
    onSubmit?: (title: string, columnId: number) => Promise<void>;
    dataClickIds?: {
        createButton: string;
        titleInput: string;
        submitButton: string;
    };
}

const useFocus = () => {
    const htmlElRef = useRef<HTMLTextAreaElement>(null);
    const setFocus = () => {
        htmlElRef.current && htmlElRef.current.focus();
    };

    return [htmlElRef, setFocus];
};

export const Creator: React.FC<CreatorProps> = ({ columnId, onSubmit, dataClickIds }) => {
    const [inputValue, setInputValue] = useState('');
    const [isCreate, setIsCreate] = useState(false);

    const handleSubmit = async () => {
        const oldInputValue = inputValue;
        setIsCreate(false);
        setInputValue('');
        const title = inputValue.trim();
        if (columnId !== undefined && onSubmit !== undefined && title.length > 0) {
            onSubmit(title, columnId).catch(() => {
                setIsCreate(true);
                setInputValue(oldInputValue);
            });
        }
    };

    return (
        <div className={css.creator} data-card>
            {!isCreate && (
                <div data-analytics-parent={dataClickIds?.createButton}>
                    <button
                        className={css.creator_createBtn}
                        onClick={setIsCreate.bind(null, true)}
                        data-analytics-click="add_card_button"
                    >
                        <PlusIcon />
                        <span>Add Card</span>
                    </button>
                </div>
            )}
            {isCreate && (
                <>
                    <TextArea
                        autoFocus
                        className={css.creator_textarea}
                        value={inputValue}
                        onChange={(ev) => setInputValue(ev.target.value)}
                        placeholder="Enter a title for this card..."
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit();
                            }
                        }}
                        data-analytics-click={dataClickIds?.titleInput}
                    />
                    <div className={css.creator_controls}>
                        <Button
                            className={css.creator_submitBtn}
                            onClick={handleSubmit}
                            color="orange"
                            data-analytics-click={dataClickIds?.submitButton}
                        >
                            <span>Add Card</span>
                        </Button>

                        <CloseButton
                            className={css.creator_cancelBtn}
                            onClick={setIsCreate.bind(null, false)}
                        />

                        {/* <SettingsDropdown className={css.creator_settingsBtn}>
                            <SettingsDropdown.Item>Option 1</SettingsDropdown.Item>
                            <SettingsDropdown.Item>Option 2</SettingsDropdown.Item>
                            <SettingsDropdown.Item>Option 3</SettingsDropdown.Item>
                        </SettingsDropdown> */}
                    </div>
                </>
            )}
        </div>
    );
};
