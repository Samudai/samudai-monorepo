import { StylesConfig } from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import { selectStyles as selectStyles1 } from 'root/constants/selectStyles1';

export const selectRoleStyles: StylesConfig<any> = {
    ...selectStyles,
    control: (base, state) => ({
        ...base,
        ...selectStyles.control?.(base, state),
        padding: '8px 14px',
    }),
    input: (base, state) => ({
        ...base,
        ...selectStyles.input?.(base, state),
        color: colors.white,
    }),
    placeholder: (base, props) => ({
        ...base,
        ...selectStyles.placeholder?.(base, props),
        textTransform: 'capitalize',
    }),
    multiValue: (base) => ({
        display: 'flex',
        alignItems: 'center',
        background: colors.black,
        borderRadius: 8,
        padding: '6px 8px',
        margin: '2px',
    }),
    multiValueRemove: (base) => ({
        width: 16,
        height: 16,
        marginLeft: 8,
        svg: {
            display: 'none',
        },
        ':after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '100%',
            background: 'transparent',
            backgroundImage:
                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik02LjExMzI4IDkuODg2NjFMOS44ODY2MSA2LjExMzI4IiBzdHJva2U9IiNGREMwODciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik05Ljg4NjYxIDkuODg2NjFMNi4xMTMyOCA2LjExMzI4IiBzdHJva2U9IiNGREMwODciIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik01Ljk5OTY3IDE0LjY2NzNIOS45OTk2N0MxMy4zMzMgMTQuNjY3MyAxNC42NjYzIDEzLjMzNCAxNC42NjYzIDEwLjAwMDdWNi4wMDA2NUMxNC42NjYzIDIuNjY3MzIgMTMuMzMzIDEuMzMzOTggOS45OTk2NyAxLjMzMzk4SDUuOTk5NjdDMi42NjYzNCAxLjMzMzk4IDEuMzMzMDEgMi42NjczMiAxLjMzMzAxIDYuMDAwNjVWMTAuMDAwN0MxLjMzMzAxIDEzLjMzNCAyLjY2NjM0IDE0LjY2NzMgNS45OTk2NyAxNC42NjczWiIgc3Ryb2tlPSIjRkRDMDg3IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L3N2Zz4NCg==)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
    }),
    multiValueLabel: () => ({
        color: colors.white,
    }),
    clearIndicator: (base) => ({
        width: 16,
        height: 16,
        marginRight: 4,
        svg: {
            display: 'none',
        },
        ':after': {
            content: '""',
            display: 'block',
            width: '100%',
            height: '100%',
            background: 'transparent',
            backgroundImage:
                'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik02LjExMzI4IDkuODg2NjFMOS44ODY2MSA2LjExMzI4IiBzdHJva2U9IiM1MjU4NUUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik05Ljg4NjYxIDkuODg2NjFMNi4xMTMyOCA2LjExMzI4IiBzdHJva2U9IiM1MjU4NUUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4NCjxwYXRoIGQ9Ik01Ljk5OTY3IDE0LjY2NzNIOS45OTk2N0MxMy4zMzMgMTQuNjY3MyAxNC42NjYzIDEzLjMzNCAxNC42NjYzIDEwLjAwMDdWNi4wMDA2NUMxNC42NjYzIDIuNjY3MzIgMTMuMzMzIDEuMzMzOTggOS45OTk2NyAxLjMzMzk4SDUuOTk5NjdDMi42NjYzNCAxLjMzMzk4IDEuMzMzMDEgMi42NjczMiAxLjMzMzAxIDYuMDAwNjVWMTAuMDAwN0MxLjMzMzAxIDEzLjMzNCAyLjY2NjM0IDE0LjY2NzMgNS45OTk2NyAxNC42NjczWiIgc3Ryb2tlPSIjNTI1ODVFIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L3N2Zz4NCg==)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
    }),
    menu: (base, state) => ({
        ...base,
        ...selectStyles.menu?.(base, state),
        top: '100%',
        padding: '12px 0',
        borderRadius: 25,
    }),
    option: (base, state) => ({
        ...base,
        ...selectStyles.option?.(base, state),
        borderRadius: 8,
        ':last-child': {
            borderRadius: 8,
        },
        ':hover': state.isSelected
            ? {}
            : {
                  backgroundColor: colors.black,
              },
    }),
    valueContainer: (base, props) => ({
        ...selectStyles.valueContainer?.(base, props),
        display: 'flex',
        justifyContent: 'flex-start',
        maxWidth: 'none',
        marginRight: '10px',
    }),
};

export const selectRoleStyles1: StylesConfig<any> = {
    ...selectStyles1,
    control: (base, state) => ({
        ...base,
        ...selectStyles1.control?.(base, state),
        padding: '8px 14px',
    }),
    input: (base, state) => ({
        ...base,
        ...selectStyles1.input?.(base, state),
        color: colors.white,
    }),
    multiValue: (base) => ({
        display: 'flex',
        alignItems: 'center',
        background: colors.black,
        borderRadius: 15,
        padding: '5px 12px',
        margin: '2px',
    }),
    multiValueRemove: (base) => ({
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        svg: {
            fill: colors.darkGray,
        },
    }),
    multiValueLabel: () => ({
        color: colors.white,
    }),
    clearIndicator: (base) => ({
        ...base,
        svg: {
            transition: 'fill .1s ease-out',
            fill: colors.darkGray,
        },
        ':hover svg': {
            fill: colors.white,
        },
    }),
    menu: (base, state) => ({
        ...base,
        ...selectStyles1.menu?.(base, state),
        top: '100%',
        padding: '12px 0',
        borderRadius: 25,
    }),
    option: (base, state) => ({
        ...base,
        ...selectStyles1.option?.(base, state),
        borderRadius: 15,
        ':last-child': {
            borderRadius: 15,
        },
        ':hover': state.isSelected
            ? {}
            : {
                  backgroundColor: colors.black,
              },
    }),
};
