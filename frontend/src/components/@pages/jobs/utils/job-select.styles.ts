import { StylesConfig } from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';

export const departmentSelectStyles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, state) => ({
        ...selectStyles.control?.(base, state),
        background: colors.black,
    }),
    menu: (base, state) => ({
        ...selectStyles.menu?.(base, state),
        background: colors.black,
        top: 'calc(100% + 12px)',
        borderRadius: 25,
        padding: '11px 17px',
    }),
    menuList: (base, state) => ({
        ...selectStyles.menuList?.(base, state),
        borderRadius: 0,
    }),
    option: (base, state) => ({
        ...selectStyles.option?.(base, state),
        borderRadius: 15,
        ':last-child': { borderRadius: 15 },
    }),
};

export const contactsSelectStyles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, state) => ({
        ...selectStyles.control?.(base, state),
        background: colors.black,
        paddingLeft: 55,
    }),
    menu: (base, state) => ({
        ...selectStyles.menu?.(base, state),
        background: colors.black,
        top: 'calc(100% + 12px)',
        borderRadius: 25,
        paddingBlock: 10,
    }),
    menuList: (base, state) => ({
        ...selectStyles.menuList?.(base, state),
        borderRadius: 0,
    }),
    input: (base, state) => ({
        ...selectStyles.input?.(base, state),
        color: colors.white,
    }),
};
