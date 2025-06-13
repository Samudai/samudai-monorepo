import { useState } from 'react';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import clsx from 'clsx';
import useInput from 'hooks/useInput';
import Button from 'ui/@buttons/Button/Button';
import Radio from 'ui/@form/Radio/Radio';
import Magnifier from 'ui/SVG/Magnifier';
import { RewardRole } from 'utils/types/rewards.types';
import './DiscordRole.scss';

interface DiscordRoleProps {
    onSubmit: (role: RewardRole) => void;
    onClose: () => void;
}

const DiscordRole: React.FC<DiscordRoleProps> = ({ onClose, onSubmit }) => {
    const [search, setSearch] = useInput('');
    const [selectedRole, setSelectedRole] = useState<RewardRole | null>(null);

    const handleChangeRole = (role: RewardRole) => {
        setSelectedRole(role);
    };

    const handleSubmit = () => {
        if (selectedRole) {
            onSubmit(selectedRole);
            onClose();
        }
    };

    return (
        <Popup className="discord-role" onClose={onClose}>
            <PopupTitle
                className="discord-role__title"
                icon="/img/icons/star.png"
                title="Select discord role"
            />
            <div className="discord-role__search">
                <Magnifier className="discord-role__magnifier" />
                <input
                    type="text"
                    className="discord-role__input"
                    placeholder="Search Job"
                    value={search}
                    onChange={setSearch}
                />
            </div>
            <ul className="discord-role__role-list">
                {Object.values(RewardRole).map((role) => {
                    const checked = role === selectedRole;

                    return (
                        <li
                            className={clsx('discord-role__role-item', { checked })}
                            key={role}
                            onClick={handleChangeRole.bind(null, role)}
                        >
                            <Radio checked={checked} value={role} />
                            <p className="discord-role__role-name">{role}</p>
                        </li>
                    );
                })}
            </ul>
            <div className="discord-role__controls">
                <Button className="discord-role__btn discord-role__btn_cancel" onClick={onClose}>
                    <span>Cancel</span>
                </Button>
                <Button
                    className="discord-role__btn discord-role__btn_apply"
                    onClick={handleSubmit}
                >
                    <span>Apply</span>
                </Button>
            </div>
        </Popup>
    );
};

export default DiscordRole;
