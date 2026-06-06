import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import styles from '../styles/DiscussionsList.module.scss';

interface DiscussionsListProps {
  className?: string;
  children?: React.ReactNode;
}

const DiscussionsList: React.FC<DiscussionsListProps> = ({ className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflow, setOverflow] = useState(false);

  useEffect(() => {
    let root = ref.current;
    if (root) {
      setOverflow(root.scrollHeight > root.offsetHeight);
    }
  });

  return (
    <div
      className={clsx(
        'orange-scrollbar',
        styles.root,
        className,
        isOverflow && styles.pd
      )}
      ref={ref}
    >
      <div className={styles.content} data-class="content">
        {React.Children.map(children, (child) => {
          return child;
        })}
      </div>
    </div>
  );
};

export default DiscussionsList;
