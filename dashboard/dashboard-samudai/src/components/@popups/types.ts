import { Dispatch, SetStateAction } from 'react';
import { useRequestPropsCallback } from 'hooks/useRequest';

export interface PopupShowProps {
    active: boolean;
    onClose: () => void;
    dData?: any[];
    gData?: any[];
    setGdata?: () => void;
    contributor?: boolean;
    googleData?: any;
    setGoogleData?: Dispatch<SetStateAction<any[]>>;
    fetchDData?: useRequestPropsCallback<void>;
}
