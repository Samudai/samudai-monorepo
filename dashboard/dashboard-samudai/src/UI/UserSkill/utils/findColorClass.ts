import colors from './userSkillColors';

export function getColorClass(letter: string) {
    return (
        Object.entries(colors).find(([letters]) => {
            return new RegExp(letter, 'i').test(letters);
        })?.[1] || ''
    );
}
