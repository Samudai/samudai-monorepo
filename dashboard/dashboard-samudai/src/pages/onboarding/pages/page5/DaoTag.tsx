import clsx from 'clsx';
import css from './page5.module.scss';
import { getTagData } from 'components/@pages/new-discovery/lib/utils';
import Sprite from 'components/sprite';

type DaoTagProps = {
    tag: string;
    onRemove?: () => void;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const DaoTag: React.FC<DaoTagProps> = ({ className, tag, onRemove, ...props }) => {
    const data = getTagData(tag);
    return (
        <div {...props} className={clsx(css.tags_item, className)}>
            <svg>
                <use href={`/img/sprites/discovery.svg${data.icon}`}></use>
            </svg>
            <div style={{ color: data.color || undefined }}>{data.name}</div>
            {onRemove && (
                <div className={css.close_btn} onClick={onRemove}>
                    <Sprite url="/img/sprite.svg#cross-circle" />
                </div>
            )}
        </div>
    );
};

export default DaoTag;
