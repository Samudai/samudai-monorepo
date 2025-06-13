import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { useEffect } from 'react';

interface OnboardingPopupProps {
    timestamp: number;
    Component: React.FC<any>;
    skippable?: boolean;
    callback?: () => void;
}

const OnboardingPopup: React.FC<OnboardingPopupProps> = ({
    timestamp,
    Component,
    skippable,
    callback,
}) => {
    const popup = usePopup();

    useEffect(() => {
        const timeout = setTimeout(() => {
            popup.open();
            callback?.();
        }, timestamp * 1000);

        return () => {
            clearTimeout(timeout);
        };
    }, [timestamp]);

    return (
        <PopupBox active={popup.active} onClose={() => skippable && popup.close()}>
            <Component onClose={popup.close} />
        </PopupBox>
    );
};

export default OnboardingPopup;
