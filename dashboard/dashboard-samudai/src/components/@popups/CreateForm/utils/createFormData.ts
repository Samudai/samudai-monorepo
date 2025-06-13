import { FormEnums } from '@samudai_xyz/gateway-consumer-types';

export interface FormDataType {
    id: number;
    question: string;
    type: FormEnums.QuestionType;
    required: boolean;
    description: string;
}

export interface FormDataOption {
    id: number;
    value: string;
    selected: boolean;
}

export interface FormDataData {
    text: string;
    attachment?: string;
    options: FormDataOption[];
}

export type GetFormDataItemType = FormDataType & FormDataData;

export function getFormDataDefault(type: FormEnums.QuestionType) {
    return {
        text: '',
        options: [],
        type,
    };
}

export function getFormDataItem(id: number, type: FormEnums.QuestionType): GetFormDataItemType {
    return Object.assign(
        {
            id,
            question: '',
            type: FormEnums.QuestionType,
            required: false,
            description: '',
        },
        getFormDataDefault(type)
    );
}

export function genFormDataOption(id: number, value?: string): FormDataOption {
    return {
        id,
        value: value || 'Option' + id,
        selected: false,
    };
}
