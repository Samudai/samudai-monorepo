import colors from 'root/constants/colors';
import { StylesConfig } from 'react-select';
import { selectStyles } from 'root/constants/selectStyles';

export const eventCreateStyles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, state) => ({
        ...selectStyles.control?.(base, state),
        background: colors.black,
    }),
    dropdownIndicator: () => ({ display: 'none' }),
    menu: (base, state) => ({
        ...selectStyles.menu?.(base, state),
        top: 'calc(100% + 12px)',
        borderRadius: 15,
        padding: '12px 0',
    }),
};
