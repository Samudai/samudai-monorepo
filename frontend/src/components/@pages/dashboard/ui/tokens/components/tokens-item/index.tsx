import clsx from 'clsx';
import './tokens-item.scss';

export const TokensItem: React.FC<any> = ({
    title,
    active,
    balance,
    symbol,
    usdValue,
    className,
}) => {
    return (
        <li
            className={clsx('tokens-item', title && 'tokens-item_title', className, { active })}
            key={symbol}
        >
            <div className="tokens-item__col tokens-item__col_price">
                <span>{!title ? symbol || '' : 'Token ($)'}</span>
            </div>
            <div className="tokens-item__col tokens-item__col_amount" style={{ textAlign: 'left' }}>
                <span>{!title ? (usdValue * balance).toFixed(3) : 'Value'}</span>
            </div>
            <div className="tokens-item__col tokens-item__col_total" style={{ textAlign: 'left' }}>
                <span style={{ marginLeft: '13px' }}>{!title ? balance : 'Balance'}</span>
            </div>
        </li>
    );
};
