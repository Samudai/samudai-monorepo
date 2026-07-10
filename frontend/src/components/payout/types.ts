export interface IPayout {
    id: string;
    provider: string;
    currency: PayoutCurrency;
    amount: string | number;
    completed?: boolean;
}

export interface PayoutCurrency {
    currency: string;
    symbol?: string;
    balance: string;
    token_address: string;
    name: string;
    decimal: number;
    logo_uri: string;
}

export interface IBountyPayout {
    id: string;
    position: number;
    transactions: IPayout[];
}
