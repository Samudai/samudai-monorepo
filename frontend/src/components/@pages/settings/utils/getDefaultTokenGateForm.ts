import { TokenGateFormData } from './types';

export function getDefaultTokenGateForm(): TokenGateFormData {
    return {
        tokenGating: false,
        chain: null,
        tokenType: null,
        contractAddress: '',
        minValue: 0,
    };
}
