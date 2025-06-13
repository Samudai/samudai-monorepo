import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { changeUrl, selectUrl } from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/pipeline-form.module.scss';

const Invite = () => {
    const loadUrl = useTypedSelector(selectUrl);
    const navigate = useNavigate();
    const dispatch = useTypedDispatch();
    useEffect(() => {
        const path = window.location.pathname.split('/');

        const fun = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_GATEWAY}api/project/invite/access/${
                        path[path.length - 1] || path[path.length - 2]
                    }/${getMemberId()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                        },
                    }
                );

                if (data) {
                    dispatch(
                        changeUrl({
                            url: `/${data?.data?.link_id}/projects/${data?.data?.project_id}/board`,
                        })
                    );
                    navigate(`/${data?.data?.link_id}/projects/${data?.data?.project_id}/board`);
                }
            } catch (err) {
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
        fun();
    }, []);

    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
};

export default Invite;
