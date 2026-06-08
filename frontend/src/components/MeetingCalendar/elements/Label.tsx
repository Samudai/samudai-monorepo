import React from 'react';
import dayjs from 'dayjs';
import '../styles/Label.scss';

interface LabelProps {
    date: dayjs.Dayjs;
}

const Label: React.FC<LabelProps> = ({ date }) => {
    return (
        <p className="meeting-calendar-label">
            <strong>{date.format('MMM')}</strong> <span>{date.format('YYYY')}</span>
        </p>
    );
};

export default Label;
