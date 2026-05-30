import model from './model.json';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import axios from 'axios';
import { IVerifiableCredential } from 'utils/types/verifiableCred';

export const claimVC = async (
    ceramic: CeramicClient,
    streamId: string | null,
    verifiableCredential: IVerifiableCredential,
    memberId: string,
    taskId: string
) => {
    try {
        const jws = await ceramic.did!.createJWS(verifiableCredential);

        verifiableCredential.badges[0].credential.proof.jws = jws.payload;

        console.log('streamId', streamId);

        if (!streamId) {
            const result = await TileDocument.create(
                ceramic,
                {
                    verifiableCredentials: [verifiableCredential],
                },
                {
                    controllers: [ceramic.did!.id],
                    family: 'verifiableCredentials',
                    schema: model.vcSchema,
                }
            );

            const streamIdResult: string = result.id.toString();
            const addVC = await axios.post(
                `${process.env.REACT_APP_GATEWAY}api/web3/verifiablecred/add`,
                {
                    memberId: memberId,
                    did: ceramic.did!.id,
                    streamId: streamIdResult,
                    verifiableCredential: verifiableCredential,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                }
            );
            const addCeramicStream = await axios.post(
                `${process.env.REACT_APP_GATEWAY}api/member/update/ceramic`,
                {
                    memberId,
                    streamId: streamIdResult,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                }
            );

            if (addCeramicStream.status === 200) {
                await axios.post(
                    `${process.env.REACT_APP_GATEWAY}api/task/update/vcstatus`,
                    {
                        member_id: memberId,
                        task_id: taskId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                        },
                    }
                );
                return result.id.toString();
            } else {
                return null;
            }
        } else {
            const stream = await TileDocument.load(ceramic, streamId);
            const verifiableCredentials = await ceramic.loadStream(streamId);

            await stream.update(
                {
                    verifiableCredentials: [
                        ...verifiableCredentials.content.verifiableCredentials,
                        verifiableCredential,
                    ],
                },
                {
                    controllers: [ceramic.did!.id],
                    family: 'verifiableCredentials',
                    schema: model.vcSchema,
                }
            );

            const addVC = await axios.post(
                `${process.env.REACT_APP_GATEWAY}api/web3/verifiablecred/add`,
                {
                    memberId: memberId,
                    did: ceramic.did!.id,
                    streamId: streamId,
                    verifiableCredential: verifiableCredential,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                }
            );

            const verifiable = await ceramic.loadStream(streamId);
            console.log(verifiable.content.verifiableCredentials);

            await axios.post(
                `${process.env.REACT_APP_GATEWAY}api/task/update/vcstatus`,
                {
                    member_id: memberId,
                    task_id: taskId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                }
            );

            return streamId;
        }
    } catch (err) {
        console.log(err);
    }
};

// export const getVerifiableCredentials = async (
//   ceramic: CeramicClient,
//   streamId: string | null
// ) => {
//   try {
//     if (streamId) {
//       const verifiableCredentials = await ceramic.loadStream(streamId);
//       return verifiableCredentials.content.verifiableCredentials;
//     }
//     return [];
//   } catch (err) {
//     console.log(err);
//   }
// };

export const getVerifiableCredentials = async (memberId: string) => {
    try {
        const result = await axios.get(
            `${process.env.REACT_APP_GATEWAY}api/web3/verifiablecred/get/${memberId}`,
            {
                headers: {
                    authorization: `Bearer ${process.env.REACT_APP_AUTH_TOKEN}`,
                },
            }
        );
        return result.data.data;
    } catch (err) {
        console.log(err);
    }
};
