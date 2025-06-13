import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { selectRoleStyles } from './utils/select-role.styles';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';
import { roles } from 'store/services/Settings/model';
import useDelayedSearch from 'hooks/useDelayedSearch';
import { useTypedSelector } from 'hooks/useStore';
import { FormDataType } from 'pages/settings/dao/access-managment';
import styles from './styles/SelectMembers.module.scss';
import { IMember } from '@samudai_xyz/gateway-consumer-types';

interface SelectMembersProps {
    roles: roles[];
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    id: 'dao' | 'project' | 'job' | 'payment' | 'view';
    formData: FormDataType;
}
// interface IMember {
//   member_id: string;
//   profile_picture: string | null;
//   username: string;
// }

const SelectMembers: React.FC<SelectMembersProps> = ({ roles, setFormData, id, formData }) => {
    const [defaultOptions, setDefaultOptions] = useState<IMember[]>([]);
    const [search, setSearch] = useState('');
    const activeDAO = useTypedSelector(selectActiveDao);
    const [members, setMembers] = useState<IMember[]>([] as IMember[]);
    const [searchDaoMember] = useLazySearchMemberByDaoQuery();
    const { daoid } = useParams();

    useEffect(() => {
        setDefaultOptions([...formData[id].members]);
    }, [formData, id, daoid, activeDAO]);

    const handleSearch = async (value: string) => {
        try {
            const res = await searchDaoMember({ daoId: activeDAO, value: value }).unwrap();
            setMembers(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const delayedSearch = useDelayedSearch((search: string) => {
        const value = search.trim().toLowerCase();
        handleSearch(value);
    }, 500);

    const handleInputChange = (value: string) => {
        setSearch(value);
        delayedSearch(value);
    };

    const handleChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            [id]: {
                roles: formData[id].roles,
                members: Array.isArray(e) ? e.map((x) => x) : [],
            },
        }));
    };

    useEffect(() => {
        const fn = async () => {
            const res = await searchDaoMember({ daoId: activeDAO, value: '' }).unwrap();
            setMembers(res.data || []);
        };
        if (activeDAO) {
            fn();
        }
    }, [activeDAO]);

    console.log(members);

    return (
        <div className={styles.root}>
            <h3 className={styles.suptitle}>Members</h3>
            <Select
                defaultValue={defaultOptions}
                value={formData[id].members}
                classNamePrefix="rs"
                className={styles.selectRole}
                inputValue={search}
                isClearable={true}
                isMulti={true}
                onInputChange={handleInputChange}
                onChange={handleChange}
                options={members
                    .filter(
                        (item) =>
                            !formData[id].members.map((m) => m.member_id).includes(item.member_id)
                    )
                    .map((item) => ({
                        ...item,
                        value: item.member_id,
                        label: item.username,
                    }))}
                styles={selectRoleStyles}
                placeholder="select members"
                formatOptionLabel={(user: IMember) => (
                    <div className={styles.content} key={user.member_id}>
                        <div className={styles.contentImg} data-select-avatar>
                            <img
                                src={user.profile_picture || '/img/icons/user-4.png'}
                                alt="avatar"
                                className="img-cover"
                            />
                        </div>
                        <p className={styles.contentName} data-select-name>
                            {user.username}
                            {/* <Highlighter search={search} text={user.username} /> */}
                        </p>
                    </div>
                )}
            />
        </div>
    );
};

export default SelectMembers;
