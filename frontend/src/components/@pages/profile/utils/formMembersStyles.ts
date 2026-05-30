import { StylesConfig } from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';

export const formMembersStyles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, state) => ({
        ...selectStyles.control?.(base, state),
        background: '#17191A',
    }),
    menu: (base, state) => ({
        ...selectStyles.menu?.(base, state),
        position: 'relative',
        left: 'auto',
        top: 'auto',
    }),
    menuList: (base, state) => ({
        ...selectStyles.menuList?.(base, state),
        maxHeight: 150,
        overflow: 'hidden',
    }),
    input: (base, state) => ({
        ...selectStyles.input?.(base, state),
        color: colors.green,
    }),
    dropdownIndicator: () => ({ display: 'none' }),
};
