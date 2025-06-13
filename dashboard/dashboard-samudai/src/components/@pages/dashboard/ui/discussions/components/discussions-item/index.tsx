import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DiscussionsMessage } from '../discussions-message';
import clsx from 'clsx';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';

export const DiscussionsItem: React.FC<DiscussionResponse> = ({
    participants,
    topic,
    discussion_id,
    messages = [],
}) => {
    const [active, setActive] = useState<boolean>(false);
    const mainRef = useRef<HTMLLIElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { daoid } = useParams();

    const onClickBtn = () => {
        setActive(!active);
    };
    const navigate = useNavigate();
    const onClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (target.closest('.dao-discussions-item') !== mainRef.current && active) {
            setActive(false);
        }
    };

    useEffect(() => {
        const contentEl = contentRef.current;
        if (contentEl) {
            contentEl.style.height = `${active ? contentEl.scrollHeight : 0}px`;
        }
        window.addEventListener('click', onClickOutside);
        return () => window.removeEventListener('click', onClickOutside);
    }, [active]);

    return (
        <li className={clsx('dao-discussions-item', { active })} ref={mainRef}>
            <div className="dao-discussions-item__wrapper">
                <button className="dao-discussions-item__btn" onClick={onClickBtn}>
                    <span className="dao-discussions-item__btn-circle"></span>
                    <p
                        className="dao-discussions-item__btn-topic"
                        onClick={() => navigate(`/${daoid}/forum/${discussion_id}`)}
                    >
                        {topic}
                    </p>
                    <div className="dao-discussions-item__btn-arrow">
                        <ArrowLeftIcon />
                    </div>
                </button>
                <div className="dao-discussions-item__messages" ref={contentRef}>
                    <ul className="dao-discussions-item__messages-list">
                        {messages.length > 0 &&
                            messages
                                ?.slice(0, 5)
                                .map((item) => (
                                    <DiscussionsMessage
                                        key={item.message_id}
                                        participants={participants}
                                        {...item}
                                    />
                                ))}
                    </ul>
                </div>
            </div>
        </li>
    );
};
