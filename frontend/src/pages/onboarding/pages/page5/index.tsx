import Input from 'ui/@form/Input/Input1';
import { useEffect, useState } from 'react';
import css from './page5.module.scss';
import DaoTypeSelect from './DaoTypeSelect';
import { toast } from 'utils/toast';
import { usePrivy } from '@privy-io/react-auth';
import { useGetDaoTagsQuery } from 'store/services/Discovery/Discovery';

interface Page5Props {
    type: 'contributor' | 'admin';
    callback: (name: string, email: string, daoName: string, tags: string[]) => Promise<void>;
}

const Page5: React.FC<Page5Props> = ({ type, callback }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isPrivy, setIsPrivy] = useState(false);
    const [daoName, setDaoName] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const { user } = usePrivy();
    const { data: allTags } = useGetDaoTagsQuery();

    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const handleAddTag = (tag: string) => {
        setTags((tags) => [...tags, tag]);
    };

    const handleRemoveTag = (tag: string) => {
        setTags((tags) => tags.filter((t) => t !== tag));
    };

    const handleClick = () => {
        if (!name) return toast('Attention', 5000, 'Please enter your good name.', '');
        if (!email) return toast('Attention', 5000, 'Please enter your email.', '');
        if (!regex.test(email)) {
            return toast('Attention', 5000, 'Please enter a valid email address.', '');
        }
        if (type === 'admin' && !daoName)
            return toast('Attention', 5000, 'Please enter your DAO name.', '');
        if (type === 'admin' && !tags.length)
            return toast('Attention', 5000, 'Please select atlease one dao type.', '');

        callback(name, email, daoName, tags);
    };

    useEffect(() => {
        if (user?.email) {
            setEmail(user?.email.address);
            setIsPrivy(true);
        } else if (user?.google) {
            setEmail(user?.google.email);
            setIsPrivy(true);
        }
    }, [user]);

    return (
        <div className={css.container}>
            <div className={css.header}>DETAILS</div>
            <ul className={css.questions}>
                <li className={css.questions_list}>
                    <div className={css.questions_title}>What’s your good name?</div>
                    <Input
                        className={css.questions_input}
                        style={{ fontSize: '18px' }}
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </li>
                <li className={css.questions_list}>
                    <div className={css.questions_title}>What's your email?</div>
                    <Input
                        className={css.questions_input}
                        style={{ fontSize: '18px' }}
                        placeholder="Your Email"
                        value={email}
                        disabled={isPrivy}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </li>
                {type === 'admin' && (
                    <>
                        <li className={css.questions_list}>
                            <div className={css.questions_title}>What’s your DAO Name?</div>
                            <Input
                                className={css.questions_input}
                                style={{ fontSize: '18px' }}
                                placeholder="DAO Name"
                                value={daoName}
                                onChange={(e) => setDaoName(e.target.value)}
                            />
                        </li>
                        <li className={css.questions_list}>
                            <div className={css.questions_title}>What type of DAO?</div>
                            <DaoTypeSelect
                                skills={tags}
                                hints={allTags?.data?.tags || []}
                                onAddSkill={handleAddTag}
                                onRemoveSkill={handleRemoveTag}
                                placeholder="Investment, Service, NFT, Research"
                            />
                        </li>
                    </>
                )}
            </ul>
            <button className={css.footer_button} onClick={handleClick}>
                Continue
            </button>
        </div>
    );
};

export default Page5;
