import { StylesConfig } from 'react-select';
import colors from './colors';

export const selectStyles: StylesConfig<any> = {
    control: (base, state) => ({
        ...base,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 53,
        padding: '8px 20px',
        cursor: 'pointer',
        backgroundColor: colors.blackMain,
        borderRadius: 15,
        position: 'relative',
        zIndex: state.isFocused ? 100 : 2,
        outline: 'none',
        border: 'none',
        boxShadow: 'none',
        ':hover': {
            boxShadow: 'none',
            outline: 'none',
            border: 'none',
        },
    }),
    valueContainer: (base, state) => ({
        ...base,
        padding: 0,
        height: '100%',
        maxWidth: '300px',
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        // overflow: 'hidden auto',
    }),
    singleValue: (base) => ({
        display: 'flex',
        alignItems: 'center',
        width: '0',
        whiteSpace: 'nowrap',
    }),
    indicatorsContainer: () => ({
        padding: 0,
        display: 'flex',
        alignItems: 'center',
    }),
    indicatorSeparator: () => ({}),
    dropdownIndicator: () => ({
        svg: {
            width: 22,
            height: 22,
            fill: colors.darkGray,
        },
    }),
    menu: () => ({
        background: colors.blackMain,
        position: 'absolute',
        left: 0,
        top: 'calc(100% - 22px)',
        padding: '22px 0 0',
        borderRadius: '0 0 15px 15px',
        zIndex: 1,
        width: '100%',
    }),
    menuList: () => ({
        borderRadius: 'inherit',
        maxHeight: '200px',
        overflow: 'hidden auto',
    }),
    option: (_, state) => ({
        background: 'transparent',
        minHeight: '50px',
        maxHeight: '50px',
        height: '50px',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        ':hover': state.isSelected
            ? {}
            : {
                  backgroundColor: '#212325',
              },
        ':last-child': {
            borderRadius: 'inherit',
        },
        pointerEvents: state.isSelected ? 'none' : undefined,
        opacity: state.isSelected ? 0.3 : 1,
    }),
};
