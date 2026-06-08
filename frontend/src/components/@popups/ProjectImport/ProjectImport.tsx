import { useState } from 'react';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import Choose from './elements/Choose';
import Done from './elements/Done';
import DropDown from './elements/DropDown';
import Import from './elements/Import';
import { getProjectByMemberIdQRequest } from 'store/services/projects/model';
import useInput from 'hooks/useInput';
import Stepper from 'components/stepper/Stepper';
import Button from 'ui/@buttons/Button/Button';
import { Steps, services } from './utils';
import styles from './ProjectImport.module.scss';

interface ProjectImportProps {
    onClose?: () => void;
    fetch1?: (arg0: getProjectByMemberIdQRequest) => void;
}

const ProjectImport: React.FC<ProjectImportProps> = ({ onClose, fetch1 }) => {
    const [step, setStep] = useState<Steps>(Steps.CHOOSE);
    const [link, setLink] = useInput('');
    const [service, setService] = useState<(typeof services)[0]>(services[0]);

    return (
        <Popup className={styles.root} onClose={onClose}>
            {step === Steps.CHOOSE && (
                <PopupTitle
                    icon={'/img/icons/import.png'}
                    title={
                        <>
                            <strong>Import</strong> project from
                        </>
                    }
                />
            )}
            {step !== Steps.CHOOSE && (
                <PopupTitle
                    icon={service.icon}
                    title={
                        <>
                            <strong>Import</strong> project from {service.name}
                        </>
                    }
                />
            )}
            <ul className={styles.bullets}>
                <li className={styles.bullet} data-active={step === Steps.CHOOSE}></li>
                <li className={styles.bullet} data-active={step !== Steps.CHOOSE}></li>
            </ul>
            <div className={styles.body}>
                <Stepper active={step}>
                    <Stepper.Step step={Steps.CHOOSE}>
                        <Choose
                            link={link}
                            service={service}
                            onChangeLink={setLink}
                            onChangeService={setService}
                        />
                        <Button
                            color="orange"
                            className={styles.btn}
                            onClick={() => setStep(Steps.DONE)}
                        >
                            <span>Next</span>
                        </Button>
                    </Stepper.Step>

                    <Stepper.Step step={Steps.IMPORTING}>
                        <Import link={link} service={service} setStep={setStep} />
                    </Stepper.Step>

                    <Stepper.Step step={Steps.DONE}>
                        <Done setStep={setStep} />
                    </Stepper.Step>
                    <Stepper.Step step={Steps.ORDER}>
                        <DropDown setStep={setStep} onClose={onClose} fetch1={fetch1} />
                    </Stepper.Step>
                </Stepper>
            </div>
        </Popup>
    );
};

export default ProjectImport;
