import { StylesConfig } from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';

export const addPeopleStyles: StylesConfig<any> = {
    ...selectStyles,
    menu: (base, state) => ({
        ...selectStyles.menu?.(base, state),
        paddingTop: 15,
        position: 'relative',
        left: 'auto',
        top: 'auto',
        background: '#1C1C1C',
    }),
    input: (base, state) => ({
        ...base,
        ...selectStyles.input?.(base, state),
        color: colors.green,
    }),
    menuList: (base, state) => ({
        ...selectStyles.menuList?.(base, state),
        maxHeight: 150,
        overflow: 'hidden auto',
    }),
    option: (base, state) => ({
        ...selectStyles.option?.(base, state),
        borderRadius: 15,
    }),
    dropdownIndicator: () => ({ display: 'none' }),
};
