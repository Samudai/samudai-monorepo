import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateDiscussionMutation } from 'store/services/Discussion/discussion';
import { projectSearch } from 'store/services/Search/Model';
import { useLazyProjectSearchQuery } from 'store/services/Search/Search';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import { cutText } from 'utils/format';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
    data: any;
}
const CreateDiscussion: React.FC<IProps> = ({ onClose, data }) => {
    const [load, setLoad] = useState<boolean>(false);
    const [CreateDiscussion] = useCreateDiscussionMutation();
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<projectSearch[]>([] as projectSearch[]);
    const [selected, setSelected] = useState<projectSearch>({} as projectSearch);
    const [searchProject] = useLazyProjectSearchQuery();
    const navigate = useNavigate();
    const { daoid } = useParams();

    const handleCreateDiscussion = async () => {
        setLoad(true);
        await CreateDiscussion({
            discussion: {
                dao_id: daoid!,
                topic: data?.title,
                description: cutText(data?.body, 200),
                created_by: getMemberId(),
                category: 'proposal',
                category_id: undefined,
                closed: false,
                proposal_id: data?.id,
                visibility: 'public',
            },
            participants: [],
        })
            .unwrap()
            .then((res) => {
                setLoad(false);
                mixpanel.track('create_discussion', {
                    discussion_id: res.data.discussion_id,
                    dao_id: daoid,
                    topic: data?.title,
                    created_by: getMemberId(),
                    category: 'proposal',
                    id: data?.id,
                    origin: 'dashboard',
                    closedStatus: false,
                    timestamp: new Date().toUTCString(),
                });
                toast('Success', 5000, 'Discussion created successfully', '')();
                setTimeout(() => {
                    res?.data && navigate(`/${daoid}/forum/${res?.data?.discussion_id}`);
                }, 2000);
            })
            .catch(() => {
                setLoad(false);
                toast('Failure', 5000, 'Creating discussion failed', '')();
            });
    };

    return (
        <>
            {
                <Popup
                    className="add-payments add-payments_complete"
                    dataParentId="create_discussion_from_proposal_modal"
                >
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={'Create a discussion'}
                    />
                    {/* <div className="add-payments__mark">
            <MarkIcon />
          </div> */}
                    <div style={{ display: 'flex' }}></div>

                    <span style={{ color: 'white', marginTop: '20px' }}>
                        This proposal has no linked discussion, do you want to create a new one?
                    </span>

                    <div style={{ marginTop: '50px', minWidth: '30px' }}>
                        <Button
                            // className={clsx(styles.add - payments__complete - btn, styles.marginTop)}
                            color="orange"
                            style={{ width: '100px' }}
                            onClick={handleCreateDiscussion}
                            disabled={load}
                            data-analytics-click="create_proposal_discussion_button"
                        >
                            <span>Create</span>
                        </Button>
                    </div>
                </Popup>
            }
            {load && <Loader />}
        </>
    );
};

export default CreateDiscussion;
