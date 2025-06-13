import layout from 'root/data/view/layout';
import { IView } from 'utils/types/DAO';
// Remove in prod (and from initial state).
// It will fetch from database
const initialView: IView = {
    id: '1',
    is_private: false,
    name: 'View 1',
    widgets: layout,
};

const initialState = {
    activeViewId: '1',
    views: [initialView] as IView[],
};

export type DaoSliceState = typeof initialState;
export default initialState;
