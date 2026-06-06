import styles from './Loader.module.scss';
import clsx from 'clsx';

interface LoaderProps {
    text?: string;
    removeBg?: boolean;
    size?: number;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ text, removeBg, size, className }) => {
    const svgSize = size ? size : 164;

    return (
        <div className={clsx(styles.root, className)} data-loader>
            {!removeBg && (
                <div className={styles.logos}>
                    <picture>
                        <source srcSet="/img/loader.webp" type="image/webp" />
                        <img src="/img/loader.png" alt="loader" className={styles.logosImg} />
                    </picture>
                </div>
            )}
            <div className={styles.content}>
                <svg
                    className={styles.spinner}
                    viewBox="0 0 164 164"
                    width={svgSize}
                    height={svgSize}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        className={styles.spinnerPath}
                        fill="none"
                        cx="82"
                        cy="82"
                        r="59"
                        strokeWidth="23"
                    />
                    <defs>
                        <linearGradient
                            id="loader-gradient"
                            gradientUnits="userSpaceOnUse"
                            x1="18.57%"
                            y1="-9.77%"
                            x2="81.43%"
                            y2="109.77%"
                        >
                            <stop stopColor="#64F6ED" />
                            <stop offset="1.014" stopColor="#CDFD66" />
                        </linearGradient>
                    </defs>
                </svg>
                {!!text && <p className={styles.text}>{text}</p>}
            </div>
        </div>
    );
};

export default Loader;
