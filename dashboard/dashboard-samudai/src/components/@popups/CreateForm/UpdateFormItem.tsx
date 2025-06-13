import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import {
    FormDataOption,
    GetFormDataItemType,
    genFormDataOption,
    getFormDataDefault,
} from './utils/createFormData';
import { FormEnums } from '@samudai_xyz/gateway-consumer-types';
import CloseButton from 'ui/@buttons/Close/Close';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import FileInput from 'ui/@form/FileInput/FileInput';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import TextArea from 'ui/@form/TextArea/TextArea';
import TextInput from 'ui/@form/TextInput/TextInput';
import { File } from 'ui/Attachment';
import AttachmentIcon from 'ui/SVG/AttachmentIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { uploadFile } from 'utils/fileupload/fileupload';
import { cutText } from 'utils/format';
import { toast } from 'utils/toast';
import { FileUploadType, StorageType } from 'utils/types/FileUpload';
import styles from './styles/CreateFormItem.module.scss';
import { selectStyles } from 'root/constants/selectStyles1';
import clsx from 'clsx';
import { CloseIcon } from 'components/@pages/forum/ui/icons/close-icon';
import { TrashIcon } from 'components/@pages/new-jobs/ui/icons';
import Switch from 'ui/Switch/Switch';

interface CreateFormItemProps {
    data: GetFormDataItemType;
    isFirst: boolean;
    onItemAdd: () => void;
    onDataRemove: () => void;
    onDataChange: (data: GetFormDataItemType) => void;
    isResponse?: boolean;
    type: FormEnums.FormType;
}

