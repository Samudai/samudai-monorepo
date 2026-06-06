export interface IPaymentProvider {
    id: string;
    icon: string;
    name: string;
    address: string;
}

export interface IPaymentWallet {
    id: string;
    icon: string;
    name: string;
    address: string;
}

export interface IPaymentCurrency {
    // id: string;
    currency: string;
    symbol?: string;
    balance: string;
    token_address: string;
    name: string;
    decimal: number;
    logo_uri: string;
}

export interface IPayment {
    id: string;
    user: {
        id: string;
        name: string;
    };
    provider: IPaymentProvider;
    amount: number;
    currency: IPaymentCurrency;
    status: string;
    updated_at: string;
    created_at: string;
}
