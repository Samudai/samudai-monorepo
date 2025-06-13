import { useEffect, useState } from 'react';
import Select from 'react-select';
import {
    CreateJobData,
    IJobTask,
    IQuestion,
    getDefaultCreateData,
} from '../utils/getDefaultCreateData';
import { contactsSelectStyles, departmentSelectStyles } from '../utils/job-select.styles';
import JobSubmitted from './job-submitted';
import { JobsEnums } from '@samudai_xyz/gateway-consumer-types';
// import { IMember } from '@samudai_xyz/gateway-consumer-types/dist/types/notifications/types';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
// import { members } from 'root/members';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';
import { createBountyRequest, createOpportunityRequest } from 'store/services/jobs/model';
import {
    useCreateBountyMutation,
    useCreateOpportunityMutation,
} from 'store/services/jobs/totalJobs';
import { useLazyGetDepartmentsQuery } from 'store/services/Settings/settings';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import TextArea from 'ui/@form/TextArea/TextArea';
import DatePicker from 'ui/@form/date-picker/date-picker';
import Highlighter from 'ui/Highlighter/Highlighter';
import InformationIcon from 'ui/SVG/InformationIcon';
import Magnifier from 'ui/SVG/Magnifier';
import PlusIcon from 'ui/SVG/PlusIcon';
import { Github2 } from 'ui/SVG/socials';
import TabNavigation from 'ui/TabNavigation/TabNavigation';
import { uploadFile } from 'utils/fileupload/fileupload';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import { JobType as JT, JobStatus } from 'utils/types/Jobs';
import { ISkill } from 'utils/types/User';
import { toggleArrayItem } from 'utils/use';
import { getMemberId } from 'utils/utils';
import JobAttachment from '../JobAttachment';
import JobQuestion from '../JobQuestion';
import JobSkills from '../JobSkills';
import JobTags, { TagType } from '../JobTags';
import JobTask from '../JobTask';
import styles from '../styles/JobCreate.module.scss';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

interface JobCreateProps {
    onClose: () => void;
}

interface dep {
    id: string;
    name: string;
}

