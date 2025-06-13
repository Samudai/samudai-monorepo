import colors from 'root/constants/colors';
import { StylesConfig } from 'react-select';
import { selectStyles } from 'root/constants/selectStyles';

export const gatingSelectStyles: StylesConfig<any> = {
    ...selectStyles,
    menu: (base, state) => ({
        ...selectStyles.menu?.(base, state),
        top: 'calc(100% + 16px)',
        borderRadius: 25,
        padding: '11px 16px',
    }),
    option: (base, state) => ({
        ...selectStyles.option?.(base, state),
        borderRadius: 15,
        background: state.isSelected ? colors.black : '',
        opacity: 1,
        p: state.isSelected
            ? {
                  color: colors.green,
              }
            : {},
        ':last-child': {
            borderRadius: 15,
        },
    }),
};
