import React from 'react';
import clsx from 'clsx';
import Input from 'ui/@form/Input/Input';

interface SetupSocialsItemProps {
    modifier?: string;
    icon: JSX.Element;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SetupSocialsItem: React.FC<SetupSocialsItemProps> = ({
    icon,
    value,
    modifier,
    onChange,
    placeholder,
}) => (
    <div className={clsx('setup-socials__field', modifier)}>
        <div className="setup-socials__icon">{icon}</div>
        <Input
            className="setup-socials__input"
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
    </div>
);

export default SetupSocialsItem;
