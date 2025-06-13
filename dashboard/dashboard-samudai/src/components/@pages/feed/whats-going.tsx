import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyGetTweetQuery } from 'store/services/Dashboard/dashboard';
import useRequest from 'hooks/useRequest';
import SettingsDropdown from 'ui/SettingsDropdown/SettingsDropdown';
import { TwitterItem } from '../dashboard';
import styles from './styles/whats-going.module.scss';

interface WhatsGoingProps {}

const WhatsGoing: React.FC<WhatsGoingProps> = (props) => {
    const [data, setData] = useState<any[]>([]);
    const { daoid } = useParams();
    const [getTweet] = useLazyGetTweetQuery();

    const [fetchData, loading] = useRequest(async function () {
        const res = await getTweet(daoid!, true).unwrap();
        setData(res?.data?.data || []);
    });

    useEffect(() => {
        fetchData();
    }, [daoid]);

    return (
        <div className={styles.wg}>
            <header className={styles.wg_head}>
                <h2 className={styles.wg_title}>What’s going on?</h2>
                <SettingsDropdown className={styles.wg_settings}>
                    <SettingsDropdown.Item>Item 1</SettingsDropdown.Item>
                    <SettingsDropdown.Item>Item 2</SettingsDropdown.Item>
                    <SettingsDropdown.Item>Item 3</SettingsDropdown.Item>
                </SettingsDropdown>
            </header>
            <ul className={styles.wg_list}>
                {data.length > 0 ? (
                    data?.slice(0, 2).map(TwitterItem)
                ) : (
                    <li className={styles.wg_no_tweets}>No tweets.</li>
                )}
            </ul>
        </div>
    );
};

export default WhatsGoing;
