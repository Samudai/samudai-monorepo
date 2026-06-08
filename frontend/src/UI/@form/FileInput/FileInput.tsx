import React from 'react';
import { useRef } from 'react';
import clsx from 'clsx';
import styles from './FileInput.module.scss';

interface FileInputProps {
    children?: React.ReactNode;
    className?: string;
    name?: string;
    multiple?: boolean;
    accept?: HTMLInputElement['accept'];
    onChange?: (file: File, event: React.ChangeEvent<HTMLInputElement>) => void;
    onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDragLeave?: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
    dataAnalyticsId?: string;
}

const FileInput: React.FC<FileInputProps> = ({
    className,
    name,
    multiple,
    children,
    accept,
    onChange,
    onDragLeave,
    onDragOver,
    onDrop,
    dataAnalyticsId,
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (onChange) {
                onChange(e.target.files[0], e);
            }
        }
    };

    return (
        <div
            className={clsx(styles.root, className)}
            onClick={handleClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            data-analytics-click={dataAnalyticsId}
        >
            <input
                ref={inputRef}
                name={name || 'file'}
                type="file"
                id="file-input-id"
                className={styles.input}
                multiple={multiple}
                onChange={handleChange}
                accept={accept}
            />
            {children}
        </div>
    );
};

export default FileInput;