const UpdateFormItem: React.FC<CreateFormItemProps> = ({
    data,
    isFirst,
    onItemAdd,
    onDataChange,
    onDataRemove,
    isResponse,
    type,
}) => {
    const [answerType, setAnswerType] = useState(data.type || FormEnums.QuestionType.TEXT);
    const [fileName, setFileName] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);
    const [showDescription, setShowDescription] = useState(false);

    useEffect(() => {
        setAnswerType(data.type || FormEnums.QuestionType.TEXT);
        if (data.description) {
            setShowDescription(true);
        }
    }, [data]);

    const handleFileLoad = async (file: File | null) => {
        try {
            const validExtensions = ['pdf', 'doc', 'csv', 'xlsx', 'docx', 'jpg', 'jpeg', 'png'];
            const ext = file?.name.split('.').pop();
            if (ext && !validExtensions.includes(ext)) {
                toast('Attention', 5000, 'File format not supported', 'Upload a different file')();
                return;
            }
            setLoad(true);
            if (!file) return toast('Failure', 5000, 'Upload a file', '')();
            if (file?.size > 1e7) return toast('Failure', 5000, 'Upload a smaller file', '')();
            toast('Attention', 3000, 'Uploading File', '')();
            const res = await uploadFile(
                file,
                FileUploadType.RESPONSE,
                StorageType.SPACES,
                data?.id.toString()
            );
            onDataChange({ ...data, attachment: res, text: file?.name });
            setFileName(file?.name);
            setLoad(false);
            toast('Success', 5000, 'File uploaded', '')();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleVideoFileLoad = async (file: File | null) => {
        try {
            const validExtensions = [
                'pdf',
                'doc',
                'csv',
                'xlsx',
                'docx',
                'jpg',
                'jpeg',
                'png',
                'mp4',
                'gif',
                'mov',
                'avi',
                'flv',
                'wmv',
            ];
            const ext = file?.name.split('.').pop();

            if (ext && !validExtensions.includes(ext)) {
                toast('Attention', 5000, 'File format not supported', 'Upload a different file')();
                return;
            }
            setLoad(true);
            if (!file) return toast('Failure', 5000, 'Upload a file', '')();
            if (file?.size > 5e7) return toast('Failure', 5000, 'Upload a smaller file', '')();
            toast('Attention', 3000, 'Uploading File', '')();
            const res = await uploadFile(
                file,
                FileUploadType.RESPONSE,
                StorageType.SPACES,
                data?.id.toString()
            );

            onDataChange({ ...data, attachment: res, text: file?.name });
            setFileName(file?.name);
            setLoad(false);
            toast('Success', 5000, 'File uploaded', '')();
        } catch (err: any) {
            toast('Failure', 5000, 'Something went wrong', err?.data?.message)();
        }
    };

    const handleQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ ...data, question: e.target.value });
    };

    const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange({ ...data, description: e.target.value });
    };

    const handleRequired = () => {
        onDataChange({ ...data, required: !data.required });
    };

    const handleText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
                {!isResponse && (
                    <h3 className={styles.headTitle}>
                        <div>
                            <span>Question</span>
                            {/* {!isFirst && !isResponse && (
                                <CloseButton
                                    className={styles.headRemoveBtn}
                                    onClick={onDataRemove}
                                />
                            )} */}
                        </div>
                        {!isResponse && (
                            <button
                                className={clsx(
                                    styles.headTitle_btn,
                                    showDescription && styles.headTitle_btn__disabled
                                )}
                                onClick={() => setShowDescription(true)}
                                disabled={showDescription}
                            >
                                <PlusIcon />
                                Description
                            </button>
                        )}
                    </h3>
                )}
                {/* {isFirst && !isResponse && (
          <button className={styles.headAddItem} onClick={onItemAdd}>
            <PlusIcon />
            <span>Add Question</span>
          </button>
        )} */}
            </div>
            <Input
                value={isResponse && data.required ? data.question + '*' : data.question}
                onChange={!isResponse ? handleQuestion : () => {}}
                className={styles.question}
                icon={<p className={styles.questionIndex}>{data.id}.</p>}
                readOnly={isResponse}
                // disabled={isResponse}
            />
            {!!showDescription && (
                <div>
                    {!isResponse && (
                        <h3 className={styles.headTitle} style={{ marginTop: '14px' }}>
                            <span>Description</span>
                            <button
                                className={styles.headTitle_btn2}
                                onClick={() => setShowDescription(false)}
                            >
                                <CloseIcon />
                            </button>
                        </h3>
                    )}

                    <Input
                        value={data.description}
                        onChange={!isResponse ? handleDescription : () => {}}
                        className={styles.question}
                        readOnly={isResponse}
                    />
                </div>
            )}
            {!isResponse && (
                <>
                    <PopupSubtitle
                        text="Select Answer Type"
                        className={styles.selectTypeSubtitle}
                    />
                    <Select
                        className={styles.type}
                        value={{ value: answerType }}
                        options={Object.values(FormEnums.QuestionType).map((value) => ({ value }))}
                        onChange={handleAnswerType as any}
                        formatOptionLabel={(data: { value: FormEnums.QuestionType }) => (
                            <p className={styles.typeName}>{data.value.split('_').join(' ')}</p>
                        )}
                        classNamePrefix="rs"
                        isSearchable={false}
                        styles={selectStyles}
                    />
                </>
            )}
            {isResponse && answerType === FormEnums.QuestionType.TEXT && (
                <TextArea
                    placeholder="Write the answer"
                    className={styles.description}
                    value={data.text}
                    onChange={handleText}
                />
            )}
            {[FormEnums.QuestionType.SELECT, FormEnums.QuestionType.MULTISELECT].includes(
                answerType
            ) && (
                <ul className={styles.select}>
                    {data.options.map((option) => (
                        <li className={styles.selectOption} key={option.value}>
                            {answerType === FormEnums.QuestionType.SELECT && (
                                <Radio
                                    onChange={
                                        isResponse ? handleSelect.bind(null, option) : () => {}
                                    }
                                    className={styles.selectRadio}
                                    checked={option.selected}
                                />
                            )}
                            {answerType === FormEnums.QuestionType.MULTISELECT && (
                                <Checkbox
                                    onClick={isResponse ? (e) => handleSelect(option) : () => {}}
                                    className={styles.selectCheckbox}
                                    active={option.selected}
                                />
                            )}
                            <TextInput
                                value={option.value}
                                onChange={
                                    !isResponse
                                        ? (e) =>
                                              handleOptionChange(option.id, { ...option, value: e })
                                        : () => {}
                                }
                                className={styles.selectName}
                                classNameAll={styles.selectNameAll}
                                disabled={isResponse}
                                autoFocus
                            />
                            {!isResponse && (
                                <CloseButton
                                    className={styles.selectRemoveBtn}
                                    onClick={handleOptionRemove.bind(null, option.id)}
                                />
                            )}
                        </li>
                    ))}
                    {!isResponse && (
                        <li className={styles.addOptionsBtn} onClick={handleOptionAdd}>
                            <PlusIcon />
                            <span>Add Options</span>
                        </li>
                    )}
                </ul>
            )}
            {answerType === FormEnums.QuestionType.ATTACHMENT && isResponse && (
                <FileInput className={styles.attachment} onChange={handleFileLoad}>
                    <p className={styles.attachmentBtn}>
                        <AttachmentIcon />
                        <span style={{ display: 'block' }}>Upload</span>
                        {!!fileName && (
                            <>
                                <span className={styles.attachmentName} style={{ color: 'white' }}>
                                    {cutText(fileName, 20)}
                                </span>
                                <div
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        onDataChange({ ...data, attachment: '' });
                                        setFileName('');
                                    }}
                                >
                                    <CloseButton className={styles.headRemoveBtn} />
                                </div>
                            </>
                        )}
                    </p>
                </FileInput>
            )}
            {answerType === FormEnums.QuestionType.ATTACHMENT_WITH_VIDEO && isResponse && (
                <FileInput className={styles.attachment} onChange={handleVideoFileLoad}>
                    <p className={styles.attachmentBtn}>
                        <AttachmentIcon />
                        <span style={{ display: 'block' }}>Upload</span>
                        {!!fileName && (
                            <>
                                <span className={styles.attachmentName} style={{ color: 'white' }}>
                                    {cutText(fileName, 20)}
                                </span>
                                <div
                                    onClick={(e: any) => {
                                        e.stopPropagation();
                                        onDataChange({ ...data, attachment: '' });
                                        setFileName('');
                                    }}
                                >
                                    <CloseButton className={styles.headRemoveBtn} />
                                </div>
                            </>
                        )}
                    </p>
                </FileInput>
            )}
            {(answerType === FormEnums.QuestionType.ATTACHMENT ||
                answerType === FormEnums.QuestionType.ATTACHMENT_WITH_VIDEO) &&
                !isResponse && (
                    <div className={styles.attachment}>
                        <p className={styles.attachmentBtn}>
                            <AttachmentIcon />
                            <span>Upload</span>
                        </p>
                    </div>
                )}
            {!isResponse && (
                <div className={styles.footer}>
                    <TrashIcon onClick={onDataRemove} />
                    <div className={styles.footer_right}>
                        <Switch
                            className={styles.footer_radio}
                            onClick={handleRequired}
                            active={data.required}
                        />
                        <span>Required</span>
                    </div>
                </div>
            )}
        </li>
    );
};

export default UpdateFormItem;
