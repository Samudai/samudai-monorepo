import { DaoTags } from 'components/@pages/new-discovery';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import React, { useState } from 'react';
import Input from 'ui/@form/Input/Input';
import css from './describe-dao-modal.module.scss';

interface DescribeDaoModalProps {}

export const DescribeDaoModal: React.FC<DescribeDaoModalProps> = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const updateTags = () => {
        const val = inputValue.trim();

        if (val.length < 2) return;

        if (tags.findIndex((t) => t === val) === -1) {
            setTags([...tags, inputValue]);
        }
        setInputValue('');
    };

    const onKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
        if (ev.code === 'Comma' || ev.code === 'Enter') {
            ev.preventDefault();
            updateTags();
        }
    };

    return (
        <Popup className={css.root}>
            <PopupTitle icon="/img/smile.png" title="What describes your DAO" />

            <PopupSubtitle className={css.subtitle} text="Type Category" />

            <Input
                value={inputValue}
                onChange={(ev) => setInputValue(ev.target.value)}
                className={css.input}
                onKeyDown={onKeyDown}
                placeholder="Collector DAO, Investment DAO, Product DAO etc"
            />

            <div className={css.tags}>
                <DaoTags tags={tags} />
            </div>

            <button className={css.confirmBtn}>
                <span>Confirm</span>
            </button>
        </Popup>
    );
};
