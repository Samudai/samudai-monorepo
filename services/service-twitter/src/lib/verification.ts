import { recoverPersonalSignature } from 'eth-sig-util';
import { utils } from 'ethers';

const reg = new RegExp('(?<=sig:).*');

export const handleVerify = async (username: string, tweetBody: string) => {
  console.log(tweetBody);
  const matchedText = tweetBody.match(reg);
  const tweetSignature = matchedText![0].slice(0, 132);
  console.log('TweetSignature', tweetSignature);
  console.log(username);

  const data = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
      ],
      Permit: [{ name: 'username', type: 'string' }],
    },
    domain: {
      name: 'Sybil Verifier',
      version: '1',
    },
    primaryType: 'Permit',
    message: {
      username: username,
    },
  };

  //   console.log(JSON.stringify(data));

  //   const message = utils.hashMessage(JSON.stringify(data));

  const signer = recoverPersonalSignature({
    data: JSON.stringify(data),
    sig: tweetSignature,
  });

  const formattedSigner = utils.getAddress(signer);

  console.log('signer', formattedSigner);

  return formattedSigner;
};
