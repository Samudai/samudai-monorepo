import { getColorClass } from './utils/findColorClass';
import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import { SkillHelper } from 'utils/helpers/SkillHelper';
import './UserSkill.scss';

type UserSkillProps = {
    skill: string;
    placeholder?: string;
    hideCross?: boolean;
    onRemove?: () => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const UserSkill: React.FC<UserSkillProps> = ({
    className,
    skill,
    placeholder,
    hideCross,
    onRemove,
    ...props
}) => {
    const firstLetter = skill.slice(0, 1);
    const created = SkillHelper.create(skill);

    return (
        <div {...props} className={clsx('ui-user-skill', className)}>
            <div className="ui-user-skill__container" data-role="us-container">
                {created.icon ? (
                    <div className="ui-user-skill__icon" data-role="icon">
                        <img src={created.icon} alt="icon" />
                    </div>
                ) : (
                    <div
                        className={clsx(
                            'ui-user-skill__icon',
                            '--custom-icon',
                            getColorClass(firstLetter)
                        )}
                        data-role="icon"
                    >
                        <span>{firstLetter}</span>
                    </div>
                )}
                <p className="ui-user-skill__name" data-role="name">
                    {skill}
                    {placeholder && <i> {placeholder}</i>}
                </p>
                {!hideCross && (
                    <div className="ui-user-skill__closeBtn" onClick={onRemove}>
                        <CloseButton />
                    </div>
                )}
                {props.children}
            </div>
        </div>
    );
};

export default UserSkill;
