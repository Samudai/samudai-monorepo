import React, { useState } from 'react';
import Select from 'react-select';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import {
    FormDataOption,
    GetFormDataItemType,
    genFormDataOption,
    getFormDataDefault,
} from './utils/createFormData';
import { selectStyles } from 'root/constants/selectStyles';
import CloseButton from 'ui/@buttons/Close/Close';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import TextInput from 'ui/@form/TextInput/TextInput';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import UploadIcon from 'ui/SVG/UploadIcon';
import styles from './styles/CreateFormItem.module.scss';
import { FormEnums } from '@samudai_xyz/gateway-consumer-types';

interface CreateFormItemProps {
    data: GetFormDataItemType;
    isFirst: boolean;
    onItemAdd: () => void;
    onDataRemove: () => void;
    onDataChange: (data: GetFormDataItemType) => void;
}

const CreateFormItem: React.FC<CreateFormItemProps> = ({
    data,
    isFirst,
    onItemAdd,
    onDataChange,
    onDataRemove,
}) => {
    const [answerType, setAnswerType] = useState(FormEnums.QuestionType.TEXT);

    const handleQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ ...data, question: e.target.value });
    };

    const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ ...data, text: e.target.value });
    };

    const handleOptionAdd = () => {
        onDataChange({
            ...data,
            options: [...data.options, genFormDataOption(data.options.length + 1)],
        });
    };

    const handleOptionRemove = (id: number) => {
        onDataChange({
            ...data,
            options: data.options.filter((o) => o.id !== id),
        });
    };

    const handleSelect = (item: FormDataOption) => {
        const options = data.options.map((option) => ({
            ...option,
            selected:
                answerType === FormEnums.QuestionType.MULTISELECT
                    ? item.value === option.value
                        ? !option.selected
                        : option.selected
                    : item.value === option.value
                    ? true
                    : false,
        }));

        onDataChange({ ...data, options });
    };

    const handleOptionChange = (id: number, newData: FormDataOption) => {
        onDataChange({
            ...data,
            options: data.options.map((option) => (option.id === id ? newData : option)),
        });
    };
    const handleAnswerType = ({ value }: { value: FormEnums.QuestionType }) => {
        setAnswerType(value);
        onDataChange({ ...data, ...getFormDataDefault(value) });
    };

    return (
        <li className={styles.root}>
            <div className={styles.head}>
                <h3 className={styles.headTitle}>
                    <span>Question</span>
                    {!isFirst && (
                        <CloseButton className={styles.headRemoveBtn} onClick={onDataRemove} />
                    )}
                </h3>
                {/* {isFirst && (
          <button className={styles.headAddItem} onClick={onItemAdd}>
            <PlusIcon />
            <span>Add Question</span>
          </button>
        )} */}
            </div>
            <Input
                value={data.question}
                onChange={handleQuestion}
                className={styles.question}
                icon={<p className={styles.questionIndex}>{data.id}.</p>}
                data-analytics-click="question_input"
            />
            <PopupSubtitle text="Select Answer Type" className={styles.selectTypeSubtitle} />
            <Select
                className={styles.type}
                value={{ value: answerType }}
                options={Object.values(FormEnums.QuestionType).map((value) => ({ value }))}
                onChange={handleAnswerType as any}
                formatOptionLabel={(data: { value: FormEnums.QuestionType }) => (
                    <p className={styles.typeName}>{data.value}</p>
                )}
                classNamePrefix="rs"
                isSearchable={false}
                styles={selectStyles}
            />
            {/* {answerType === FormEnums.QuestionType.TEXT && (
        <Input
          placeholder="Write the answer"
          className={styles.inputText}
          value={data.text}
          onChange={handleText}
        />
      )} */}
            {[FormEnums.QuestionType.SELECT, FormEnums.QuestionType.MULTISELECT].includes(
                answerType
            ) && (
                <ul className={styles.select}>
                    {data.options.map((option) => (
                        <li className={styles.selectOption} key={option.value}>
                            {answerType === FormEnums.QuestionType.SELECT && (
                                <Radio
                                    // onChange={handleSelect.bind(null, option)}
                                    onChange={() => {}}
                                    className={styles.selectRadio}
                                    checked={option.selected}
                                />
                            )}
                            {answerType === FormEnums.QuestionType.MULTISELECT && (
                                <Checkbox
                                    // onClick={(e) => handleSelect.bind(null, option, e)}
                                    onClick={() => {}}
                                    className={styles.selectCheckbox}
                                    active={option.selected}
                                />
                            )}
                            {/* <div>{option.value}</div> */}
                            <TextInput
                                value={option.value}
                                onChange={(e) =>
                                    handleOptionChange(option.id, { ...option, value: e })
                                }
                                className={styles.selectName}
                                classNameAll={styles.selectNameAll}
                            />
                            <CloseButton
                                className={styles.selectRemoveBtn}
                                onClick={handleOptionRemove.bind(null, option.id)}
                            />
                        </li>
                    ))}
                    <li className={styles.addOptionsBtn} onClick={handleOptionAdd}>
                        <PlusIcon />
                        <span>Add Options</span>
                    </li>
                </ul>
            )}

            {answerType === FormEnums.QuestionType.ATTACHMENT && (
                <div className={styles.attachment}>
                    <p className={styles.attachmentBtn}>
                        <AttachmentIcon />
                        <span>Upload</span>
                        <UploadIcon />
                    </p>
                </div>
            )}
        </li>
    );
};

export default CreateFormItem;
