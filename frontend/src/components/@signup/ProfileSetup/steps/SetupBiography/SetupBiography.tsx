import { BasicStepProps } from 'components/@signup/types';
import React from 'react';
import TextArea from 'ui/@form/TextArea/TextArea';
import './SetupBiography.scss';

const SetupBiography: React.FC<BasicStepProps> = ({ state, setState }) => {
    const onChangeBio = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
        setState((prev) => ({ ...prev, biography: value }));
    };

    return (
        <React.Fragment>
            <h3 className="profile-setup__title setup-biography__title">About</h3>
            <TextArea
                className="profile-setup__textarea"
                value={state.biography}
                onChange={onChangeBio}
                placeholder="Write about yourself..."
            />
        </React.Fragment>
    );
};

export default SetupBiography;
