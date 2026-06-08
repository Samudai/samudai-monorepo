import bs58 from 'bs58';
import { SiweMessage } from 'siwe';
import { sign } from 'tweetnacl';
import { PaymentEnums } from '@samudai/gateway-consumer-types';

export const verifySignature = async (
    message: string,
    signature: string,
    userAddress: string,
    walletType: PaymentEnums.WalletType,
): Promise<string | null> => {
    if (walletType === PaymentEnums.WalletType.ETH) {
        const siweMessage = new SiweMessage(message);
        const { success, data, error } = await siweMessage.verify({ signature });
        if (!success || !data) {
            throw error ?? new Error('SIWE signature verification failed');
        }
        return data.nonce;
    } else {
        let nonce;
        const encodedMessage = new TextEncoder().encode(message);
        const res = sign.detached.verify(encodedMessage, bs58.decode(signature), bs58.decode(userAddress));
        if (!res) {
            return null;
        } else {
            const match = message.match(/\[(.*?)\]/);
            nonce = match ? match[1] : null;
        }
        return nonce;
    }
};
