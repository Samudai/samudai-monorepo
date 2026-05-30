import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { selectUrl } from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Loader from 'components/Loader/Loader';
import styles from 'styles/pages/pipeline-form.module.scss';

const Invite = () => {
    const loadUrl = useTypedSelector(selectUrl);
    const navigate = useNavigate();
    const dispatch = useTypedDispatch();
    const { inviteid } = useParams();
    useEffect(() => {
        localStorage.setItem('inviteid', inviteid || '');
        window.open(window.location.origin + '/login', '_self');
    }, []);

    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
};

export default Invite;
