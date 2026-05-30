import React from 'react';
import Step from './Step';

interface StepperProps {
    active?: string | number;
    children?: React.ReactNode;
}

const Stepper: React.FC<StepperProps> = ({ active, children }) => {
    return (
        <React.Fragment>
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) return null;

                if (child.type !== Step) return null;

                if (child.props.step === active) return child;

                return null;
            })}
        </React.Fragment>
    );
};

export default Object.assign(Stepper, { Step });
