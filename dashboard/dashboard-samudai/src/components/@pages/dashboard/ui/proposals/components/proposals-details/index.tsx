import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { selectProvider } from 'store/features/common/slice';
import { useLazyGetDiscussionsByProposalQuery } from 'store/services/Discussion/discussion';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import CreateDiscussionPopUp from 'components/UserProfile/CreateDiscussionPopUp';
import Button from 'ui/@buttons/Button/Button';
import Progress from 'ui/Progress/Progress';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import LinkIcon from 'ui/SVG/LinkIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import WorldIcon from 'ui/SVG/WorldIcon';
import { numFormatter, walletFormatter } from 'utils/utils';
import styles from './proposals-details.module.scss';

interface ProposalsDetailsProps {
    createAvailable?: boolean;
    onClose?: () => void;
    data: any;
}

export const ProposalsDetails: React.FC<ProposalsDetailsProps> = ({
    createAvailable,
    onClose,
    data,
}) => {
    const providerEth = useTypedSelector(selectProvider);
    const navigate = useNavigate();
    const [getDiscussionId] = useLazyGetDiscussionsByProposalQuery();
    const [author, setAuthor] = useState(data?.author);
    console.log('proposalData', data);
    const getENS = async () => {
        const name = await providerEth!.lookupAddress(data.author);
        const address = await providerEth!.resolveName('alice.eth');
        if (address === data.author) setAuthor(name);
        console.log(name);
        console.log(address, data.author);
    };
    const createPopUp = usePopup();

    const goToDiscussion = async () => {
        const response = await getDiscussionId(data.id).unwrap();

        response?.data?.discussion_id
            ? navigate(`/${response?.data?.dao_id}/forum/${response?.data?.discussion_id}`)
            : createPopUp.open();
    };
    const handleClick = async (item: number) => {
        try {
            window.open(
                `https://snapshot.org/#/${data.space.id}/proposal/${data.id}`,
                '_blank' // <- This is what makes it open in a new window.
            );
            // const snap = new Snapshot(data.space.id || '');

            // const signer = providerEth!.getSigner();
            // const address = await signer.getAddress();

            // const result = await snap.castVote(
            //     data.id,
            //     item,
            //     address,
            //     providerEth!,
            //     'Voted on Samudai'
            // );

            // if (result) {
            //     toast('Success', 2000, 'Successfully Voted On the Proposal', '')();
            // }
        } catch (err: any) {
            // toast('Failure', 5000, err.message, '')();
            console.log(err);
        }
    };

    useEffect(() => {
        // getENS();
    }, []);

    return (
        <Popup
            className={styles.root}
            onClose={onClose}
            header={<h3 className={styles.title}>{data.title}</h3>}
            dataParentId={`proposal_details_expanded_${data.id}`}
        >
            {/* Head */}
            <div className={styles.head}>
                <p className={styles.headStatus} data-status={data.state.toLowerCase()}>
                    {data.state === 'pending'
                        ? 'Pending'
                        : data.state === 'closed'
                        ? 'Closed'
                        : data.state === 'active'
                        ? 'Active'
                        : data.state}
                </p>
                {createAvailable ? (
                    <button
                        className={styles.headBtn}
                        data-analytics-click="create_discussion_from_proposal"
                    >
                        <PlusIcon />
                        <span>Add Discussion</span>
                    </button>
                ) : (
                    <button
                        className={styles.headBtn}
                        data-discuss
                        onClick={goToDiscussion}
                        data-analytics-click="go_to_discussion_from_proposal"
                    >
                        <span>Discussions</span>
                        <ArrowLeftIcon />
                    </button>
                )}
            </div>
            {/* Info */}
            <ul className={styles.info}>
                <li className={styles.infoItem}>
                    <p className={styles.infoTtl}>
                        <CalendarIcon />
                        <span>Start Date</span>
                    </p>
                    <p className={styles.infoValue}>
                        {dayjs.unix(data.start).format('ddd, D MMM, YYYY')}
                    </p>
                </li>
                <li className={styles.infoItem}>
                    <p className={styles.infoTtl}>
                        <CalendarIcon />
                        <span>End Date</span>
                    </p>
                    <p className={styles.infoValue}>
                        {dayjs.unix(data.end).format('ddd, D MMM, YYYY')}
                    </p>
                </li>
                <li className={styles.infoItem}>
                    <p className={styles.infoTtl}>Voting Strategy</p>
                    <p className={styles.infoValue}>
                        {data.type === 'single-choice' ? 'Single Choice Voting' : `data.type`}
                    </p>
                </li>
                <li className={styles.infoItem}>
                    <p className={styles.infoTtl}>Author</p>
                    <p className={styles.infoValue}>
                        {/* TODO: Update Icon to Image */}
                        <div className={styles.infoUser}>
                            <img src="/img/icons/user-4.png" alt="img-cover" />
                        </div>
                        <span
                            data-analytics-click="go_to_etherscan_from_proposal"
                            className={styles.infoLink}
                            onClick={() =>
                                window.open(`https://etherscan.io/address/${data.author}`, '_blank')
                            } //TODO: href to samudai profile
                        >
                            {data.author.slice(-4) === '.eth'
                                ? `${data.author}`
                                : `@${walletFormatter(data.author)}`}
                        </span>
                    </p>
                </li>
                <li className={styles.infoItem}>
                    <p className={styles.infoTtl}>
                        <WorldIcon data-world />
                    </p>
                    <a
                        target="_blank"
                        href={`https://snapshot.org/#/${data.space.id}/proposal/${data.id}`}
                        className={styles.infoLink}
                        rel="noreferrer"
                        data-analytics-click="go_to_proposal_snapshot"
                    >
                        {`https://snapshot.org/${data.space.id}/`}
                        <LinkIcon />
                    </a>
                </li>
            </ul>
            {/* Voting */}
            <ul className={styles.voting}>
                <li className={styles.votingItem + ' ' + styles.votingItemTitle}>
                    <div
                        className={styles.votingCol + ' ' + styles.votingColTtl}
                        data-title="Voting Choices"
                    ></div>
                    <div
                        className={styles.votingCol + ' ' + styles.votingColData}
                        data-title="Votes"
                    ></div>
                    <div
                        className={styles.votingCol + ' ' + styles.votingColData}
                        data-title=""
                    ></div>
                </li>
                {data.choices.map((item: string, id: number) => (
                    <li className={styles.votingItem} key={id}>
                        <div className={styles.votingCol + ' ' + styles.votingColTtl}>
                            <p className={styles.votingTitle}>{item}</p>
                        </div>
                        <div className={styles.votingCol + ' ' + styles.votingColData}>
                            <Progress
                                percent={(data.scores[id] / data.scores_total) * 100}
                                className={styles.votingProgress}
                                hideText
                            />
                            <p className={styles.votingInfo}>
                                <strong>{numFormatter(data.scores[id])}</strong> votes
                            </p>
                        </div>
                        <div className={styles.votingCol + ' ' + styles.votingColData}>
                            {data.state === 'active' ? (
                                <Button
                                    className={styles.voteBtn}
                                    onClick={() => {
                                        handleClick(id + 1);
                                    }}
                                    data-analytics-click="vote_on_proposal_button"
                                    style={{
                                        minWidth: '100px',
                                        padding: '6px',
                                        marginTop: '0px',
                                        position: 'relative',
                                        top: '-3px',
                                    }}
                                >
                                    <span>Vote</span>
                                </Button>
                            ) : (
                                ''
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <PopupBox active={createPopUp.active} onClose={createPopUp.close}>
                <CreateDiscussionPopUp onClose={createPopUp.close} data={data} />
            </PopupBox>
        </Popup>
    );
};
