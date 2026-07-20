import { useEffect, useRef } from 'react';

interface TitleCellProps {
    className?: string;
    isToday?: boolean;
    children?: React.ReactNode;
    scrollIntoView?: (pos: number) => void;
}

const TitleCell: React.FC<TitleCellProps> = ({ className, isToday, children, scrollIntoView }) => {
    const ref = useRef<HTMLLIElement>(null);
    const scrolled = useRef(false);

    useEffect(() => {
        const element = ref.current;
        if (!scrolled.current && isToday && element && scrollIntoView) {
            scrollIntoView(element.offsetLeft);
        }
    }, [isToday]);

    return (
        <li ref={ref} className={className} data-today={isToday}>
            {children}
        </li>
    );
};

export default TitleCell;
