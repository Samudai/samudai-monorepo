import React from 'react';
import IncreaseIcon from 'ui/SVG/chart/IncreaseIcon';
import styles from './styles/token-statistic.module.scss';

const stats = [
    {
        token: 'BTS',
        stat: '5.12%',
        grow: false,
        amount: '3,913,00',
    },
    {
        token: 'ETH',
        stat: '4.07%',
        grow: true,
        amount: '3.917.00',
    },
    {
        token: 'BTS2',
        stat: '21%',
        grow: false,
        amount: '3.917.00',
    },
    {
        token: 'ETH 2',
        stat: '14.07%',
        grow: true,
        amount: '1.917.00',
    },
];

const TokenStatistic: React.FC = (props) => {
    return (
        <div className={styles.stat}>
            <ul className={styles.stat_list}>
                {stats.map((item) => (
                    <li className={styles.stat_item} key={item.token} data-growing={item.grow}>
                        <div className={styles.stat_item_wrapper}>
                            <p className={styles.stat_tok}>
                                {item.token} <IncreaseIcon /> <span>{item.stat}</span>
                            </p>
                            <p className={styles.stat_amount}>$ {item.amount}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TokenStatistic;
