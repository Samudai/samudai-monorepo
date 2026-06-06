import { dynamicPatternClassColors } from './dynamic-colors';
import './dynamic-colors.scss';

export const getDynamicClassColors = (name: string) => {
    const letter = name.slice(0, 1).toLowerCase();
    return (
        Object.entries(dynamicPatternClassColors).find(([letters]) => {
            return new RegExp(letter, 'i').test(letters);
        })?.[1] || ''
    );
};
