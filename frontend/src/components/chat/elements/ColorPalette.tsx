import clsx from 'clsx';
import CloseButton from 'ui/@buttons/Close/Close';
import styles from '../styles/ColorPalette.module.scss';

interface ColorPaletteProps {
    className?: string;
    onClose?: () => void;
}

const colors = ['#111212', '#F9F2FF', '#FFD5AF', '#B2FFC3', '#FFE78C', '#AED4FF'];

const ColorPalette: React.FC<ColorPaletteProps> = ({ className, onClose }) => {
    return (
        <div className={clsx(styles.root, className)}>
            <CloseButton className={styles.closeBtn} onClick={onClose} />
            <h4 className={styles.title}>
                <div className={styles.titleIcon}>
                    <img src="/img/icons/change-colors.svg" alt="color" />
                </div>
                <span className={styles.titleText}>Change Colors</span>
            </h4>
            <div className={styles.body}>
                <ul className={styles.palette}>
                    {colors.map((color) => (
                        <li
                            key={color}
                            className={clsx(
                                styles.paletteItem,
                                color === colors[0] && styles.paletteItemActive
                            )}
                            style={{ backgroundColor: color }}
                        ></li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ColorPalette;
