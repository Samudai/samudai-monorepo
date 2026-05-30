import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FormEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccount } from 'store/features/common/slice';
import { useLazyGetFormbyFormIdQuery } from 'store/services/Dashboard/dashboard';
import { useTypedSelector } from 'hooks/useStore';
import UpdateForm from 'components/@popups/CreateForm/UpdateForm';
import { GetFormDataItemType } from 'components/@popups/CreateForm/utils/createFormData';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/pipeline-form.module.scss';

interface PipelineFormProps {}

const PipelineFormPage: React.FC<PipelineFormProps> = (props) => {
    const navigate = useNavigate();
    const { formid } = useParams();
    const [getForm] = useLazyGetFormbyFormIdQuery();
    const [data, setData] = useState<GetFormDataItemType[]>([]);
    const [show, setShow] = useState(false);
    const [account, setAccount] = useState('');
    const [type, setType] = useState<FormEnums.FormType>();
    const [daoid, setDaoid] = useState('');
    const [name, setName] = useState('');
    const acccount1 = useTypedSelector(selectAccount);

    const connectWallet = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        setAccount(account);
    };

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getForm(formid!, true);
                const modifiedData = res?.data?.data?.form?.questions.map((item, index) => ({
                    id: index + 1,
                    question: item.question,
                    type: item.type,
                    text: '',
                    required: item.required,
                    description: item.description,
                    options: item.select.map((item, index) => ({
                        id: index + 1,
                        value: item,
                        selected: false,
                    })),
                }));
                setData(modifiedData as GetFormDataItemType[]);
                setDaoid(res?.data?.data?.form?.dao_id || '');
                setType(res?.data?.data?.form?.type);
                setName(res?.data?.data?.form?.name || '');
                setShow(!!account || res?.data?.data?.form?.type === FormEnums.FormType.SUPPORT);
                if (res?.data?.data?.form?.type === FormEnums.FormType.SUPPORT) {
                    setAccount(getMemberId());
                }
            } catch (err: any) {
                toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
            }
        };
        fun();
    }, [formid, account]);

    return (
        <div className={styles.root} data-analytics-page="pipeline_form_page">
            {account ? (
                <div className="container" data-analytics-parent="pipeline_form_parent">
                    <header className={styles.head}>
                        <img
                            src={require('images/logo.png')}
                            alt="logo"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/dashboard/1`)}
                        />
                    </header>
                    <div className={styles.form}>
                        {show && (
                            <UpdateForm
                                retreivedData={data}
                                form_id={formid!}
                                account={account}
                                isResponse
                                daoid={daoid}
                                type={type}
                                name={name}
                                formType="response"
                            />
                        )}
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Button
                        color="green"
                        onClick={connectWallet}
                        style={{
                            width: '200px',
                        }}
                        data-analytics-click="pipeline_form_connect_btn"
                    >
                        Connect Wallet
                    </Button>
                </div>
            )}
        </div>
    );
};

export default PipelineFormPage;
