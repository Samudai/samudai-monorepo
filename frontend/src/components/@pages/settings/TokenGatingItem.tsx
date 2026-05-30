import React from 'react';
import styles from './styles/TokenGatingItem.module.scss';

interface TokenGatingItemProps {
    step?: number;
    active?: boolean;
    children?: React.ReactNode;
}

const TokenGatingItem = React.forwardRef<HTMLLIElement, TokenGatingItemProps>(
    ({ step, children }, ref) => {
        return (
            <li ref={ref} className={styles.root}>
                <div className={styles.step}>
                    <p className={styles.stepIndex}>Step {(step || 0) + 1}</p>
                </div>
                <div className={styles.content}>{children}</div>
            </li>
        );
    }
);

TokenGatingItem.displayName = 'TokenGatingItem';

export default TokenGatingItem;
