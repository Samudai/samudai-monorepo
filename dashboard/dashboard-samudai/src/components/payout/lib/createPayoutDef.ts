import { v4 as uuidv4 } from 'uuid';

export const createPayoutDef = () => ({
    id: uuidv4(),
    amount: 0,
    currency: {
        currency: '',
        symbol: '',
        balance: '',
        token_address: '',
        name: '',
        decimal: 0,
        logo_uri: '',
    },
    provider: '',
});
