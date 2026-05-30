import { SignUpModals, SignUpStateGetSet } from 'pages/sign-up/types';

export interface BasicModalProps {
    onNextModal?: () => void;
    onNextModalSkip?: (modal: SignUpModals) => void;
    dbot?: boolean;
}
export type BasicStepProps = SignUpStateGetSet;

export type ConnectWalletProps = BasicModalProps;
export type StartAsProps = BasicModalProps & SignUpStateGetSet;
export type ConnectAppsProps = BasicModalProps;
export type ProfileSetupProps = BasicModalProps & SignUpStateGetSet;
export type CompleteProps = BasicModalProps & SignUpStateGetSet;
export type JobsProps = BasicModalProps;

export type ChangeImageType = (img: File | string | null) => void;
export type ChangeNameType = (e: React.ChangeEvent<HTMLInputElement>) => void;
export type ChangeBiographyType = (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type ChangeSocialsType = (type: string, value: string) => void;
