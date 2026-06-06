import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useInput from 'hooks/useInput';
import { HatButton, HatInfo } from 'components/chat/elements/Components';
import Content from 'components/chat/elements/Content';
import ControlPanel from 'components/chat/elements/ControlPanel';
import Hat from 'components/chat/elements/Hat';
import Settings from 'components/chat/elements/Settings';
import Sidebar from 'components/chat/elements/Sidebar';
import Workspace from 'components/chat/elements/Workspace';
import Button from 'ui/@buttons/Button/Button';
import InformationIcon from 'ui/SVG/InformationIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import styles from '../styles/Clans.module.scss';
import { SidebarSkeleton } from '../sidebar-skeleton';

interface ClansProps {}

const data = [
    {
        id: '1',
        name: 'Best Designers',
        img: '/mockup/img/clan-logo-1.png',
        time: Date.now() - 1000 * 600,
        messages: 99,
    },
    {
        id: '2',
        name: 'Best Developers',
        img: '/mockup/img/clan-logo-2.png',
        time: Date.now() - 1000 * 750,
        messages: 129,
    },
    {
        id: '3',
        name: 'Best Animators',
        img: '/mockup/img/clan-logo-3.png',
        time: Date.now() - 1000 * 100,
        messages: 12,
    },
];

const Clans: React.FC<ClansProps> = (props) => {
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [value, setValue] = useInput<HTMLTextAreaElement>('');
    const [search, setSearch] = useState<string>('');
    const listRef = useRef<HTMLUListElement>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        const list = listRef.current;
        if (list) {
            list.scrollTop = list.scrollHeight;
        }
    }, []);

    return (
        <div
            className={clsx(styles.chat, activeChat !== null && styles.chat_active)}
            data-analytics-page="messages_clans"
        >
            <Sidebar
                title="All Messages"
                className={styles.sidebar}
                classNameHead={styles.sidebarHead}
                searchProps={{
                    placeholder: 'Search chat',
                    value: search,
                    onChange: handleSearchChange,
                }}
                controls={
                    <Button color="green" className={styles.createNewBtn}>
                        <PlusIcon />
                        <span>Create New</span>
                    </Button>
                }
            >
                {data.length === 0 && <SidebarSkeleton />}
                {data
                    .sort((i1, i2) => i2.time - i1.time)
                    .map((item) => (
                        <Sidebar.Item
                            type="clan"
                            key={item.id}
                            data={item}
                            onClick={setActiveChat.bind(null, item.id)}
                        />
                    ))}
            </Sidebar>
            <Content className={styles.content}>
                <Hat className={styles.hat}>
                    <HatInfo
                        img="/mockup/img/clan-logo-1.png"
                        text="Best designers"
                        members="11 members"
                    />
                    <div className={styles.hatRight}>
                        <HatButton
                            text="Clan info"
                            icon={<InformationIcon />}
                            className={styles.hatInfoBtn}
                        />
                        <Settings>
                            <Settings.Item icon="/img/icons/information.svg" title="Clan info" />
                            <Settings.Item
                                icon="/img/icons/off-notifications.svg"
                                title="Turn off notifications"
                            />
                            <Settings.Item
                                icon="/img/icons/change-colors.svg"
                                title="Change colors"
                            />
                            <Settings.Item
                                icon="/img/icons/view-attachments.svg"
                                title="View Attachments"
                            />
                            <Settings.Item
                                icon="/img/icons/delete-history.svg"
                                title="Delete history"
                            />
                        </Settings>
                    </div>
                </Hat>
                <Workspace>
                    <ul className={clsx(styles.messages, 'orange-scrollbar')} ref={listRef}>
                        {/* {messagesData.map((message, id, arr) => (
              <Message
                showAvatar
                key={message.id}
                me={message.id === '2'}
                data={message}
              />
            ))} */}
                    </ul>
                    <ControlPanel className={styles.panel} value={value} onChange={setValue} />
                </Workspace>
            </Content>
        </div>
    );
};

export default Clans;
