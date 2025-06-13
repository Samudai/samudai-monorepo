import { useEffect, useState } from 'react';
import Select from 'react-select';
import { updateActivity } from '../../../utils/activity/updateActivity';
import Popup from '../components/Popup/Popup';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { ActivityEnums, Member } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import { useCreateDiscussionMutation } from 'store/services/Discussion/discussion';
import { projectSearch } from 'store/services/Search/Model';
import { useLazyProjectSearchQuery, useLazySearchMemberQuery } from 'store/services/Search/Search';
import store from 'store/store';
import useDebounce from 'hooks/useDebounce';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import { selectRoleStyles } from 'components/@pages/settings/utils/select-role.styles';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import TextArea from 'ui/@form/TextArea/TextArea';
import Highlighter from 'ui/Highlighter/Highlighter';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import { toast } from 'utils/toast';
import { DiscussionType } from 'utils/types/Discussions';
import { IUser } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import styles1 from 'pages/discovery/discovery.module.scss';
import styles from './styles/DiscussionsCreate.module.scss';

interface IMember {
    member_id: string;
    username: string;
    profile_picture?: string | null;
}

interface DiscussionsCreateProps {
    onClose: () => void;
    fetchDiscussions: () => void;
}

const DiscussionsCreate: React.FC<DiscussionsCreateProps> = ({ onClose, fetchDiscussions }) => {
    const [createDiscussion] = useCreateDiscussionMutation();
    const [search, setSearch] = useState('');
    const [searchMember] = useLazySearchMemberQuery();
    const [asigneeUsers, setAsigneeUsers] = useState<string[]>([]);
    const activeDao = useTypedSelector(selectActiveDao);
    const localData = localStorage.getItem('signUp');
    const member_id =
        JSON.parse(localData!) && JSON.parse(localStorage.getItem('signUp')!).member_id;
    const [topic, setTopic] = useInput('');
    const [description, setDescription] = useInput<HTMLTextAreaElement>('');
    const [showParticipants, setShowParticipants] = useState(false);
    const [participants, setParticipants] = useState<IUser[]>([]);
    const [associated, setAssociated] = useState<DiscussionType>(DiscussionType.Project);
    const [memberData, setMemberData] = useState<any[]>([]);
    const [searchProject, setSearchProject] = useState<string>('');
    const [searchResult, setSearchResult] = useState<projectSearch[]>([] as projectSearch[]);
    const [selected, setSelected] = useState<projectSearch>({} as projectSearch);
    const [searchProjectAPI] = useLazyProjectSearchQuery();

    const handleSearch = (value: string) => {
        setSearch(value);
    };
    const handleSearchProject = (value: string) => {
        setSearchProject(value);
    };

    const fun1 = async () => {
        if (searchProject.trim().length < 2) return;
        if (searchProject.length > 0) {
            const searchVal = searchProject.trim() + '?daoId=' + activeDao;
            try {
                const res = await searchProjectAPI(searchVal).unwrap();
                setSearchResult(res.data || ([] as projectSearch[]));
            } catch (e) {
                console.log(e);
            }
        }
    };

    const fun2 = async () => {
        if (search.length > 1 && search.length < 3) return;
        try {
            const res2 = await searchMember(search ? `${search}` : '').unwrap();
            setMemberData(res2?.data || ([] as Member[]));
        } catch (err) {
            console.log(err);
        }
    };
    const funMember = useDebounce(fun2, 500);
    const funProject = useDebounce(fun1, 500);

    const handleChange = (e: any) => {
        setAsigneeUsers(Array.isArray(e) ? e.map((x) => x.member_id) : []);
    };

    const handleProject = (e: any) => {
        setSelected(e);
    };

    useEffect(() => {
        funMember(undefined);
    }, [search]);

    useEffect(() => {
        funProject(undefined);
    }, [searchProject]);

    const handleToggleParticipants = (user: IUser) => {
        if (participants.some((p) => p.id === user.id)) {
            setParticipants(participants.filter((p) => p.id !== user.id));
        } else {
            setParticipants([...participants, user]);
        }
    };

    const handleSubmit = () => {
        if (!topic) {
            toast('Failure', 5000, 'Topic Field cannot be empty', '')();
            return;
        }
        if (topic.trim().length > 150) {
            toast('Failure', 5000, 'Topic Field cannot be more than 150 characters', '')();
            return;
        }
        if (!description) {
            toast('Failure', 5000, 'Description Field cannot be empty', '')();
            return;
        }
        if (description.trim().length > 200) {
            toast('Failure', 5000, 'Description Field cannot be more than 500 characters', '')();
            return;
        }
        if (associated === DiscussionType.Project) {
            if (!selected.project_id) {
                return toast(
                    'Failure',
                    5000,
                    'Select a project to link with this discussion',
                    ''
                )();
            }
        }
        try {
            createDiscussion({
                discussion: {
                    dao_id: activeDao,
                    topic,
                    description,
                    created_by: member_id,
                    category: associated,
                    category_id: selected ? selected?.project_id : undefined,
                    closed: false,
                    visibility: 'public',
                },
                participants: asigneeUsers,
            })
                .unwrap()
                .then((res) => {
                    mixpanel.track('create_discussion', {
                        discussion_id: res.data.discussion_id,
                        dao_id: activeDao,
                        topic: topic,
                        created_by: member_id,
                        category: associated,
                        closedStatus: false,
                        origin: 'discussion',
                        timestamp: new Date().toUTCString(),
                    });
                    fetchDiscussions();
                    updateActivity({
                        dao_id: activeDao,
                        member_id: getMemberId(),
                        project_id: '',
                        task_id: '',
                        discussion_id: res.data.discussion_id,
                        job_id: '',
                        payment_id: '',
                        bounty_id: '',
                        action_type: ActivityEnums.ActionType.DISCUSSION_ADDED,
                        visibility: ActivityEnums.Visibility.PUBLIC,
                        member: {
                            username: store.getState().commonReducer?.member?.data.username || '',
                            profile_picture:
                                store.getState().commonReducer?.member?.data.profile_picture || '',
                        },
                        dao: {
                            dao_name: store.getState().commonReducer?.activeDaoName || '',
                            profile_picture: store.getState().commonReducer?.profilePicture || '',
                        },
                        project: {
                            project_name: '',
                        },
                        task: {
                            task_name: '',
                        },
                        action: {
                            message: '',
                        },
                        metadata: {
                            title: topic,
                            id: res.data.discussion_id,
                        },
                    });
                    onClose();
                })
                .catch((err) => {
                    console.error(err);
                });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Popup className={styles.root} onClose={onClose}>
            <PopupTitle
                icon="/img/icons/write.png"
                title={
                    <>
                        Сreate <strong>New</strong> Discussions
                    </>
                }
            />
            <Input
                placeholder="Topic"
                title="Topic"
                className={styles.topic}
                value={topic}
                onChange={setTopic}
            />
            <PopupSubtitle className={styles.subtitle} text="Description" />
            <TextArea
                placeholder="Description"
                value={description}
                onChange={setDescription}
                className={styles.description}
            />
            <PopupSubtitle text="Participants" />
            <div style={{ marginTop: '20px' }}>
                <Select
                    classNamePrefix="rs"
                    inputValue={search}
                    isSearchable
                    isClearable
                    isMulti
                    onChange={handleChange}
                    onInputChange={handleSearch}
                    options={memberData.map((item) => ({
                        ...item,
                        value: item.member_id,
                        label: item.username,
                    }))}
                    placeholder="Type to search"
                    styles={selectRoleStyles}
                    formatOptionLabel={(user: IMember) => (
                        <div className={styles1.content}>
                            <p
                                className={styles1.contentName}
                                data-select-name
                                style={{ color: 'white' }}
                            >
                                <Highlighter search={search} text={user.username} />
                            </p>
                        </div>
                    )}
                />
            </div>
            {/* <div className={styles.row}>
        <PopupSubtitle text="Participants" />
        <Button
          color="orange"
          className={styles.addBtn}
          onClick={setShowParticipants.bind(null, !showParticipants)}
        >
          <PlusIcon />
          <span>Add</span>
        </Button>
      </div>
      {showParticipants && (
         <div className={styles.participants}>
           <Members className={styles.members} users={asigneeUsers} /> 
          <Input
            title="Seacrh Contributors"
            value={search}
            onChange={setSearch}
            placeholder="Search Contributors"
          />
          // {/* <ParticipantsAdd
          //   participants={participants}
          //   toggleParticipants={handleToggleParticipants}
          // /> 
        </div>
      )} */}
            <PopupSubtitle className={styles.subtitle} text="Associated with" />
            <ul className={styles.type}>
                {Object.values(DiscussionType).map((type) => (
                    <li
                        className={clsx(
                            styles.typeItem,
                            type === associated && styles.typeItemActive
                        )}
                        onClick={() => setAssociated(type)}
                        key={type}
                    >
                        <Radio checked={type === associated} className={styles.typeRadio} />
                        <p className={styles.typeName}>{type}</p>
                    </li>
                ))}
            </ul>

            {associated === DiscussionType.Project && (
                <>
                    <PopupSubtitle text="Project" />
                    <div style={{ marginTop: '20px' }}>
                        <Select
                            classNamePrefix="rs"
                            inputValue={searchProject}
                            isSearchable
                            isClearable
                            isMulti={false}
                            onChange={handleProject}
                            onInputChange={handleSearchProject}
                            options={searchResult.map((item) => ({
                                ...item,
                                value: item.project_id,
                                label: item.title,
                            }))}
                            placeholder="Type to search"
                            styles={selectRoleStyles}
                            formatOptionLabel={(proj: projectSearch) => (
                                <div className={styles1.content}>
                                    <p
                                        className={styles1.contentName}
                                        data-select-name
                                        style={{ color: 'white' }}
                                    >
                                        <Highlighter search={''} text={proj.title} />
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                </>
            )}
            <Button color="green" className={styles.submit} onClick={handleSubmit}>
                <span>Post</span>
            </Button>
        </Popup>
    );
};

export default DiscussionsCreate;
