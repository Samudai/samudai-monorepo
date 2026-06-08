import { CurrencyModal } from './CurrencyModal';
import styles from './styles/ShowCurrency.module.scss';
import Tooltip from 'ui/@form/Tooltip/Tooltip';

interface ShowCurrencyProps {
    data: {
        amount: number;
        currency: string;
        logo: string;
    }[];
}

const ShowCurrency: React.FC<ShowCurrencyProps> = ({ data }) => {
    if (!data.length) {
        return <></>;
    }

    const newData = Array.from(
        data
            .reduce((map, obj) => {
                const existingObj = map.get(obj.currency);

                if (existingObj) {
                    existingObj.amount += obj.amount;
                } else {
                    map.set(obj.currency, {
                        amount: obj.amount,
                        currency: obj.currency,
                        logo: obj.logo,
                    });
                }

                return map;
            }, new Map())
            .values()
    );

    return (
        <CurrencyModal data={newData} disabled={newData.length === 1}>
            <div className={styles.info_tokens}>
                {newData.length === 1 ? (
                    <>
                        <img
                            src={newData[0].logo}
                            className={styles.info_tokens_img}
                            alt={newData[0].currency}
                            key={newData[0].currency}
                        />
                        <Tooltip
                            className={styles.info_tokens_tooltip}
                            content={`${newData[0].amount} ${newData[0].currency}`}
                        >
                            <span className={styles.info_tokens_val}>
                                {newData[0].amount} {newData[0].currency}
                            </span>
                        </Tooltip>
                    </>
                ) : (
                    <button className={styles.button}>Multiple Currencies</button>
                )}
            </div>
        </CurrencyModal>
    );

    // if (newData.length === 1) {
    //     return <>{`${newData[0].amount} ${newData[0].currency}`}</>;
    // }

    // return <button className={styles.button}>Multiple Currencies</button>;
};

export default ShowCurrency;
