import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import Popup from '../components/Popup/Popup';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import AddPeople from '../components/elements/AddPeopleDao';
import {
    ActivityEnums,
    Auth,
    ProjectResponse,
    Provider,
    TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import { Gnosis, GnosisFetch, GnosisTypes } from '@samudai_xyz/web3-sdk';
import dayjs, { Dayjs } from 'dayjs';
import { ethers } from 'ethers';
import { selectStyles } from 'root/constants/selectStyles1';
import { selectActiveDao, selectProvider } from 'store/features/common/slice';
import { useGetParcelBalanceMutation, useGetProviderQuery } from 'store/services/payments/payments';
import { useCreateTaskMutation, useGetPRsMutation } from 'store/services/projects/totalProjects';
import store from 'store/store';
import useInput from 'hooks/useInput';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import DatePicker from 'ui/@form/date-picker/date-picker';
import * as Socials from 'ui/SVG/socials';
import { updateActivity } from 'utils/activity/updateActivity';
import { parcelSign } from 'utils/parcelUtils';
import { toast } from 'utils/toast';
import { IPaymentCurrency } from 'utils/types/Payments';
import { getMemberId } from 'utils/utils';
import Bounty from './Bounty';
import styles from './TaskAdd.module.scss';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

const githubMock = [
    {
        value: 'branch-1',
        label: 'branch-1',
    },
    {
        value: 'branch-2',
        label: 'branch-2',
    },
    {
        value: 'branch-3',
        label: 'branch-3',
    },
];

type dynamicColumnType = {
    id: number;
    name: string;
    items: TaskResponse[];
};

interface TaskAddProps {
    close: () => void;
    columns: dynamicColumnType[];
    personal?: boolean;
    projectId?: string;
    repos: string[];
    selectedColumn?: dynamicColumnType;
    project?: ProjectResponse;
}

interface gitHubDropDown {
    label: '';
    value: '';
}

// interface IMember {
//   member_id: string;
//   profile_picture: string | null;
//   username: string;
//   name: string;
// }

const TaskAdd: React.FC<TaskAddProps> = ({
    close,
    columns,
    personal,
    projectId,
    repos,
    selectedColumn,
    project,
}) => {
    const { id } = useParams();
    const [createTask] = useCreateTaskMutation();
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);
    const providerEth = useTypedSelector(selectProvider);
    const { data: providerData, isSuccess } = useGetProviderQuery(daoid!);
    const [getParcelBalance] = useGetParcelBalanceMutation();
    const [name, setName] = useInput('');
    const [deadline, setDeadline] = useState<Dayjs | null>(null);
    const [contributors, setContributors] = useState<IMember[]>([]);
    const [description, setDescription] = useInput<HTMLTextAreaElement>('');
    const [bounty, setBounty, _, clearBounty] = useInput('');
    const [walletAddress, setWalletAddress] = useState('');
    const [options, setOptions] = useState<Provider[]>([] as Provider[]);
    const [activeProvider, setActiveProvider] = useState<Provider>({} as Provider);
    const [balance, setBalance] = useState<string>('');
    const [tokenType, setTokenType] = useState<string>('');
    const [tokenAddress, setTokenAddress] = useState<string>('');
    const [getPrs] = useGetPRsMutation();
    const [currency, setCurrency] = useState<IPaymentCurrency>({} as IPaymentCurrency);
    const [prs, setPrs] = useState<any[]>([]);
    const [selectedPr, setSelectedPr] = useState<any>({});
    const [currencyList, setCurrencyList] = useState<IPaymentCurrency[]>([] as IPaymentCurrency[]);
    const [sdkVale, setSdkValue] = useState<Gnosis | null>(null);

    const [providerList, setProviderList] = useState<
        {
            id: string;
            provider: Provider;
            receiver_address: string;
            payout_amount: number;
            payout_currency: string;
            safe_address: string;
            token_address: string;
            user: IMember;
        }[]
    >([]);
    console.log(selectedColumn);
    const [col, setCol] = useState(selectedColumn || columns[0]);
    const handleAddUser = (user: IMember) => {
        console.log(user);
        setContributors([...contributors, user]);
    };

    const onClickProvider = (provider: Provider) => {
        setActiveProvider(provider);
    };
    // const handleAddProvider = () => {
    //   if (!activeProvider.name) return;
    //   // if (Number(bounty) > Number(balance)) {
    //   //   toast('Failure', 5000, 'Insufficient Balance', 'Bounty amount is more than the safe balance')()
    //   //   return;}
    //   setProviderList([
    //     ...providerList,
    //     {
    //       provider: activeProvider,
    //       value: bounty,
    //       symbol: currency?.symbol || '',
    //       name: currency?.currency || '',
    //       token: tokenType,
    //       tokenAddress: currency.token_address,
    //     },
    //   ]);
    //   console.log(activeProvider);
    //   clearBounty();
    //   setBalance('');
    //   setTokenType('');
    //   setTokenAddress('');
    // };

    useEffect(() => {
        const fun = async () => {
            try {
                console.log(repos);
                const res = await getPrs({
                    dao_id: daoid!,
                    github_repos: repos ? repos : [],
                }).unwrap();
                setPrs(res?.data?.pull_requests || []);
            } catch (err) {
                console.log(err);
            }
        };
        fun();
    }, []);

    useEffect(() => {
        if (activeProvider.provider_type !== 'wallet') {
            const gnosis = new GnosisFetch(activeProvider.address!, activeProvider.chain_id!);
            gnosis.getSafeBalance().then((res) => {
                const balance = res as GnosisTypes.SafeBalanceUsdResponse[];
                setBalance(
                    ethers.utils
                        .formatEther(balance?.[0]?.balance)
                        .toString()
                        .slice(0, 6)
                );
                setTokenType(balance?.[0]?.token?.symbol || 'ETH');
                setTokenAddress(balance?.[0]?.tokenAddress);
            });
        } else {
            setBalance('');
            setTokenType('');
            setTokenAddress('');
        }
    }, [activeProvider.id, daoid]);

    useEffect(() => {
        const getCurrency = async () => {
            const provider = activeProvider;

            setCurrency({} as IPaymentCurrency);
            setCurrencyList([] as IPaymentCurrency[]);
            let value;
            const currencyVal: IPaymentCurrency[] = [];
            if (provider.provider_type === 'gnosis') {
                if (!!providerEth && !!provider.chain_id) {
                    value = new Gnosis(providerEth, provider.chain_id);
                    const res = (await value.getSafeBalance(
                        provider.address!
                    )) as GnosisTypes.SafeBalanceUsdResponse[];
                    console.log('here:', res);
                    if (res.length > 0) {
                        res.forEach((item: GnosisTypes.SafeBalanceUsdResponse, id: number) => {
                            currencyVal.push({
                                currency: item.token ? item.token.name : 'ETH',
                                symbol: item.token ? item.token.symbol : 'ETH',
                                balance: item.balance,
                                token_address: item.tokenAddress,
                                name: item.token ? item.token.name : 'ETH',
                                decimal: item.token ? item.token.decimals : 0,
                                logo_uri: item.token ? item.token.logoUri : '',
                            });
                        });
                        setCurrency(currencyVal[0]);
                        setCurrencyList(currencyVal);
                    }
                }
            } else if (provider.provider_type === 'parcel') {
                if (provider.chain_id) {
                    setCurrency({} as IPaymentCurrency);
                    setCurrencyList([] as IPaymentCurrency[]);
                    const auth: Auth = await parcelSign(providerEth!);
                    const payload = {
                        auth,
                        chainId: provider.chain_id,
                        safeAddress: provider.address,
                    };
                    getParcelBalance(payload)
                        .unwrap()
                        .then((res) => {
                            if (
                                (res?.data?.balances as GnosisTypes.SafeBalanceUsdResponse[])
                                    .length > 0
                            ) {
                                res.data?.balances.forEach(
                                    (item: GnosisTypes.SafeBalanceUsdResponse) => {
                                        currencyVal.push({
                                            currency: item.token ? item.token.name : 'ETH',
                                            symbol: item.token ? item.token.symbol : 'ETH',
                                            balance: item.balance,
                                            token_address: item.tokenAddress,
                                            name: item.token ? item.token.name : 'ETH',
                                            decimal: item.token ? item.token.decimals : 0,
                                            logo_uri: item.token ? item.token.logoUri : '',
                                        });
                                    }
                                );
                                setCurrency(currencyVal[0]);
                                setCurrencyList(currencyVal);
                            }
                        });
                }
            } else if (provider.provider_type === 'wallet') {
                console.log(providerEth?._network.name);
            }

            if (value) setSdkValue(value);
        };
        getCurrency();
    }, [activeProvider.id, daoid]);

    const handleSubmit = async () => {
        if (!name) return toast('Failure', 5000, 'Invalid Title', 'Title cannot be empty')();

        // if (deadline && deadline.isBefore(new Date()))
        //   return toast(
        //     'Failure',
        //     5000,
        //     'Invalid Deadline',
        //     'Deadline cannot be in the past'
        //   )();
        if (!!deadline && project?.end_date && deadline.isAfter(dayjs(project?.end_date)))
            return toast(
                'Failure',
                5000,
                'Invalid Deadline',
                'Deadline cannot be after the project end date'
            )();

        if (!!deadline && project?.end_date && deadline.isBefore(dayjs(project?.start_date)))
            return toast(
                'Failure',
                5000,
                'Invalid Deadline',
                'Deadline cannot be before the project start date'
            )();

        const localData = localStorage.getItem('signUp');
        const parsedData = JSON.parse(localData!);
        const member_id = parsedData.member_id;
        const payout = providerList.map((item) => {
            return {
                id: item.id,
                name: item?.user.name,
                provider: item.provider,
                payout_amount: Number(item.payout_amount),
                receiver_address: item.receiver_address,
                payout_currency: item.payout_currency || 'ETH',
                safe_address: item.provider.address,
                token_address: item.token_address ? item.token_address : undefined,
                completed: false,
            };
        });
        // console.log(payout);
        const date = deadline?.isBefore(dayjs()) ? undefined : deadline?.toISOString();

        const payload = {
            task: {
                project_id: projectId ? projectId! : id!,
                title: name,
                deadline: date,
                description,
                created_by: member_id as string,
                poc_member_id: member_id as string,
                col: col.id,
                position: 65536,
                payout: payout,
                assignee_member: contributors?.map((val) => val.member_id),
                github_pr: {
                    id: selectedPr.id,
                    html_url: selectedPr.html_url,
                    state: selectedPr.state,
                    title: selectedPr.title,
                },
            },
        };
        console.log(payload);
        // return;
        try {
            await createTask(payload)
                .unwrap()
                .then((res) => {
                    console.log(res);
                    // sendNotification({
                    //   to: payload.task.assignee_member,
                    //   for: NotificationsEnums.NotificationFor.MEMBER,
                    //   from: member_id,
                    //   origin: name,
                    //   by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    //   metadata: {
                    //     id: res?.data!.task_id!,
                    //     // id: paymentMock.payment_id,
                    //   },
                    //   type: NotificationsEnums.SocketEventsToService.ADDED_TO_TASK,
                    // });
                    if (res.data?.task_id) {
                        updateActivity({
                            dao_id: daoid!,
                            member_id: getMemberId(),
                            project_id: id === 'me' ? projectId! : id!,
                            task_id: res.data.task_id,
                            discussion_id: '',
                            job_id: '',
                            payment_id: '',
                            bounty_id: '',
                            action_type: ActivityEnums.ActionType.TASK_CREATED,
                            visibility: ActivityEnums.Visibility.PUBLIC,
                            member: {
                                username:
                                    store.getState().commonReducer?.member?.data.username || '',
                                profile_picture:
                                    store.getState().commonReducer?.member?.data.profile_picture ||
                                    '',
                            },
                            dao: {
                                dao_name: store.getState().commonReducer?.activeDaoName || '',
                                profile_picture:
                                    store.getState().commonReducer?.profilePicture || '',
                            },
                            project: {
                                project_name: project?.title ? project.title : '',
                            },
                            task: {
                                task_name: name,
                            },
                            action: {
                                message: '',
                            },
                            metadata: {
                                id: res.data.task_id,
                                title: name,
                            },
                        });
                    }
                    // });
                    close();
                });
        } catch (e) {
            toast('Failure', 5000, 'Task Creation Failed', '')();
            console.error(e);
        }
    };

    const onClickCol = (item: dynamicColumnType) => {
        console.log(item);
        setCol(item);
        console.log(col);
    };

    return (
        <Popup className={styles.root}>
            <PopupTitle
                icon="/img/icons/write.png"
                title={
                    <>
                        Add <strong>New</strong> Task
                    </>
                }
            />
            <Input
                className={styles.firstInput}
                value={name}
                placeholder="Task Name"
                onChange={setName}
            />
            <ul className={styles.row} data-row-first>
                <li className={styles.colLeft}>
                    <PopupSubtitle text="Deadline" />
                    <DatePicker
                        className={styles.deadline}
                        value={deadline}
                        onChange={setDeadline}
                    />
                </li>
                {!personal && (
                    <li className={styles.colRight}>
                        <AddPeople
                            title="Add Contributors"
                            className={styles.contributors}
                            users={contributors}
                            onAddUser={handleAddUser}
                        />
                    </li>
                )}
            </ul>
            <PopupSubtitle className={styles.subtitle} text="Description" />
            <TextArea
                placeholder="Task description"
                className={styles.description}
                value={description}
                onChange={setDescription}
            />
            <PopupSubtitle className={styles.subtitle} text="Select Column" />
            <ReactSelect
                className={styles.columnSelect}
                value={col}
                classNamePrefix="rs"
                isSearchable={false}
                styles={selectStyles}
                options={(columns || []).map((column) => ({ ...column, value: column.name }))}
                onChange={(column) => onClickCol(column)}
                formatOptionLabel={({ name }) => <p className={styles.selectValue}>{name}</p>}
            />

            {!!prs && prs?.length > 0 && (
                <>
                    <PopupSubtitle className={styles.subtitle} text="Select Github PR" />
                    <ReactSelect
                        value={selectedPr}
                        classNamePrefix="rs"
                        isSearchable={false}
                        options={(prs || [])?.map((pr) => ({
                            ...pr,
                            value: pr.id,
                            label: pr.title,
                        }))}
                        onChange={(pr) => setSelectedPr(pr)}
                        styles={{
                            ...selectStyles,
                            valueContainer: (base, state) => ({
                                ...base,
                                ...selectStyles.valueContainer?.(base, state),
                                marginRight: 'auto',
                                paddingLeft: 8,
                            }),
                        }}
                        className={styles.githubSelect}
                        formatOptionLabel={({ value, label }) => (
                            <p className={styles.selectValue}>{label}</p>
                        )}
                        components={{
                            Control: ({ children, ...props }) => (
                                <components.Control {...props}>
                                    <Socials.Github2 className={styles.githubSelectIcon} />{' '}
                                    {children}
                                </components.Control>
                            ),
                        }}
                    />
                </>
            )}
            {/* {contributors?.map((val) => {
        return (
          <div>
            <Bounty
              personal={personal}
              contributor={val}
              providerList={providerList}
              setProviderList={setProviderList}
            />
          </div>
        );
      })} */}

            {contributors?.length > 0 && (
                <div>
                    <Bounty
                        personal={personal}
                        contributors={contributors}
                        providerList={providerList}
                        setProviderList={setProviderList}
                    />
                </div>
            )}

            <Button color="orange" className={styles.submit} onClick={handleSubmit}>
                <span>Create</span>
            </Button>
        </Popup>
    );
};

export default TaskAdd;
