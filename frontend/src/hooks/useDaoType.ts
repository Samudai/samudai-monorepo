import { useTypedSelector } from './useStore';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';

export const useDaoType = () => {
    const activeDao = useTypedSelector(selectActiveDao);
    const accessActiveDao = useTypedSelector(selectAccessList)?.[activeDao!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );

    return accessActiveDao ? 'Admin' : 'Contributor';
};