const JobCreate: React.FC<JobCreateProps> = ({ onClose }) => {
    const [currentTab, setCurrentTab] = useState(JT.PROJECT);
    const [formData, setFormData] = useState(getDefaultCreateData());
    const [contactsInput, setContactsInput] = useState('');
    const [poc, setPoc] = useState<IMember>({} as IMember);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [skills, setSkills] = useState<ISkill[]>([]);
    const [pressed, setPressed] = useState<boolean>(false);

    const [tags, setTags] = useState<TagType[]>([]);
    const submittedModal = usePopup();
    const daoid = useTypedSelector(selectActiveDao);
    const [createJob] = useCreateOpportunityMutation();
    const [createBounty] = useCreateBountyMutation();
    const [searchDaoMember] = useLazySearchMemberByDaoQuery();
    const [members, setMembers] = useState<IMember[]>([] as IMember[]);
    const [departmentList, setDepartmentList] = useState<dep[]>([] as dep[]);
    const [departmentByDao] = useLazyGetDepartmentsQuery();

    const handleSetField = function <T extends keyof typeof formData>(
        key: T,
        value: (typeof formData)[T]
    ) {
        setFormData({ ...formData, [key]: value });
    };

    const handleCreateTask = () => {
        handleSetField('tasks', [
            ...formData.tasks,
            {
                id: uuidv4(),
                description: '',
                skills: [],
                title: '',
            },
        ]);
    };

    const handleTaskChange = (data: IJobTask) => {
        handleSetField(
            'tasks',
            formData.tasks.map((task) => (task.id === data.id ? data : task))
        );
    };

    const handleQuestionCreate = () => {
        handleSetField('questions', [
            ...formData.questions,
            {
                id: uuidv4(),
                question: '',
            },
        ]);
    };

    const handleQuestionChange = (data: IQuestion) => {
        handleSetField(
            'questions',
            formData.questions.map((question) => (question.id === data.id ? data : question))
        );
    };

    const createPayload = async (data: CreateJobData) => {
        if (currentTab !== JT.BOUNTY) {
            const payload: createOpportunityRequest = {
                opportunity: {
                    job_id: '',
                    dao_id: daoid,
                    type:
                        currentTab === JT.PROJECT
                            ? JobsEnums.JobType.PROJECT
                            : JobsEnums.JobType.TASK,
                    title: data.title,
                    description: data.description,
                    description_raw: '',
                    created_by: getMemberId(),
                    visibility: JobsEnums.Visibility.PUBLIC,
                    status: JobStatus.OPEN,
                    req_people_count: data.minPeople,
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate.toISOString(),
                    poc_member_id: poc.member_id ? poc.member_id : undefined,
                    department: data.department.id ? data.department.id : undefined,
                    github: data.github,
                    questions: data.questions.map((q) => q.question),
                    captain: data.captain,
                    skills: skills.map((s) => s.name),
                    tags: tags.map((t) => t.name),
                    experience: 0,
                    open_to: data.openTo,
                    job_format: JobsEnums.JobFormat.FREELANCE,
                    payout: [],
                },
            };
            console.log(payload, attachments);
            await createJob(payload)
                .unwrap()
                .then(async (res) => {
                    console.log(res);
                    if (attachments.length > 0) {
                        attachments.forEach(async (file) => {
                            await uploadFile(
                                file,
                                FileUploadType.JOB,
                                StorageType.SPACES,
                                res.data.job_id
                            );
                        });
                    }
                    setPressed(false);
                    submittedModal.open();
                })
                .catch((err) => {
                    console.log(err);
                    setPressed(false);
                    toast(
                        'Failure',
                        5000,
                        'Error',
                        'Something went wrong. Please try again later'
                    )();
                });
        } else if (currentTab === JT.BOUNTY) {
            const payload: createBountyRequest = {
                bounty: {
                    bounty_id: '',
                    dao_id: daoid,
                    task_id: '',
                    title: data.title,
                    description: data.description,
                    created_by: getMemberId(),
                    visibility: JobsEnums.Visibility.PUBLIC,
                    status: JobStatus.OPEN,
                    winner_count: data.winners,
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate.toISOString(),
                    poc_member_id: poc.member_id ? poc.member_id : undefined,
                    department: data.department ? data.department.id : undefined,
                    skills: skills.map((s) => s.name),
                    tags: tags.map((t) => t.name),
                    payout: [],
                },
            };
            await createBounty(payload)
                .unwrap()
                .then(async (res) => {
                    console.log(res);
                    if (attachments.length > 0) {
                        attachments.forEach(async (file) => {
                            await uploadFile(
                                file,
                                FileUploadType.BOUNTY,
                                StorageType.SPACES,
                                res.data.bounty_id
                            );
                        });
                    }
                    setPressed(false);
                    submittedModal.open();
                })
                .catch((err) => {
                    console.log(err);
                    setPressed(false);
                    toast(
                        'Failure',
                        5000,
                        'Error',
                        'Something went wrong. Please try again later'
                    )();
                });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPressed(true);
        console.log(formData);
        createPayload(formData);
    };

    const handleSubmittedEnd = () => {
        submittedModal.close();
        onClose();
    };

    useEffect(() => {
        try {
            const func = async () => {
                const res = await searchDaoMember({
                    daoId: daoid,
                    value: contactsInput,
                }).unwrap();
                const memberList: IMember[] = res?.data
                    ? res?.data?.map((member) => {
                          return {
                              member_id: member.member_id,
                              name: member.name,
                              profile_picture: member.profile_picture || '',
                              username: member.username,
                          };
                      })
                    : ([] as IMember[]);
                setMembers(memberList);
            };
            func();
        } catch (err) {
            console.log(err);
        }
    }, [contactsInput]);

    useEffect(() => {
        const func = async () => {
            try {
                const res = await departmentByDao(daoid, true);
                const dep = res?.data?.data?.map((val) => {
                    return { id: val.department_id, name: val.name };
                });
                setDepartmentList(dep || ([] as dep[]));
            } catch (err) {
                console.log(err);
            }
        };
        func();
    }, [daoid]);

    return (
        <Popup className={styles.root}>
            <header className={styles.head}>
                <h2 className={styles.titleMain} data-title>
                    What do you want to publish?
                </h2>
            </header>
            <TabNavigation className={styles.tabs}>
                {Object.values(JT).map((type) => (
                    <TabNavigation.Button
                        className={styles.tabsItem}
                        active={type === currentTab}
                        onClick={setCurrentTab.bind(null, type)}
                        key={type}
                    >
                        {type}
                    </TabNavigation.Button>
                ))}
            </TabNavigation>
            <form
                className={styles.form}
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                    e.key === 'Enter' && e.preventDefault();
                }}
            >
                {/* Title */}
                <div className={styles.item}>
                    <h3 className={styles.title}>
                        Title of <span>{currentTab}</span>
                    </h3>
                    <Input
                        className={styles.input}
                        value={formData.title}
                        onChange={(e) => handleSetField('title', e.target.value)}
                    />
                </div>
                {/* Description */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Description</h3>
                    <TextArea
                        title="Description"
                        className={styles.descriptionArea}
                        value={formData.description}
                        onChange={(e) => handleSetField('description', e.target.value)}
                    />
                </div>
                {/* Department */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Department</h3>
                    <Select
                        value={formData.department}
                        classNamePrefix="rs"
                        styles={departmentSelectStyles}
                        options={departmentList.map((d) => ({
                            value: d.id,
                            name: d.name,
                            id: d.id,
                        }))}
                        onChange={(e) => handleSetField('department', e)}
                        formatOptionLabel={(data) => (
                            <div className={styles.select_department_value}>{data.name}</div>
                        )}
                    />
                </div>
                {/* Captain */}
                {currentTab === JT.PROJECT && (
                    <div className={styles.item}>
                        <h3 className={styles.title}>
                            Do you need Captain? <InformationIcon data-icon-info />
                        </h3>
                        <ul className={styles.captain}>
                            {[true, false].map((value, id) => (
                                <li
                                    className={styles.captainItem}
                                    data-active={formData.captain === value}
                                    onClick={handleSetField.bind(null, 'captain', value)}
                                    key={value ? 'Yes' : 'No'}
                                >
                                    <Radio
                                        checked={value === formData.captain}
                                        className={styles.captainItemRadio}
                                    />
                                    <p className={styles.captainItemValue}>
                                        {value ? 'Yes' : 'No'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* Contacts */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Point of Contact</h3>
                    <div className={styles.contacts}>
                        <Magnifier className={styles.contacts_icon} />
                        <Select
                            className={styles.contacts_select}
                            classNamePrefix="rs"
                            styles={contactsSelectStyles}
                            options={members.map((m) => ({ ...m, value: m.username }))}
                            onChange={(e) => setPoc(e)}
                            inputValue={contactsInput}
                            onInputChange={setContactsInput}
                            formatOptionLabel={(data) => (
                                <div className={styles.contacts_u}>
                                    <div className={styles.contacts_u_photo}>
                                        <img
                                            src={data.profile_picture || '/img/icons/user-4.png'}
                                            className="img-cover"
                                            alt="user avatar"
                                        />
                                    </div>
                                    <p className={styles.contacts_u_name}>
                                        <Highlighter search={poc.username} text={data.username} />
                                    </p>
                                </div>
                            )}
                        />
                    </div>
                </div>
                {/* Payout */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Payout</h3>
                    <div className={styles.payout}>
                        <Input
                            className={styles.payout_input}
                            value={formData.payoutAmount}
                            onChange={(e) => handleSetField('payoutAmount', +e.target.value || 0)}
                        />
                        <Select
                            className={styles.payout_select}
                            value={{ value: formData.payoutCurrency }}
                            classNamePrefix="rs"
                            styles={{
                                ...departmentSelectStyles,
                                menu: (base, state) => ({
                                    ...departmentSelectStyles.menu?.(base, state),
                                    padding: 0,
                                    borderRadius: 15,
                                }),
                            }}
                            isMulti={false}
                            onChange={(cur) =>
                                handleSetField('payoutCurrency', cur?.value || 'USDT')
                            }
                            options={['USDT', 'BTC', 'ETH', 'BUSD'].map((d) => ({ value: d }))}
                            formatOptionLabel={(data) => (
                                <div className={styles.select_department_value}>{data.value}</div>
                            )}
                        />
                    </div>
                </div>
                {/* Min People */}
                {currentTab !== JT.BOUNTY && (
                    <div className={styles.item}>
                        <h3 className={styles.title}>Minimum (Of people required)</h3>
                        <Input
                            value={formData.minPeople}
                            className={clsx(styles.input, styles.peopleInput)}
                            onChange={(e) => handleSetField('minPeople', +e.target.value || 0)}
                        />
                    </div>
                )}
                {currentTab === JT.BOUNTY && (
                    <div className={styles.item}>
                        <h3 className={styles.title}>Number of winners</h3>
                        <Input
                            value={formData.winners}
                            className={clsx(styles.input, styles.peopleInput)}
                            onChange={(e) => handleSetField('winners', +e.target.value || 0)}
                        />
                    </div>
                )}
                {/* Deadlines */}
                <div className={styles.item}>
                    <ul className={styles.deadlines}>
                        <li className={styles.deadlinesCol}>
                            <h3 className={styles.title}>Start Date</h3>
                            <DatePicker
                                className={styles.deadlinesDatePicker}
                                value={formData.startDate}
                                onChange={(date) => date && handleSetField('startDate', date)}
                            />
                        </li>
                        <li className={styles.deadlinesCol}>
                            <h3 className={styles.title}>End Date</h3>
                            <DatePicker
                                className={styles.deadlinesDatePicker}
                                value={formData.endDate}
                                onChange={(date) => date && handleSetField('endDate', date)}
                            />
                        </li>
                    </ul>
                </div>
                {/* Github */}
                {currentTab !== JT.BOUNTY && (
                    <div className={styles.item}>
                        <Input
                            placeholder="Link"
                            className={styles.githubInput}
                            value={formData.github}
                            onChange={(e) => handleSetField('github', e.target.value)}
                            icon={
                                <div className={styles.githubIcon}>
                                    <Github2 />
                                </div>
                            }
                        />
                    </div>
                )}
                {/* Attachments */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Attachments</h3>
                    <JobAttachment files={attachments} onChange={setAttachments} />
                </div>
                {/* Add Task */}
                {currentTab === JT.PROJECT && (
                    <div className={styles.item}>
                        <div className={styles.addTask}>
                            <h3 className={styles.title}>Add a task to your project</h3>
                            <button
                                className={styles.addTaskBtn}
                                onClick={handleCreateTask}
                                type="button"
                            >
                                <div className={styles.addTaskBtnIcon}>
                                    <PlusIcon />
                                </div>
                                <span className={styles.addTaskBtnText}>Add Task</span>
                            </button>
                        </div>
                        {formData.tasks.length > 0 && (
                            <div className={styles.task_list}>
                                {formData.tasks.map((task) => (
                                    <JobTask
                                        data={task}
                                        onChange={handleTaskChange}
                                        key={task.id}
                                        onRemove={() =>
                                            handleSetField(
                                                'tasks',
                                                formData.tasks.filter(
                                                    (fTask) => fTask.id !== task.id
                                                )
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* Add Question */}
                {currentTab === JT.PROJECT && (
                    <div className={styles.item}>
                        <div className={styles.addTask}>
                            <h3 className={styles.title}>Add questions for Applicants</h3>
                            <button
                                className={styles.addTaskBtn}
                                onClick={handleQuestionCreate}
                                type="button"
                            >
                                <div className={styles.addTaskBtnIcon}>
                                    <PlusIcon />
                                </div>
                                <span className={styles.addTaskBtnText}>Add Question</span>
                            </button>
                        </div>
                        {formData.questions.length > 0 && (
                            <div className={styles.task_list}>
                                {formData.questions.map((question, idx) => (
                                    <JobQuestion
                                        data={question}
                                        onChange={handleQuestionChange}
                                        index={idx + 1}
                                        onRemove={() => {
                                            handleSetField(
                                                'questions',
                                                formData.questions.filter(
                                                    (fQuestion) => fQuestion.id !== question.id
                                                )
                                            );
                                        }}
                                        key={question.id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {/* Associated */}
                {currentTab === JT.TASK && (
                    <div className={styles.item}>
                        <h3 className={styles.title}>Associated Project</h3>
                    </div>
                )}
                {/* Open To */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Open to:</h3>
                    <ul className={styles.openToList}>
                        {Object.values(JobsEnums.OpportunityOpenTo).map((role) => (
                            <li
                                className={styles.openToItem}
                                onClick={() =>
                                    handleSetField('openTo', toggleArrayItem(formData.openTo, role))
                                }
                                key={role}
                            >
                                <Checkbox
                                    active={formData.openTo.includes(role)}
                                    className={styles.openToCheckbox}
                                />
                                <p className={styles.openToName}>{role}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                {/* Skills */}
                <div className={styles.item}>
                    <h3 className={styles.title}>Skills</h3>
                    <JobSkills className={styles.skills} data={skills} onChange={setSkills} />
                </div>
                {/* Tags */}
                <div className={styles.item}>
                    <h3 className={styles.title}>
                        Tags<span color="green">(Comma Separated)</span>
                    </h3>
                    <JobTags className={styles.tags} data={tags} onChange={setTags} />
                </div>
                {/* Footer */}
                <footer className={styles.foot}>
                    <Button className={styles.footCancelBtn} color="black">
                        <span>Cancel</span>
                    </Button>
                    <Button
                        className={styles.footSaveBtn}
                        disabled={pressed}
                        color="orange"
                        type="submit"
                    >
                        <span>Save</span>
                    </Button>
                </footer>
            </form>
            <PopupBox active={submittedModal.active} onClose={handleSubmittedEnd}>
                <JobSubmitted onClose={handleSubmittedEnd} isOpenToCaptain={formData.captain} />
            </PopupBox>
        </Popup>
    );
};

export default JobCreate;
