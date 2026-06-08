import { PayloadAction } from '@reduxjs/toolkit';
import { PopupSliceState } from './state';

const reducers = {
    incrementPopup: (state: PopupSliceState) => {
        state.active += 1;
        state.status = 'OPEN ALL';
    },
    decrementPopup: (state: PopupSliceState) => {
        state.active -= 1;
        state.status = 'OPEN ALL';
    },
    taskAddToggle: (
        state: PopupSliceState,
        { payload }: PayloadAction<PopupSliceState['taskAdd']>
    ) => {
        state.taskAdd = payload;
    },
    editProfileToggle: (state: PopupSliceState, { payload }: PayloadAction<boolean>) => {
        state.isEditProfile = payload;
    },
};

export default reducers;
