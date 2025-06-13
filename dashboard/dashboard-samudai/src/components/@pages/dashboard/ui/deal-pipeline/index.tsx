import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums, FormEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import {
    useDeleteFormMutation,
    useLazyResponsesByDaoIDQuery,
    useGetFormQuery,
} from 'store/services/Dashboard/dashboard';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import UpdateForm from 'components/@popups/CreateForm/UpdateForm';
import { GetFormDataItemType } from 'components/@popups/CreateForm/utils/createFormData';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Button from 'ui/@buttons/Button/Button';
import AddIcon from 'ui/SVG/AddIcon';
import { toast } from 'utils/toast';
import { DealPipelineItem } from './components';
import styles from './deal-pipeline.module.scss';
import { form } from 'store/services/Dashboard/model';
import { ConfirmationModal } from './popup/ConfirmationModal';

interface DealPipelineProps {}

export const DealPipeline: React.FC<DealPipelineProps> = (props) => {
    const createFormPopup = usePopup();
    const updateFormPopup = usePopup<{
        data: form;
    }>();
    const deleteFormPopup = usePopup<{ data: form }>();
    const { daoid } = useParams();
    const navigate = useNavigate();
    const activeDao = useTypedSelector(selectActiveDao);
    const { data: formData } = useGetFormQuery(daoid!, { skip: !daoid });
    // const [getForm] = useLazyGetFormQuery();
    const [getResponses] = useLazyResponsesByDaoIDQuery();
    const [deleteForm] = useDeleteFormMutation();
    const [data, setData] = useState<GetFormDataItemType[]>([]);
    const [tempData, setTempData] = useState<form[]>([]);
    const [formId, setFormId] = useState<string>('');
    const [type, setType] = useState<FormEnums.FormType>();
    const [responseId, setResponseId] = useState<string>('');
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    const applyFormClick = async () => {
        try {
            window.open(`${window.location.origin}/${formId}/form`, '_blank');
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const getModifiedData = (data: form) => {
        return data.questions.map((item, index) => ({
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
    };

    const fetchFormData = async () => {
        // if (daoid) {
        //     try {
        //         const res = await getForm(daoid)
        //             .unwrap()
        //             .then((res1) => {
        //                 console.log(res1.data);
        //                 return res1;
        //             });
        //         console.log(res.data);
        //         setTempData(res?.data || []);
        //     } catch (err: any) {
        //         console.error(err);
        //     }
        // }
    };

    const handleDeleteForm = async (formId: string) => {
        try {
            await deleteForm(formId).unwrap();
            fetchFormData();
            toast('Success', 5000, 'Form successfully deleted', '')();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    // useEffect(() => {
    //     fetchFormData();
    // }, [daoid]);

    useEffect(() => {
        if (formData?.data) {
            setTempData(formData?.data);
        }
    }, [formData]);

    return (
        <Block className={styles.root} data-analytics-parent="deal_pipeline_widget">
            <Block.Header>
                <Block.Title>Form Table</Block.Title>

                <div style={{ display: 'flex' }}>
                    {/* {!!formId && (
                        <Button
                            color="orange"
                            className={styles.applyBtn}
                            onClick={applyFormClick}
                            data-analytics-click="deal_pipeline_apply_button"
                        >
                            <div className={styles.markIcon}>
                                <MarkIcon />
                            </div>
                            <span>Apply</span>
                        </Button>
                    )} */}

                    {access && (
                        <Button
                            color="orange"
                            className={styles.applyBtn}
                            onClick={createFormPopup.open}
                            data-analytics-click="deal_pipeline_create_button"
                        >
                            <AddIcon />
                            <span>Add New</span>
                        </Button>
                    )}
                </div>
            </Block.Header>
            <Block.Scrollable className={styles.block}>
                <ul className={styles.list}>
                    {tempData?.length > 0 &&
                        tempData.map((item, id) => (
                            <DealPipelineItem
                                key={item.form_id}
                                data={item}
                                onEdit={() => updateFormPopup.open({ data: item })}
                                onDelete={() => deleteFormPopup.open({ data: item })}
                            />
                        ))}
                    {tempData.length === 0 && (
                        <div
                            style={{
                                color: '#fdc087',
                                margin: '20px 0',
                                padding: '90px 0',
                                textAlign: 'center',
                            }}
                        >
                            <p className="dao-discussions__empty">There are no Forms.</p>
                        </div>
                    )}
                </ul>

                {/* <div className={styles.empty}>
                    <span className={styles.empty_block} />
                    
                    <p className={styles.empty_text}>
                        Create a New Deel Pipeline using the Form
                    </p>

                    <Button
                        className={styles.empty_formBtn}
                        color="orange-outlined"
                    >
                        <span>Deel Pipeline Form</span>
                    </Button>
                </div> */}
            </Block.Scrollable>
            <PopupBox active={createFormPopup.active} onClose={createFormPopup.close}>
                <UpdateForm
                    onClose={createFormPopup.close}
                    isResponse={false}
                    type={type}
                    formType="create"
                    fetchData={fetchFormData}
                />
            </PopupBox>
            {updateFormPopup.payload?.data && (
                <PopupBox active={updateFormPopup.active} onClose={updateFormPopup.close}>
                    <UpdateForm
                        onClose={updateFormPopup.close}
                        retreivedData={getModifiedData(updateFormPopup.payload.data)}
                        name={updateFormPopup.payload.data.name}
                        form_id={updateFormPopup.payload.data.form_id}
                        isResponse={false}
                        type={updateFormPopup.payload.data.type}
                        formType="update"
                        fetchData={fetchFormData}
                    />
                </PopupBox>
            )}
            {deleteFormPopup.payload?.data && (
                <PopupBox active={deleteFormPopup.active} onClose={deleteFormPopup.close}>
                    <ConfirmationModal
                        data={deleteFormPopup.payload?.data}
                        onConfirm={handleDeleteForm}
                        onClose={deleteFormPopup.close}
                    />
                </PopupBox>
            )}
        </Block>
    );
};
