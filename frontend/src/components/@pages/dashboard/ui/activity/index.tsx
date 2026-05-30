import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList } from 'store/features/common/slice';
import { useLazyGetActivityQuery } from 'store/services/Dashboard/dashboard';
import { activityResponse } from 'store/services/Dashboard/model';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { getTime } from 'utils/utils';
import { ActivityPopup } from './components';
import { ActivityItem, ActivitySkeleton } from './components';
import './activity.scss';

export const Activity: React.FC = () => {
    const { active, open, close } = usePopup();
    const [data, setData] = useState<any[]>([]);
    const [activityResponse, setActivityResponse] = useState<activityResponse>(
        {} as activityResponse
    );
    const { daoid } = useParams();
    const navigate = useNavigate();
    const [getActivity, { isLoading }] = useLazyGetActivityQuery();
    const [projects, setProject] = useState<any[]>([]);
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    // const [fetchData, loading] = useRequest(async function () {
    //   const { data } = await axios.get<any[]>('/mockup/activity.json');
    //   setData(data);
    // });

    const removeFirstWord = (str: any) => {
        const indexOfSpace = str.indexOf(' ');

        if (indexOfSpace === -1) {
            return '';
        }

        return str.substring(indexOfSpace + 1);
    };

    const afterActivity = (res: activityResponse) => {
        setActivityResponse(res);
        const data = res.data.map((item, id) => {
            return {
                idx: id,
                img: item.member.profile_picture,
                name: item.member.username,
                action: removeFirstWord(item.action.message),
                time: getTime(item.timestamp_property),
            };
        });
        const uniq: any = {};
        res.data.forEach((item) => {
            if (item.project_id) {
                uniq[item.project_id] = {
                    project_id: item.project_id,
                    project_name: item.project?.project_name,
                };
            }
        });
        const projects = Object.values(uniq).map((item: any) => item);
        setProject(projects);
        setData(data);
    };

    useEffect(() => {
        // fetchData();
        getActivity(daoid!, true)
            .unwrap()
            .then((res) => {
                setActivityResponse(res);
                const data = res.data.map((item, id) => {
                    return {
                        idx: id,
                        img: item.member.profile_picture,
                        name: item.member.username,
                        action: removeFirstWord(item.action.message),
                        time: getTime(item.timestamp_property),
                    };
                });
                const uniq: any = {};
                res.data.forEach((item) => {
                    if (item.project_id) {
                        uniq[item.project_id] = {
                            project_id: item.project_id,
                            project_name: item.project?.project_name,
                        };
                    }
                });
                const projects = Object.values(uniq).map((item: any) => item);
                setProject(projects);
                setData(data);
            })
            .catch(() => {
                setData([]);
            });

        getActivity(daoid!)
            .unwrap()
            .then((res) => {
                afterActivity(res);
            })
            .catch(() => {
                setData([]);
            });
    }, [daoid]);

    return (
        <Block className="activity" data-analytics-parent="activity-widget">
            <Block.Header>
                <Block.Title>Recent Activity</Block.Title>
                {data.length > 0 && <Block.Link onClick={open} />}
            </Block.Header>
            <Block.Scrollable>
                {data.length > 0 ? (
                    <Skeleton
                        className="activity__list"
                        component="ul"
                        loading={isLoading}
                        skeleton={<ActivitySkeleton />}
                    >
                        {data?.map(ActivityItem)}
                    </Skeleton>
                ) : (
                    <div className="act-empty">
                        <div className="act-empty__item">
                            <div className="act-empty__circle" />
                            <div className="act-empty__content">
                                <span className="act-empty__line" />
                                <span className="act-empty__line" />
                            </div>
                        </div>
                        <div className="act-empty__item">
                            <div className="act-empty__circle" />
                            <div className="act-empty__content">
                                <span className="act-empty__line" />
                                <span className="act-empty__line" />
                            </div>
                        </div>
                        <div className="act-empty__item">
                            <p className="act-empty__text">
                                Your Recent Activities will appear here.
                            </p>
                        </div>
                        {access && (
                            <div className="act-empty__item">
                                <Button
                                    className="act-empty__addBtn"
                                    color="orange-outlined"
                                    onClick={() => navigate(`/${daoid}/projects`)}
                                    data-analytics-click="activity_view_button_click"
                                >
                                    <span>Create a Project</span>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Block.Scrollable>
            <PopupBox className="reviewsActivity" active={active} onClose={close}>
                <ActivityPopup
                    projectsData={[
                        ...projects,
                        {
                            project_id: '',
                            project_name: 'All Activity',
                        },
                    ]}
                    activityData={activityResponse}
                    onClose={close}
                />
            </PopupBox>
        </Block>
    );
};
