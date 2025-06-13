import React, { useEffect, useRef, useState } from 'react';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import clsx from 'clsx';
import { useLazySearchMemberQuery } from 'store/services/Search/Search';
import Input from 'ui/@form/Input/Input';
import Select from 'ui/@form/Select/Select';
import Highlighter from 'ui/Highlighter/Highlighter';
import { cutText } from 'utils/format';
import styles from './MessageCreate.module.scss';
import useDelayedSearch from 'hooks/useDelayedSearch';

interface SearchMemberByNameProps {
    value: string;
    setValue: (value: string) => void;
    setMemberId: (value: string) => void;
}

const SearchMemberByName: React.FC<SearchMemberByNameProps> = ({
    value,
    setValue,
    setMemberId,
}) => {
    const [searchResults, setSearchResults] = useState<MemberResponse[]>([]);
    const [activeSelect, setActiveSelect] = useState<boolean>(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const [searchMember] = useLazySearchMemberQuery();

    const handleClickOutside = (e: MouseEvent) => {
        const wrapperEl = wrapperRef.current;
        if (wrapperEl && !e.composedPath().includes(wrapperEl)) {
            setActiveSelect(false);
        }
    };

    const handleShowSelect = () => {
        if (searchResults.length) {
            setActiveSelect(true);
        }
    };

    const handleSearch = async (value: string) => {
        try {
            const res = await searchMember(value).unwrap();
            setSearchResults(res?.data || ([] as MemberResponse[]));
        } catch (err) {
            console.error(err);
        }
    };

    const delayedSearch = useDelayedSearch((search: string) => {
        const value = search.trim().toLowerCase();
        handleSearch(value);
    }, 500);

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        delayedSearch(value);
    };

    const handleClickSkill = (member: MemberResponse) => {
        if (!member.member_id) return;
        setValue(member?.name || member.member_id);
        setMemberId(member.member_id);
        setActiveSelect(false);
    };

    // useEffect(() => {
    //     if (!!value) {
    //         fun();
    //     }
    // }, [value]);

    useEffect(() => {
        if (!searchResults.length) {
            setActiveSelect(false);
        } else {
            setActiveSelect(true);
        }
    }, [searchResults]);

    return (
        <div
            className={clsx('profile-setup__input-wrapper', styles.searchContainer)}
            ref={wrapperRef}
        >
            <Input
                value={value}
                placeholder="Name"
                onChange={handleChangeValue}
                onClick={handleShowSelect}
                data-analytics-click="wallet_address_input"
            />
            <Select.List
                className={styles.setup__select}
                active={activeSelect}
                onClickOutside={handleClickOutside}
                maxShow={3}
            >
                {searchResults.map((item) => (
                    <Select.Item
                        className={styles.profile_setup}
                        key={item.default_wallet_address}
                        onClick={() => handleClickSkill(item)}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'row',
                                width: '100%',
                            }}
                        >
                            <div className={styles.selectItemImg}>
                                <img
                                    src={item?.profile_picture || '/img/icons/user-4.png'}
                                    alt="avatar"
                                    className={styles.img_cover}
                                />
                            </div>
                            <p className={styles.selectItemName}>
                                <Highlighter search={value} text={cutText(item.name!, 30)} />
                            </p>
                        </div>
                    </Select.Item>
                ))}
            </Select.List>
        </div>
    );
};

export default SearchMemberByName;
