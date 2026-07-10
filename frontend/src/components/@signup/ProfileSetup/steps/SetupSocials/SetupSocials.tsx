import React from 'react';
import { BasicStepProps } from 'components/@signup/types';
import * as Socials from 'ui/SVG/socials';
import SetupSocialsItem from './SetupSocialsItem';
import './SetupSocials.scss';

const SetupSocials: React.FC<BasicStepProps> = ({ state, setState }) => {
    const onChangeInput = (name: string) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setState((prev) => ({ ...prev, [name]: e.target.value }));
        };
    };

    return (
        <React.Fragment>
            <div className="setup-socials">
                <SetupSocialsItem
                    modifier="--twitter"
                    icon={<Socials.Twitter />}
                    value={state.twitter}
                    onChange={onChangeInput('twitter')}
                    placeholder="https://twitter.com/username"
                />
                <SetupSocialsItem
                    modifier="--behance"
                    icon={<Socials.Behance />}
                    value={state.behance}
                    onChange={onChangeInput('behance')}
                    placeholder="https://www.behance.net/username"
                />
                <SetupSocialsItem
                    modifier="--dribbble"
                    icon={<Socials.Dribbble />}
                    value={state.dribbble}
                    onChange={onChangeInput('dribbble')}
                    placeholder="https://dribbble.com/username"
                />
                <SetupSocialsItem
                    modifier="--mirror"
                    icon={<Socials.Mirror />}
                    value={state.mirror}
                    onChange={onChangeInput('mirror')}
                    placeholder="https://mirror.xyz/username"
                />
                <SetupSocialsItem
                    modifier="--mirror"
                    icon={<Socials.Fiverr />}
                    value={state.fiverr}
                    onChange={onChangeInput('fiverr')}
                    placeholder="https://www.fiverr.com/username"
                />
            </div>
        </React.Fragment>
    );
};

export default SetupSocials;
