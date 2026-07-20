import React, { useState } from 'react';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import styles from './styles/JobTags.module.scss';

export interface TagType {
    id: string;
    name: string;
}

interface JobTagsProps {
    className?: string;
    data: TagType[];
    onChange: (tags: TagType[]) => void;
}

const JobTags: React.FC<JobTagsProps> = ({ data, onChange, className }) => {
    const [inputVal, setInputVal] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (value.includes(',')) {
            let [tag] = value.split(',');
            tag = tag.trim();
            if (tag !== '') {
                if (data.find((e) => e.name === tag)) {
                    setInputVal('');
                    return;
                }
                onChange([...data, { name: tag, id: Date.now().toString() }]);
                setInputVal('');
                return;
            }
        }

        setInputVal(value);
    };

    const handleRemove = (id: string) => {
        onChange(data.filter((tag) => tag.id !== id));
    };

    return (
        <div className={clsx(styles.tags, className)}>
            <div className={styles.tags_wrapper}>
                {data.map((tag) => (
                    <div className={styles.tags_item} key={tag.id}>
                        <span>{tag.name}</span>
                        <CloseButton
                            className={styles.tags_remove}
                            onClick={handleRemove.bind(null, tag.id)}
                        />
                    </div>
                ))}
                <input
                    placeholder="Type tags..."
                    value={inputVal}
                    onChange={handleChange}
                    className={styles.tags_input}
                />
            </div>
        </div>
    );
};

export default JobTags;
