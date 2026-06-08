import { getColorClass } from './utils/findColorClass';
import clsx from 'clsx';
import { SkillHelper } from 'utils/helpers/SkillHelper';
import './UserSkill.scss';
import Sprite from 'components/sprite';

interface Departments {
    name: string;
    department_id: string;
}

type UserSkillProps = {
    skill: Departments;
    placeholder?: string;
    hideCross?: boolean;
    onRemove: (id: string) => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const UserDepartment: React.FC<UserSkillProps> = ({
    className,
    skill,
    placeholder,
    hideCross,
    onRemove,
    ...props
}) => {
    const firstLetter = skill.name.slice(0, 1);
    const created = SkillHelper.create(skill.name);

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
                    {skill.name}
                    {placeholder && <i> {placeholder}</i>}
                </p>
                {!hideCross && (
                    <div
                        className="ui-user-skill__closeBtn"
                        onClick={() => onRemove(skill.department_id)}
                    >
                        {/* <CloseButton /> */}
                        <Sprite url="/img/sprite.svg#cross-box" />
                    </div>
                )}
                {props.children}
            </div>
        </div>
    );
};

export default UserDepartment;
