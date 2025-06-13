import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { GetFormDataItemType, getFormDataItem } from './utils/createFormData';
import { FormEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useCreateFormMutation,
    useCreateResponseMutation,
    useLazyGetFormQuery,
    useUpdateFormMutation,
} from 'store/services/Dashboard/dashboard';
import { useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import UpdateFormItem from './UpdateFormItem';
import styles from './styles/CreateForm.module.scss';
import Sprite from 'components/sprite';
import PlusIcon from 'ui/SVG/PlusIcon';
import { createFormReq } from 'store/services/Dashboard/model';
import { useBilling } from 'utils/billing/use-billing';
import clsx from 'clsx';

interface CreateFormProps {
    onClose?: () => void;
    formType: 'create' | 'update' | 'response';
    retreivedData?: GetFormDataItemType[];
    name?: string;
    form_id?: string;
    isResponse?: boolean;
    account?: string;
    daoid?: string;
    type?: FormEnums.FormType;
    created_by?: string;
    created_at?: string;
    fetchData?: () => void;
}

const MAX_QUESTIONS_LENGTH = 10;

const UpdateForm: React.FC<CreateFormProps> = ({
    onClose,
    retreivedData,
    name,
    form_id,
    isResponse,
    account,
    daoid,
    type,
    formType,
    created_by,
    created_at,
    fetchData,
}) => {
    const navigate = useNavigate();
    const [load, setLoad] = useState(false);
    const [data, setData] = useState<GetFormDataItemType[]>([
        getFormDataItem(1, FormEnums.QuestionType.TEXT),
    ]);
    const [formTitle, setFormTitle] = useState(name || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const { currSubscription, usedLimitCount } = useBilling();

    const [updateForm] = useUpdateFormMutation();
    const [createForm] = useCreateFormMutation();
    const [createResponse] = useCreateResponseMutation();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [getForm] = useLazyGetFormQuery();

    const formsRemaining = useMemo(() => {
        if (!usedLimitCount || !currSubscription) return 0;
        if (usedLimitCount.formCount > currSubscription.current_plan.forms) return 0;
        else return currSubscription.current_plan.forms - usedLimitCount.formCount;
    }, [currSubscription, usedLimitCount]);

    const handleAddItem = (type: FormEnums.QuestionType) => {
        if (data.length < MAX_QUESTIONS_LENGTH) {
            setData([...data, getFormDataItem(data.length + 1, type)]);
        }
    };

    const handleRemoveItem = (id: number) => {
        setData(
            data.filter((item) => item.id !== id).map((item, idx) => ({ ...item, id: idx + 1 }))
        );
    };

    const handleChangeItem = (id: number, newData: GetFormDataItemType) => {
        setData(data.map((item) => (item.id === id ? newData : item)));
    };
    const toastCall = (message: string) => {
        toast('Failure', 5000, message, '')();
    };

    const handlePublish = async () => {
        if (!formTitle) {
            toastCall('Please enter the title');
            return;
        }
        if (data.length === 0) {
            toastCall('Please add at least one question');
            return;
        }
        if (data.some((item) => item.question === '')) {
            toastCall('Please fill all questions');
            return;
        }
        if (
            data.some(
                (item) =>
                    (item.type === FormEnums.QuestionType.SELECT ||
                        item.type === FormEnums.QuestionType.MULTISELECT) &&
                    item.options.length < 2
            )
        ) {
            toastCall('Please add 2 or more options for select and multi select type');
            return;
        }
        const optionsValid = data.every((item) => {
            if (
                item.type !== FormEnums.QuestionType.TEXT &&
                item.type !== FormEnums.QuestionType.ATTACHMENT
            )
                return item.options.length > 0;
            return true;
        });

        if (!optionsValid) {
            toastCall('Please fill all options');
            return;
        }
        if (formType === 'update' && form_id) {
            const payload = {
                form: {
                    dao_id: activeDAO,
                    form_id: form_id,
                    name: formTitle,
                    type: type || FormEnums.FormType.DEAL,
                    questions: data.map((item) => ({
                        question: item.question,
                        type: item.type,
                        select: item.options.map((item) => item.value),
                        description: item.description,
                        required: item.required,
                    })),
                    updated_by: getMemberId(),
                    created_at: created_at,
                    created_by: created_by,
                },
            };
            try {
                await updateForm(payload).unwrap();
                fetchData?.();
                onClose?.();
                toast('Success', 5000, 'Form updated successfully', '')();
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        } else {
            const payload: createFormReq = {
                form: {
                    dao_id: activeDAO,
                    name: formTitle,
                    type: type || FormEnums.FormType.DEAL,
                    questions: data.map((item) => ({
                        question: item.question,
                        type: item.type,
                        select: item.options.map((item) => item.value),
                        description: item.description,
                        required: item.required,
                    })),
                    created_by: getMemberId(),
                },
            };
            try {
                await createForm(payload).unwrap();
                fetchData?.();
                onClose?.();
                toast('Success', 5000, 'Form created successfully', '')();
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        }
    };

    const handleSubmit = async () => {
        //form validate
        if (
            data.some((item) => {
                if (item.required) {
                    if (item.type === FormEnums.QuestionType.TEXT) {
                        return item.text === '';
                    }
                    if (
                        item.type === FormEnums.QuestionType.SELECT ||
                        item.type === FormEnums.QuestionType.MULTISELECT
                    ) {
                        return !item.options.some((option) => option.selected);
                    }
                    if (
                        item.type === FormEnums.QuestionType.ATTACHMENT ||
                        item.type === FormEnums.QuestionType.ATTACHMENT_WITH_VIDEO
                    ) {
                        return item.attachment === '' || item.attachment === undefined;
                    }
                }
            })
        ) {
            toastCall('Please answer all the mandatory questions');
            return;
        }

        const payload = {
            response_id: '',
            wallet: type !== FormEnums.FormType.SUPPORT ? account! : getMemberId(),
            form_id: form_id!,
            responses: data.map((item) => ({
                question: item.question,
                type: item.type,
                select: (item.options || [])?.map((item) => item.value),
                answer:
                    item.type === FormEnums.QuestionType.TEXT ||
                    item.type === FormEnums.QuestionType.ATTACHMENT ||
                    item.type === FormEnums.QuestionType.ATTACHMENT_WITH_VIDEO
                        ? [item.text]
                        : (item.options || [])
                              ?.filter((item) => item.selected)
                              .map((item) => item.value),
                attachment: item.attachment ? item.attachment : '',
            })),
            metadata: {
                user_agent: window.navigator.userAgent,
                member_id: getMemberId() || '',
            },
        };

        try {
            setLoad(true);
            const res = await createResponse({ response: payload, daoId: daoid! }).unwrap();
            // sendNotification({
            //   to: [daoid!],
            //   for: NotificationsEnums.NotificationFor.ADMIN,
            //   from: account!,
            //   origin: 'deal-pipeline',
            //   by: NotificationsEnums.NotificationCreatedby.MEMBER,
            //   metadata: {
            //     id: res?.data?.project_id,
            //     // id: paymentMock.payment_id,
            //   },
            //   type: NotificationsEnums.SocketEventsToService.DEAL_FORM_RESPONSE,
            // });
            setLoad(false);
            navigate('/dashboard/1');
            console.log(res);
        } catch (err: any) {
            setLoad(false);
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
        console.log(payload);
    };

    //firct character capitalise
    const capitalize = (s: string) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    useEffect(() => {
        if (retreivedData && (retreivedData || []).length) {
            setData(retreivedData);
        }
    }, []);

    useEffect(() => {
        if (inputRef.current) {
            const inputWidth = inputRef.current.value.length;
            inputRef.current.style.width = inputWidth ? inputWidth + 'ch' : '150px';
        }
    }, [formTitle]);

    useEffect(() => {
        if (name) setFormTitle(name);
    }, [name]);

    return !load ? (
        <Popup className={styles.root} onClose={onClose}>
            {/* prettier-ignore */}
            <PopupTitle
        icon="/img/icons/create-form.png"
        title=''
      />
            <div className={styles.title_container}>
                {!isResponse ? (
                    <>
                        <input
                            className={styles.title}
                            value={formTitle}
                            placeholder="Enter the title"
                            onChange={(e) => setFormTitle(e.target.value)}
                            ref={inputRef}
                            style={{ borderBottom: '2px dashed #f9f9f9' }}
                            autoFocus
                        />
                        <button onClick={() => inputRef.current?.focus()}>
                            <Sprite url="/img/sprite.svg#edit-pen" />
                        </button>
                    </>
                ) : (
                    <div className={styles.title}>{name}</div>
                )}
            </div>

            <ul className={styles.body}>
                {data.map((item, index) => (
                    <UpdateFormItem
                        data={item}
                        onItemAdd={() => handleAddItem(item.type)}
                        onDataRemove={handleRemoveItem.bind(null, item.id)}
                        onDataChange={handleChangeItem.bind(null, item.id)}
                        isFirst={index === 0}
                        key={index}
                        isResponse={isResponse}
                        type={type!}
                    />
                ))}
                {!isResponse && (
                    <button
                        className={styles.headAddItem}
                        onClick={() => {
                            handleAddItem(FormEnums.QuestionType.TEXT);
                        }}
                    >
                        <PlusIcon />
                        <span>Add Question</span>
                    </button>
                )}
            </ul>

            <div className={styles.footer}>
                {!isResponse && (
                    <div className={styles.upgrade}>
                        <span
                            className={clsx(
                                styles.upgrade_text,
                                !formsRemaining && styles.upgrade_text2
                            )}
                        >
                            {formsRemaining} {formsRemaining === 1 ? 'form' : 'forms'} remaining.
                        </span>
                        <button
                            className={styles.upgrade_btn}
                            onClick={() => navigate(`/${daoid}/settings/dao/billing-stripe`)}
                        >
                            Upgrade Now
                        </button>
                    </div>
                )}

                <Button
                    color="orange"
                    className={styles.controlsBtn}
                    onClick={!isResponse ? handlePublish : handleSubmit}
                    disabled={!isResponse && !formsRemaining}
                >
                    <span>{!isResponse ? 'Publish' : 'Submit'}</span>
                </Button>
            </div>
        </Popup>
    ) : (
        <Loader />
    );
};

export default UpdateForm;
