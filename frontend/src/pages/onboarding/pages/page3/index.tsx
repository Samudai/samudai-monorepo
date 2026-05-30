import React, { useState, useRef, useEffect } from 'react';
import css from './page3.module.scss';
import PenIcon from 'ui/SVG/PenIcon';
import { useAddNameMutation } from 'store/services/Login/login';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { profileImages } from 'components/@popups/MessageCreate/constants';

interface Page3Props {
    callback: () => void;
}

const Page3: React.FC<Page3Props> = ({ callback }) => {
    const [name, setName] = useState<string>('');
    const ref = useRef<HTMLInputElement>(null);
    const member_type = localStorage.getItem('account_type');
    const discordName = localStorage.getItem('discord_name');

    const [addName] = useAddNameMutation();

    const handleEdit = () => {
        ref.current?.focus();
    };

    const handleClick = async () => {
        try {
            await addName({
                linkId: getMemberId(),
                stepId: 'ADD_NAME',
                value: {
                    name: name,
                    profile_picture:
                        profileImages[Math.floor(Math.random() * profileImages.length)],
                    type_of_member: member_type!,
                },
            });
            if (member_type === 'admin') {
                callback();
            } else {
                localStorage.setItem('enablesType', 'contributor');
                window.location.reload();
                window.location.href = `/loading`;
            }
        } catch (err) {
            toast('Failure', 5000, 'Failed to change user name. Please try again.', '')();
        }
    };

    useEffect(() => {
        if (discordName) setName(discordName);
    }, [discordName]);

    return (
        <div className={css.container}>
            <div className={css.subTitle}>DISCORD CONNECTED SUCCESSFULLY</div>
            <div className={css.input}>
                <div>Welcome to Samudai,&nbsp;</div>
                <input
                    ref={ref}
                    size={15}
                    className={css.input_text}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleEdit}>
                    <PenIcon />
                </button>
            </div>
            <div className={css.msg}>Tap to edit the name, we like this one tho :)</div>
            <button className={css.button} onClick={handleClick}>
                Next Step: {member_type === 'admin' ? 'Set Up DAO' : 'Your Profile'}
            </button>
        </div>
    );
};

export default Page3;
