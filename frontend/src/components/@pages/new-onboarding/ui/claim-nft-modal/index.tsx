import React from 'react';
import Confetti from 'react-confetti';
import {
    changeContributorProgress,
    selectContributorProgress,
    selectProvider,
} from 'store/features/common/slice';
import {
    useUpdateClaimNFTRequestMutation,
    useUpdateContributorProgressMutation,
} from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './claim-nft-modal.module.scss';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';

interface ClaimNFTModalProps {
    onClose?: () => void;
}

export const ClaimNFTModal: React.FC<ClaimNFTModalProps> = ({ onClose }) => {
    const provider = useTypedSelector(selectProvider);
    const memberId = getMemberId();
    const [confetti, setConfetti] = React.useState<boolean>(false);
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const [updateContributorProgress] = useUpdateContributorProgressMutation();
    const [claimNFTRequest] = useUpdateClaimNFTRequestMutation();

    const handleClaim = async () => {
        try {
            // const sdk = new NFTClaim(process.env.REACT_APP_ENV!);
            // provider and phase of mint (0,1,2,3 ...)
            // const res = await sdk.claimNFT(provider!, 0);

            const res = await claimNFTRequest({ memberId }).unwrap();

            if (res.data) {
                // await updateSubDomain({
                //     memberId: getMemberId(),
                //     subdomain: `${subdomain}.samudai.eth`,
                // }).unwrap();
                toast(
                    'Success',
                    50000,
                    'Successfully Claimed',
                    'You will be receiving an airdrop soon.'
                )();
                setConfetti(true);
                onClose?.();
                if (!currContributorProgress.claim_nft)
                    updateContributorProgress({
                        memberId: getMemberId(),
                        itemId: [ActivityEnums.NewContributorItems.CLAIM_NFT],
                    }).then(() => {
                        dispatch(
                            changeContributorProgress({
                                contributorProgress: {
                                    ...currContributorProgress,
                                    claim_nft: true,
                                },
                            })
                        );
                    });
            } else {
                toast('Failure', 5000, 'Something went wrong', '')();
            }
        } catch (err: any) {
            //Address already claimed subdomain
            toast('Failure', 5000, 'Something went wrong', err?.reason || err?.message)();
        }
    };

    return (
        <Popup className={css.root} onClose={onClose}>
            <Confetti
                gravity={0.4}
                run={confetti}
                numberOfPieces={4000}
                {...{
                    width: 10000,
                    height: 10000,
                }}
            />
            <h2 className={css.title}>
                <span>🎉</span>
                <span>Claim NFT</span>
            </h2>

            <p className={css.text}>You now are eligible for this 1 of 1 exclusive Samudai NFT</p>

            <img src={'/img/onboarding/claim-nft.png'} alt="screen" className={css.screen_image} />

            <button
                className={css.button}
                onClick={() => {
                    handleClaim();
                }}
            >
                Claim NFT
            </button>

            <span className={css.screen_message}>
                We disperse NFTs weekly to all our users. We are working on it to make it faster
            </span>
        </Popup>
    );
};
