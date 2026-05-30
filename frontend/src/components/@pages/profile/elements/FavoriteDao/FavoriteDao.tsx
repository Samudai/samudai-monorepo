import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyGetFavDaosQuery } from 'store/services/Discovery/Discovery';
import Block from 'components/Block/Block';
import { toast } from 'utils/toast';
import FavoriteDaoItem from './FavoriteDaoItem';
import '../../styles/FavoriteDao.scss';

const FavoriteDao: React.FC = () => {
    const [data, setData] = useState<any[]>([]);
    const [getFavoriteDaos] = useLazyGetFavDaosQuery();
    const { memberid } = useParams();

    useEffect(() => {
        const fun = async () => {
            try {
                const res = await getFavoriteDaos(memberid!, true).unwrap();
                setData(res?.data?.favourite_list || []);
            } catch (err) {
                toast('Failure', 5000, 'Error in fetching favourite DAOs', '');
            }
        };
        fun();
    }, [memberid]);

    return (
        <Block className="favorite-dao">
            <Block.Header>
                <Block.Title>Favorite DAOs</Block.Title>
                {/* <Block.Link /> */}
            </Block.Header>
            <Block.Scrollable className="favorite-dao__list" component="ul">
                {!!data &&
                    data.length > 0 &&
                    data.map((dao) => <FavoriteDaoItem {...dao} key={dao.id} />)}
                {!!data && data.length === 0 && (
                    <div
                        className="transactions__header"
                        style={{
                            marginTop: '20px',
                            color: '#fdc087',
                            padding: '50px 0',
                            textAlign: 'center',
                        }}
                    >
                        No Favourite DAOs
                    </div>
                )}
            </Block.Scrollable>
        </Block>
    );
};

export default FavoriteDao;
