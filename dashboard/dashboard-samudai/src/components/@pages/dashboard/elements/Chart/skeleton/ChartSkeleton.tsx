import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import Block from 'components/Block/Block';
import styles from '../styles/ChartSkeleton.module.scss';

const ChartSkeleton: React.FC = () => (
    <React.Fragment>
        <Block.Header className="chart__header">
            <Skeleton.Block className={styles.status} />
            <div className="chart__controls">
                <div className="chart__controls-period">
                    <Skeleton.Block className={styles.period} />
                    <Skeleton.Block className={styles.period} />
                    <Skeleton.Block className={styles.period} />
                </div>
                <div className="chart__controls-type">
                    <Skeleton.Block className={styles.type} />
                    <Skeleton.Block className={styles.type} />
                </div>
            </div>
        </Block.Header>
        <div className="chart__container">
            <Skeleton.Block className={styles.chart} />
            <svg
                width={0}
                height={0}
                viewBox="0 0 542 216"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <clipPath
                    id="line-clippy"
                    clipPathUnits="objectBoundingBox"
                    transform="scale(0.0018450184501845,0.0046296296296296)"
                    width={0}
                    height={0}
                >
                    <rect y="160" width="45" height="56" rx="5" />
                    <rect x="71" y="99" width="45" height="117" rx="5" />
                    <rect x="142" y="14" width="45" height="202" rx="5" />
                    <rect x="213" y="129" width="45" height="87" rx="5" />
                    <rect x="284" y="46" width="45" height="170" rx="5" />
                    <rect x="355" y="78" width="45" height="138" rx="5" />
                    <rect x="426" y="33" width="45" height="183" rx="5" />
                    <rect x="497" y="66" width="45" height="150" rx="5" />
                </clipPath>
            </svg>
        </div>
    </React.Fragment>
);

export default ChartSkeleton;
