import React, { useEffect, useRef, useState } from 'react';
import { MemberResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import clsx from 'clsx';
import { useLazySearchMemberQuery } from 'store/services/Search/Search';
import Input from 'ui/@form/Input/Input';
import Select from 'ui/@form/Select/Select';
import Highlighter from 'ui/Highlighter/Highlighter';
import { cutText } from 'utils/format';
import styles from './MessageCreate.module.scss';

interface SearchMemberProps {
    value: string;
    setValue: (value: string) => void;
    setMemberId?: (value: string) => void;
}

const SearchMember: React.FC<SearchMemberProps> = ({ value, setValue, setMemberId }) => {
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

    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        setMemberId?.('');
        if (!searchResults.length) {
            setActiveSelect(false);
        } else if (value.trim() && !activeSelect) {
            setActiveSelect(true);
        }
    };

    const handleClickSkill = (member: MemberResponse) => {
        if (!member?.default_wallet_address) return;
        setValue(member.default_wallet_address);
        setMemberId?.(member.member_id);
        setActiveSelect(false);
    };

    const fun = async () => {
        try {
            const res = await searchMember(value).unwrap();
            setSearchResults(res?.data || ([] as MemberResponse[]));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (value) {
            fun();
        }
    }, [value]);

    return (
        <div
            className={clsx('profile-setup__input-wrapper', styles.searchContainer)}
            ref={wrapperRef}
        >
            <Input
                value={value}
                placeholder="Wallet Address or Name"
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

export default SearchMember;
