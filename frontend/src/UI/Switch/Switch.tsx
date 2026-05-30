import React from 'react';
import clsx from 'clsx';
import './Switch.scss';

type SwitchProps = React.HTMLAttributes<any> & {
    className?: string;
    component?: keyof JSX.IntrinsicElements;
    active: boolean;
};

const Switch: React.FC<SwitchProps> = ({ className, component, active, ...props }) => {
    const Component = component ?? 'button';
    return (
        <Component className={clsx('switch', { active })} {...props}>
            <div className={clsx('switch__track', className)}>
                <span className="switch__thumb"></span>
                <span className="switch__thumb switch__thumb_hidden"></span>
            </div>
        </Component>
    );
};

export default Switch;
