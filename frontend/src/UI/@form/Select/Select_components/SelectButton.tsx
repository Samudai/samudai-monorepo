import clsx from 'clsx';
import './SelectButton.scss';

type SelectButtonProps = {
    arrow?: boolean;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

const SelectButton: React.FC<SelectButtonProps> = ({ className, children, arrow, ...props }) => {
    return (
        <button {...props} className={clsx('ui-select-button', className)} type="button">
            <div className="ui-select-button__content">{children}</div>
            {arrow && (
                <div className="ui-select-button__arrow" data-class="arrow">
                    <svg viewBox="0 0 14 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.2807 0.966797L7.93404 5.31346C7.4207 5.8268 6.5807 5.8268 6.06737 5.31346L1.7207 0.966797"
                            className="svg-stroke"
                            data-stroke
                            strokeWidth="1.5"
                            strokeMiterlimit="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}
        </button>
    );
};

export default SelectButton;
