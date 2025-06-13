import bs58 from 'bs58';
import { SiweMessage } from 'siwe';
import { sign } from 'tweetnacl';
import { PaymentEnums } from '@samudai_xyz/gateway-consumer-types';

export const verifySignature = async (
    message: string,
    signature: string,
    userAddress: string,
    walletType: PaymentEnums.WalletType
): Promise<string | null> => {
    if (walletType === PaymentEnums.WalletType.ETH) {
        let siweMessage = new SiweMessage(message);
        const fields = await siweMessage.validate(signature as string);
        return fields.nonce;
    } else {
        let nonce;
        let encodedMessage = new TextEncoder().encode(message);
        const res = sign.detached.verify(encodedMessage, bs58.decode(signature), bs58.decode(userAddress));
        if (!res) {
            return null;
        } else {
            let match = message.match(/\[(.*?)\]/);
            nonce = match ? match[1] : null;
        }
        return nonce;
    }
};
