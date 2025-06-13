import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import Progress from 'ui/Progress/Progress';
import { animate } from 'utils/animate';
import { ServiceType, Steps } from '../utils';
import styles from '../styles/Import.module.scss';

interface ImportProps {
    link: string;
    service: ServiceType;
    setStep: (step: Steps) => void;
}

const Import: React.FC<ImportProps> = ({ link, service, setStep }) => {
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        animate({
            duration: 5000,
            timingFunction(progress) {
                return progress;
            },
            draw(progress) {
                setPercentage(progress * 100);
            },
        });
    }, []);

    return (
        <div className={styles.root}>
            <p className={styles.text}>Importing project...</p>
            <Progress className={styles.progress} percent={percentage} hideText />
            <p className={styles.value}>
                <span style={{ left: percentage + '%' }}>{percentage.toFixed(0)}%</span>
            </p>
            <div className={styles.controls}>
                <Button
                    color="orange" // remove
                    className={clsx(styles.btn, styles.btnCancel)}
                    onClick={() => setStep(Steps.CHOOSE)}
                >
                    <span>Cancel</span>
                </Button>
                <Button
                    color="orange"
                    className={clsx(styles.btn, styles.btnAdd)}
                    disabled={percentage !== 100}
                    onClick={() => setStep(Steps.DONE)}
                >
                    <span>Add project</span>
                </Button>
            </div>
        </div>
    );
};

export default Import;
