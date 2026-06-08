import React from 'react';

interface StepProps {
    step: string | number;
    children?: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ children }) => {
    return <React.Fragment>{children}</React.Fragment>;
};

export default Step;
