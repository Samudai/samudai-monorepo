import React, { useEffect, useState } from 'react';
import { FormEnums } from '@samudai_xyz/gateway-consumer-types';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import TextArea from 'ui/@form/TextArea/TextArea';
import TextInput from 'ui/@form/TextInput/TextInput';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import { downloadFile } from 'utils/fileupload/fileupload';
import { StorageType } from 'utils/types/FileUpload';
import styles from './styles/CreateFormItem.module.scss';

interface CreateFormItemProps {
    data: any; //GetFormDataItemType;
    isFirst: boolean;
    id: number;
    formType: string;
}

const ViewFormItem: React.FC<CreateFormItemProps> = ({ data, isFirst, id, formType }) => {
    const [answerType, setAnswerType] = useState();
    useEffect(() => {
        setAnswerType(data?.type || FormEnums.QuestionType.TEXT);
    }, []);
    return (
        <li className={styles.root}>
            <div className={styles.head}>
                <Input
                    value={data.question}
                    onChange={() => {}}
                    className={styles.question}
                    icon={<p className={styles.questionIndex}>{id + 1}.</p>}
                    disabled={true}
                />
            </div>

            {answerType === FormEnums.QuestionType.TEXT && (
                <TextArea className={styles.description} value={data.answer[0]} />
            )}
            {[FormEnums.QuestionType.SELECT, FormEnums.QuestionType.MULTISELECT].includes(
                answerType!
            ) && (
                <ul className={styles.select}>
                    {data.select.map((option: any) => (
                        <li className={styles.selectOption} key={option.slect}>
                            {answerType === FormEnums.QuestionType.SELECT && (
                                <Radio
                                    onChange={() => {}}
                                    className={styles.selectRadio}
                                    checked={data.answer.includes(option)}
                                />
                            )}
                            {answerType === FormEnums.QuestionType.MULTISELECT && (
                                <Checkbox
                                    onClick={() => {}}
                                    className={styles.selectCheckbox}
                                    active={data.answer.includes(option)}
                                />
                            )}
                            <TextInput
                                value={option}
                                onChange={() => {}}
                                className={styles.selectName}
                                classNameAll={styles.selectNameAll}
                                disabled={true}
                            />
                        </li>
                    ))}
                </ul>
            )}
            {answerType === FormEnums.QuestionType.ATTACHMENT && (
                <div className={styles.attachment}>
                    <p
                        className={styles.attachmentBtn}
                        onClick={() => {
                            downloadFile(data.attachment, StorageType.SPACES, data?.answer[0]);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <AttachmentIcon />
                        <span>{data?.answer[0]}</span>
                    </p>
                </div>
            )}
        </li>
    );
};

export default ViewFormItem;
