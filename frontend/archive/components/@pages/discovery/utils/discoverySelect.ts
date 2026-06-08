import { StylesConfig } from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';

export const discoverySelect: StylesConfig<any> = {
  ...selectStyles,
  dropdownIndicator: () => ({
    display: 'none',
  }),
  control: (base, state) => ({
    ...selectStyles.control?.(base, state),
    backgroundColor: colors.black,
    borderRadius: 15,
    padding: '12px 24px',
  }),
  placeholder: (base) => ({
    ...base,
    color: colors.darkGray,
  }),
  input: (base) => ({
    ...base,
    color: colors.green,
  }),
  menu: (base, state) => ({
    ...selectStyles.menu?.(base, state),
    backgroundColor: colors.black,
  }),
};
