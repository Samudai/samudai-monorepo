import React from 'react';
import Input from 'ui/@form/Input/Input';
import styles from './styles/IntegrationsCeramic.module.scss';

interface IntegrationsCeramicProps {
    isConnected: boolean;
    icon: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
}

const IntegrationsCeramic: React.FC<IntegrationsCeramicProps> = ({
    isConnected,
    name,
    icon,
    value,
    onChange,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <li className={styles.root}>
            <div className={styles.wrapper}>
                <div className={styles.icon}>
                    <img src={icon} alt="icon" />
                </div>
                <p className={styles.name}>{name}</p>
                <Input
                    className={styles.input}
                    placeholder="Stream ID"
                    value={value}
                    onChange={handleChange}
                />
            </div>
        </li>
    );
};

export default IntegrationsCeramic;
