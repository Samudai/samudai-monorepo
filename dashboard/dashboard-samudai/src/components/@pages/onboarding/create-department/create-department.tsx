import React, { useRef, useState } from 'react';
import Board from '../board/board';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import styles from './create-department.module.scss';

interface CreateDepartmentProps {
    values: string[];
    onChange: (values: string[]) => void;
    onBack: () => void;
    onNext: () => void;
}

const CreateDepartment: React.FC<CreateDepartmentProps> = ({
    onBack,
    onChange,
    onNext,
    values,
}) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.includes(',')) {
            const [tag] = value.split(',');
            if (tag !== '' && !values.includes(tag)) {
                onChange([...values, tag]);
                setInputValue('');
                return;
            }
        }
        setInputValue(e.target.value);
    };

    const handleRemove = (name: string) => {
        onChange(values.filter((t) => t !== name));
    };

    const handleClick = () => {
        inputRef.current?.focus();
    };

    return (
        <Board title="Create Department" icon="/img/icons/docs.png" onBack={onBack}>
            <div className={styles.dep_field} onClick={handleClick}>
                <div className={styles.dep_list}>
                    {values.map((dep) => (
                        <div className={styles.dep_item} key={dep}>
                            <span className={styles.dep_item_name}>{dep}</span>
                            <CloseButton
                                className={styles.dep_item_remove}
                                onClick={handleRemove.bind(null, dep)}
                            />
                        </div>
                    ))}
                    <input
                        ref={inputRef}
                        value={inputValue}
                        onChange={handleChange}
                        className={styles.dep_input}
                    />
                </div>
            </div>
            <Button className={styles.dep_next} color="orange" onClick={onNext}>
                <span>Next</span>
            </Button>
        </Board>
    );
};

export default CreateDepartment;
