import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectAccessList, selectActiveDao } from 'store/features/common/slice';
import { useLazyGetTweetQuery } from 'store/services/Dashboard/dashboard';
import usePopup from 'hooks/usePopup';
import useRequest from 'hooks/useRequest';
import { useTypedSelector } from 'hooks/useStore';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import Button from 'ui/@buttons/Button/Button';
import { TwitterConnectPopup, TwitterItem, TwitterSkeleton, TwitterTweetPopup } from './components';
import styles from './twitter.module.scss';

export const Twitter: React.FC = () => {
    const connectTwitterPopup = usePopup();
    const addTweetPopup = usePopup();
    const [getTweet] = useLazyGetTweetQuery();
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    // const { data: tweetData } = useGetTweetQuery(activeDAO);
    const [data, setData] = useState<any[]>([]);
    const [fetchData, loading] = useRequest(async function () {
        const res = await getTweet(daoid!, true).unwrap();
        setData(res?.data?.data || []);
    });

    const media = { '< 400': 'small' };
    const access = useTypedSelector(selectAccessList)?.[daoid!]?.includes(
        AccessEnums.AccessType.MANAGE_DAO
    );
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [daoid]);

    return (
        <Block media={media} className={styles.root} data-analytics-parent="twitter_widget">
            {data.length > 0 && false && (
                <Block.Header>
                    <Block.Title>
                        Twitter{' '}
                        <span
                            style={{ color: 'lightblue', fontSize: '0.5em', cursor: 'pointer' }}
                            onClick={addTweetPopup.open}
                        >
                            Add Tweet
                        </span>
                    </Block.Title>
                </Block.Header>
            )}
            <Block.Scrollable>
                <Skeleton
                    className={styles.skeleton}
                    loading={loading}
                    skeleton={<TwitterSkeleton />}
                >
                    {data.length > 0 ? (
                        <ul className={styles.list}>
                            {data.length > 0 && data?.slice(0, 2).map(TwitterItem)}
                        </ul>
                    ) : (
                        <div className={styles.empty}>
                            <img
                                className={styles.empty_img}
                                src="/img/twitter.svg"
                                alt="twitter"
                            />

                            <p className={styles.empty_text}>
                                {access
                                    ? 'Your Twitter Activity will appear here, connect Twitter now!'
                                    : 'Ask your Admin to Connect Twitter'}
                            </p>

                            {access && (
                                <Button
                                    className={styles.empty_connectBtn}
                                    color="orange-outlined"
                                    onClick={connectTwitterPopup.open}
                                    data-analytics-click="twitter_connect_settings_button"
                                >
                                    <span>Connect Twitter</span>
                                </Button>
                            )}

                            <div className={styles.empty_item}>
                                <span className={styles.empty_bigBlock} />
                                <span className={styles.empty_bigBlock} />
                                <span className={styles.empty_textBlock} />

                                <div className={styles.empty_row}>
                                    <span className={styles.empty_soc} />
                                    <span className={styles.empty_soc} />
                                    <span className={styles.empty_soc} />
                                </div>
                            </div>
                        </div>
                        // <div className={styles.preview}>
                        //     <h2 className={styles.previewTitle}>Twitter</h2>
                        //     {access && (
                        //         <button
                        //             className={styles.previewConnectBtn}
                        //             onClick={() =>
                        //                 navigate(`/${activeDAO}/settings/dao/integrations`)
                        //             }
                        //         >
                        //             <span>Add Twitter</span>
                        //         </button>
                        //     )}
                        //     <TwitterPreview className={styles.previewPreview} />
                        // </div>
                    )}
                </Skeleton>
            </Block.Scrollable>
            <PopupBox active={addTweetPopup.active} onClose={addTweetPopup.close}>
                <TwitterTweetPopup onClose={addTweetPopup.close} />
            </PopupBox>
            <PopupBox active={connectTwitterPopup.active} onClose={connectTwitterPopup.close}>
                <TwitterConnectPopup onClose={connectTwitterPopup.close} />
            </PopupBox>
        </Block>
    );
};
