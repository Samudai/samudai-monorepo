export interface TokenType {
    name: string;
    requiredMinValue?: boolean;
    requiredContractAdderess?: boolean;
}

export interface ChainType {
    name: string;
}

export interface TokenGate {
    chain: ChainType;
    token_type: TokenType[];
}

export interface TokenGateFormData {
    tokenGating: boolean;
    chain: ChainType | null;
    tokenType: TokenType | null;
    contractAddress: string;
    minValue: number;
}
