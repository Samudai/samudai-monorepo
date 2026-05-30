import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { changeUrl, selectUrl } from 'store/features/common/slice';
import { useAddMemberToDaoMutation } from 'store/services/Dao/dao';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/pipeline-form.module.scss';
import mixpanel from 'utils/mixpanel/mixpanelInit';

const MemberDao = () => {
    const loadUrl = useTypedSelector(selectUrl);
    const navigate = useNavigate();
    const [createMember] = useAddMemberToDaoMutation();
    const dispatch = useTypedDispatch();
    const { inviteid } = useParams();

    useEffect(() => {
        const fun = async () => {
            const path = window.location.pathname.split('/');
            try {
                const res = await createMember({
                    invite_code: path[path.length - 1] || path[path.length - 2],
                    member_id: getMemberId(),
                }).unwrap();
                if (res?.data?.dao_id) {
                    mixpanel.track('member_dao_invite_joined', {
                        dao_id: res?.data?.dao_id,
                        member_id: getMemberId(),
                        invite_code: path[path.length - 1] || path[path.length - 2],
                    });
                    dispatch(
                        changeUrl({
                            url: `/${res?.data?.dao_id}/dashboard/1`,
                        })
                    );
                    localStorage.setItem('daoInviteUrl', `/${res?.data?.dao_id}/dashboard/1`);
                    const isOnboarded = localStorage.getItem('isOnboarded');
                    if (isOnboarded === 'true') {
                        navigate(`/${res?.data?.dao_id}/dashboard/1`);
                    }
                } else {
                    toast(
                        'Failure',
                        5000,
                        'Please Login and Retry, This page will redirect to login in 5 seconds',
                        ''
                    )();
                    setTimeout(() => {
                        navigate('/login');
                    }, 5000);
                }
            } catch (err) {
                console.log(err);
                toast(
                    'Failure',
                    5000,
                    'Please Login and Retry, This page will redirect to login in 5 seconds',
                    ''
                )();
                setTimeout(() => {
                    navigate('/login');
                }, 5000);
            }
        };
        if (!getMemberId()) {
            const path = window.location.pathname.split('/');
            const inviteCode = path[path.length - 1] || path[path.length - 2];
            localStorage.setItem('daoInviteCode', inviteCode);
            localStorage.setItem('daoInviteUrl', `/dashboard/1`);
            console.log('Invite Code', inviteCode);
            toast(
                'Failure',
                5000,
                'Please Login and Retry with the same Link, This page will redirect to login in 5 seconds',
                ''
            )();
            setTimeout(() => {
                navigate('/login');
            }, 5000);
        } else {
            fun();
        }
    }, []);

    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
};

export default MemberDao;
