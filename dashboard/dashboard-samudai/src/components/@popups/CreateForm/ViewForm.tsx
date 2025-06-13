import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useLazyResponsesByFormIDQuery,
    useLazyTaskResponseByFormQuery,
} from 'store/services/Dashboard/dashboard';
import { useTypedSelector } from 'hooks/useStore';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import ViewFormItem from './ViewFormItem';
import styles from './styles/CreateForm.module.scss';

interface ViewFormProps {
    onClose?: () => void;
    retreivedData?: any; //GetFormDataItemType[];
    form_id: string;
    isResponse?: boolean;
    account?: string;
    daoid?: string;
    response_id: string;
}

const ViewForm: React.FC<ViewFormProps> = ({
    onClose,
    retreivedData,
    form_id,
    isResponse,
    account,
    daoid,
    response_id,
}) => {
    const navigate = useNavigate();
    const [data, setData] = useState<any[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [discussionId, setDiscussionId] = useState<string>('');
    const [formType, setFormType] = useState<string>('');
    const [taskResponse] = useLazyTaskResponseByFormQuery();
    const [getResponse] = useLazyResponsesByFormIDQuery();
    useEffect(() => {
        const fun = async () => {
            try {
                setLoad(false);
                const res = await getResponse(form_id, true).unwrap();
                setData(res?.data?.response.responses);
                console.log(res?.data?.response.responses);
                setLoad(true);
            } catch (err) {
                setLoad(true);
                console.error(err);
            }
        };
        const fun2 = async () => {
            try {
                setLoad(false);
                const res = await taskResponse(response_id || form_id, true).unwrap();
                setDiscussionId(res?.data?.discussion_id);
                setFormType(res?.data?.response_type);
                setLoad(true);
            } catch (err) {
                setLoad(true);
                console.error(err);
            }
        };
        if ((retreivedData || []).length) {
            console.log(retreivedData);
            setData(retreivedData);
            setLoad(true);
            fun2();
        } else {
            fun();
            fun2();
        }
    }, [form_id]);

    const activeDAO = useTypedSelector(selectActiveDao);

    return (
        <Popup className={styles.root}>
            {/* prettier-ignore */}
            <PopupTitle
        icon="/img/icons/create-form.png"
        title={<><strong>View</strong> Response</>}
      />
            <ul className={styles.body}>
                {!!discussionId && (
                    <button
                        style={{ margin: '0 0 5px 5px' }}
                        className={styles.headBtn}
                        data-discuss
                        onClick={() => {
                            navigate(`/${activeDAO}/forum/${discussionId}`);
                        }}
                    >
                        <span>Go to Discussion</span>
                        <ArrowLeftIcon />
                    </button>
                )}
                {load &&
                    data?.map((val: any, index: any) => (
                        <ViewFormItem
                            data={val}
                            isFirst={index === 0}
                            key={index}
                            id={index}
                            formType={formType}
                        />
                    ))}
            </ul>
        </Popup>
    );
};

export default ViewForm;
