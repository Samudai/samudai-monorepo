import clsx from 'clsx';
import './Modal.scss';

interface ModalProps {
    className?: string;
    children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, className }) => {
    return <div className={clsx('modal', className)}>{children}</div>;
};

export default Modal;
