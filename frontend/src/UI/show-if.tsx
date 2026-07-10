import React from 'react';

interface ShowIfProps {
    children: React.ReactNode;
    condition: boolean;
}

const ShowIf: React.FC<ShowIfProps> = ({ children, condition }) => {
    if (!condition) return null;

    return <>{children}</>;
};

export default ShowIf;
