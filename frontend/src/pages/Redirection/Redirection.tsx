import Loader from 'components/Loader/Loader';
import styles from 'styles/pages/pipeline-form.module.scss';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLazyGetSubdomainQuery } from 'store/services/userProfile/userProfile';
import { useEffect } from 'react';

function Redirection() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [getSubdomain] = useLazyGetSubdomainQuery();
    const navigate = useNavigate();

    const member_id = searchParams.get('id');
    const type = searchParams.get('type');
    const value = searchParams.get('value');
    useEffect(() => {
        if (!!member_id && type === 'subdomain') {
            getSubdomain({ memberId: member_id, subdomain: value! })
                .unwrap()
                .then((res) => {
                    console.log(res.data.subdomain);
                    window.open(res.data.subdomain.redirection_link, '_self');
                });
        }
    }, [member_id]);

    return (
        <div className={styles.root}>
            <Loader />
        </div>
    );
}

export default Redirection;
