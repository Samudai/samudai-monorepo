import clsx from 'clsx';
import Sprite from 'components/sprite';
import React, { useEffect, useMemo, useState } from 'react';
import Input from '../Input/Input';
import css from './input-editable.module.scss';
import isURL from 'validator/lib/isURL';
import { toast } from 'utils/toast';

interface InputEditableProps {
    input: string;
    placeholder?: string;
    initialEdit?: boolean;
    onChange: (value: string) => void;
}

export const InputEditable: React.FC<InputEditableProps> = ({
    input,
    onChange,
    initialEdit = false,
    placeholder,
}) => {
    const firstValue = useMemo(() => input, []);
    const [localValue, setLocalValue] = useState(input);
    const [isEditable, setIsEditable] = useState(initialEdit);

    const onSubmit = () => {
        if (!isURL(localValue)) {
            return toast('Failure', 5000, 'Please enter valid url', '')();
        }
        onChange(localValue);
        setIsEditable(false);
    };

    useEffect(() => {
        setLocalValue(input);
    }, [input]);

    return (
        <div className={clsx(css.root, !isEditable && css.rootReadonly)}>
            <Input
                className={css.input}
                value={localValue}
                onChange={(ev) => setLocalValue(ev.target.value)}
                disabled={!isEditable}
                placeholder={placeholder}
                controls={
                    isEditable ? (
                        <button
                            className={css.doneBtn}
                            onClick={onSubmit}
                            disabled={input === localValue}
                        >
                            <Sprite url="/img/sprite.svg#mark" />
                        </button>
                    ) : undefined
                }
            />
            {!isEditable && (
                <button className={css.editBtn} onClick={setIsEditable.bind(null, true)}>
                    <Sprite url="/img/sprite.svg#pen" />
                </button>
            )}
        </div>
    );
};
