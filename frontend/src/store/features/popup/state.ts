export interface PopupSliceState {
    active: number;
    status: 'OPEN ALL' | 'CLOSE ALL';
    taskAdd: number | null;
    isEditProfile: boolean;
}

const initialState: PopupSliceState = {
    active: 0,
    status: 'OPEN ALL',
    taskAdd: null,
    isEditProfile: false,
};

export default initialState;
