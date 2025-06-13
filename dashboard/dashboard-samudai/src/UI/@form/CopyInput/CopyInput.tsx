import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import CopyIcon from 'ui/SVG/CopyIcon';
import styles from './CopyInput.module.scss';

interface CopyInputProps {
    className?: string;
    link?: string;
}

const CopyInput: React.FC<CopyInputProps> = ({ link = '', className }) => {
    const ref = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>(link);

    const handleCopyToClipboard = () => {
        const input = ref.current;
        if (input) {
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value);
        }
    };

    useEffect(() => {
        setValue(link);
    }, [link]);

    return (
        <div className={clsx(styles.root, className)}>
            <div className={styles.field} data-role="field">
                <input
                    data-role="input"
                    type="text"
                    name="clipboard"
                    ref={ref}
                    className={styles.input}
                    value={value}
                    onChange={() => null}
                />
                <button
                    type="button"
                    data-role="button"
                    className={styles.button}
                    onClick={handleCopyToClipboard}
                >
                    <CopyIcon />
                </button>
            </div>
        </div>
    );
};

export default CopyInput;
