import React from 'react';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import TextArea from 'ui/@form/TextArea/TextArea';
import styles from './DynamicInput.module.scss';
import CloseButton from 'ui/@buttons/Close/Close';

interface DynamicInputProps {
    className?: string;
    title?: string;
    values?: string[];
    onChangeValues?: (values: string[]) => void;
}

const DynamicInput: React.FC<DynamicInputProps> = ({
    className,
    title,
    values,
    onChangeValues,
}) => {
    const handleAddInput = () => {
        if (values && onChangeValues) {
            onChangeValues([...values, '']);
        }
    };

    const handleRemoveInput = (index: number) => {
        if (values && onChangeValues) {
            onChangeValues(values.filter((_, id) => id !== index));
        }
    };

    const handleChange = (index: number, ev: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (values && onChangeValues) {
            onChangeValues(values.map((value, id) => (id === index ? ev.target.value : value)));
        }
    };

    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.head}>
                {title && <h4 className={styles.title}>{title}</h4>}
                <Button color="orange" className={styles.addBtn} onClick={handleAddInput}>
                    <PlusIcon />
                    <span>Add</span>
                </Button>
            </div>
            <ul className={styles.list}>
                {values?.map((input, idx) => (
                    <li className={styles.item} key={idx}>
                        <p className={styles.itemIndex}>{idx + 1}.</p>
                        <TextArea
                            className={styles.itemInput}
                            value={values[idx]}
                            onChange={handleChange.bind(null, idx)}
                        />
                        <CloseButton
                            className={styles.removeBtn}
                            onClick={() => handleRemoveInput(idx)}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DynamicInput;
