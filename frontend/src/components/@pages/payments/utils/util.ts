import { IPaymentCurrency } from 'utils/types/Payments';

export const currencyAdd = (chainid: number, balance: string): IPaymentCurrency => {
    const obj: any = {
        '137': {
            value: 'Polygon',
            currency: 'MATIC',
            balance,
            token_address: '',
        },
        '1': {
            value: 'Mainnet',
            currency: 'ETH',
            balance,
            token_address: '',
        },
        '5': {
            value: 'Goerli',
            currency: 'GORETH',
            balance,
            token_address: '',
        },
    };
    return obj[chainid.toString()];
};
