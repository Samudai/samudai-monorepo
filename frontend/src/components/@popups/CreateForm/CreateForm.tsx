import { useState } from 'react';
import React from 'react';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { GetFormDataItemType, getFormDataItem } from './utils/createFormData';
import { FormEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectActiveDao } from 'store/features/common/slice';
import { useCreateFormMutation } from 'store/services/Dashboard/dashboard';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import CreateFormItem from './CreateFormItem';
import styles from './styles/CreateForm.module.scss';

interface CreateFormProps {
    onClose?: () => void;
    editFormClick: () => Promise<void>;
}

const MAX_QUESTIONS_LENGTH = 10;

const CreateForm: React.FC<CreateFormProps> = ({ onClose, editFormClick }) => {
    const [createForm] = useCreateFormMutation();
    const activeDAO = useTypedSelector(selectActiveDao);

    const [data, setData] = useState<GetFormDataItemType[]>([
        getFormDataItem(1, FormEnums.QuestionType.TEXT),
    ]);

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

    const taostCall = (message: string) => {
        toast('Failure', 5000, 'Something went wrong', message)();
    };

    const handlePublish = async () => {
        if (data.length === 0) {
            taostCall('Please add at least one question');
            return;
        }
        if (data.some((item) => item.question === '')) {
            taostCall('Please fill all questions');
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
            taostCall('Please fill all options');
            return;
        }

        const payload = {
            form: {
                dao_id: activeDAO,
                type: FormEnums.FormType.DEAL,
                questions: data.map((item) => ({
                    question: item.question,
                    type: item.type,
                    select: item.options.map((item) => item.value),
                })),
                created_by: getMemberId(),
            },
        };

        try {
            // const res = createForm(payload).unwrap();
            await editFormClick();
            await editFormClick();
            onClose?.();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };
    return (
        <React.Fragment>
            {/* prettier-ignore */}
            <PopupTitle
        icon="/img/icons/create-form.png"
        title={<><strong>Create</strong> Form</>}
      />
            <ul className={styles.body}>
                {data.map((item, index) => (
                    <CreateFormItem
                        data={item}
                        onItemAdd={() => handleAddItem(item.type)}
                        onDataRemove={handleRemoveItem.bind(null, item.id)}
                        onDataChange={handleChangeItem.bind(null, item.id)}
                        isFirst={index === 0}
                        key={index}
                    />
                ))}

                <button
                    className={styles.headAddItem}
                    onClick={() => {
                        handleAddItem(FormEnums.QuestionType.TEXT);
                    }}
                    style={{ marginTop: '20px' }}
                    data-analytics-click="add_question_button"
                >
                    <span style={{ color: '#b2ffc3', font: '600 17px/1 "Lato", sans-serif' }}>
                        Add Question
                    </span>
                </button>
            </ul>
            <footer className={styles.controls}>
                {/* <Button color="green" className={styles.controlsBtn}>
          <span>Save</span>
        </Button> */}
                <Button
                    color="orange"
                    className={styles.controlsBtn}
                    onClick={handlePublish}
                    data-analytics-click="publish_button"
                >
                    <span>Publish</span>
                </Button>
            </footer>
        </React.Fragment>
    );
};

export default CreateForm;
