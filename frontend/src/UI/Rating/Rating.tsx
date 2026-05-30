import clsx from 'clsx';
import Star from 'ui/SVG/Star';
import './Rating.scss';

interface RatingProps {
    rate: number;
    className?: string;
}

const Rating: React.FC<RatingProps> = ({ rate, className }) => {
    const countFilled = Math.max(0, Math.min(5, Math.floor(rate)));
    return (
        <div className={clsx('rating', className)}>
            {Array.from({ length: 5 })
                .map((_, idx) => idx + 1)
                .map((idx) => (
                    <Star
                        key={idx}
                        className={clsx('rating__star', { filled: countFilled >= idx })}
                    />
                ))}
        </div>
    );
};

export default Rating;
