import { useEffect, useRef, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { v4 as uuidv4 } from 'uuid';
import { TriviaNotification as Trivia } from 'ui/trivia-notification';
import css from './trivia-notifications.module.scss';

interface INotif {
    id: string;
    title: string;
    text: string;
}

const TriviaNotification = () => {
    const [notifications, setNotifications] = useState<INotif[]>([]);
    const queue = useRef<NodeJS.Timeout[]>([]);

    const memberType = localStorage.getItem('account_type');

    const addNotification = (title: string, text: string, duration: number, delay?: number) => {
        const fn = () => {
            const id = uuidv4();
            setNotifications((notifs) => [...notifs, { id, title, text }]);
            setTimeout(
                () => setNotifications((notifs) => notifs.filter((n) => n.id !== id)),
                duration
            );
        };

        if (!delay) return fn();

        const queueId = setTimeout(() => {
            fn();
            queue.current = queue.current.filter((id) => id !== queueId);
        }, delay);
    };

    const clearDelays = () => {
        queue.current.forEach((i) => clearTimeout(i));
        queue.current = [];
    };

    useEffect(() => {
        addNotification(
            'FORUMS PERFECT FOR DISCUSSIONS',
            'Notify and discuss with you community about all proposals at one place',
            5_000,
            10_000
        );

        if (memberType === 'contributor') {
            addNotification(
                'SET UP CONTRIBUTOR PROFILE',
                'Every Admin also have their own Contributor profile on Samudai',
                5_000,
                40_000
            );
        } else {
            addNotification(
                'EXPLORE OPPORTUNITIES',
                'Explore jobs, bounties all at one place opportunity',
                5_000,
                40_000
            );
        }

        addNotification(
            'CONNECT AND ENGAGE',
            'Connect with your peers, colleagues and bounty mates and form meaningful long-term relationships',
            5_000,
            100_000
        );

        addNotification(
            'ALL PROJECTS AT ONE PLACE',
            'Samudai organizes and collects all your project progress at one place',
            5_000,
            140_000
        );

        return () => clearDelays();
    }, [memberType]);

    useEffect(() => {
        return () => clearDelays();
    }, []);

    return (
        <ul className={css.list}>
            <TransitionGroup>
                {notifications.map((item) => (
                    <CSSTransition
                        timeout={200}
                        classNames={css}
                        key={item.title + item.text}
                        in={!!notifications.find((i) => i.id === item.id)}
                        mountOnEnter
                        unmountOnExit
                    >
                        <li className={css.list_item}>
                            <Trivia {...item} />
                        </li>
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </ul>
    );
};

export default TriviaNotification;
