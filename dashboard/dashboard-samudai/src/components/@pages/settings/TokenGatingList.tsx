import React, { useEffect, useRef } from 'react';
import { useResize } from 'hooks/useResize';
import Item from './TokenGatingItem';
import styles from './styles/TokenGatingList.module.scss';

interface TokenGatingListProps {
    children?: React.ReactNode;
}

const TokenGatingList: React.FC<TokenGatingListProps> = ({ children }) => {
    const { elementRef } = useResize<HTMLDivElement>();
    const lineRef = useRef<HTMLLIElement>(null);
    const items = useRef<HTMLLIElement[]>([]);

    useEffect(() => {
        items.current = items.current.filter((item) => item !== null);

        if (lineRef.current) {
            lineRef.current.style.height =
                (items.current[items.current.length - 1]?.offsetTop || 0) + 'px';
        }
    });

    return (
        <div className={styles.root} ref={elementRef}>
            <ul className={styles.list}>
                <li className={styles.stepLine} ref={lineRef}></li>
                {React.Children.map(children, (child, index) => {
                    if (React.isValidElement(child) && child.type === Item) {
                        if (child.props.active) {
                            return React.cloneElement(child as React.ReactElement<any>, {
                                ref: (node: HTMLLIElement) => (items.current[index] = node),
                                step: index,
                            });
                        }
                    }
                    return null;
                })}
            </ul>
        </div>
    );
};

export default Object.assign(TokenGatingList, {
    Item,
});
