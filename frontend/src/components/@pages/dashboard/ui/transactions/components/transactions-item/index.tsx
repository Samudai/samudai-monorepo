export const TransactionsItem: React.FC<any> = ({
    transactionHash,
    submissionDate,
    value,
    isExecuted,
    chainId,
}) => {
    return (
        <li className="transactions-item" key={transactionHash}>
            <div className="transactions-item__col transactions-item__col_transaction">
                <h4 className="transactions-item__name">Safe Transaction</h4>
                <p className="transactions-item__id">
                    TX{' '}
                    <span>
                        {transactionHash
                            ? transactionHash.slice(0, 4) + '...' + transactionHash.slice(63)
                            : ''}
                    </span>
                </p>
            </div>
            <div className="transactions-item__col transactions-item__col_date">
                <p className="transactions-item__date">{submissionDate?.slice(0, 10) || ''}</p>
            </div>
            <div className="transactions-item__col transactions-item__col_sum">
                <p className="transactions-item__amount">
                    {Number(value).toFixed(3)} <strong>{'$'}</strong>
                </p>
            </div>
            <div className="transactions-item__col transactions-item__col_status">
                <div className="transactions-item__status">
                    {isExecuted && <span style={{ color: '#b2ffc3' }}>Successful</span>}
                    {!isExecuted && <span style={{ color: '#fdc087' }}>Pending</span>}
                </div>
            </div>
        </li>
    );
};
