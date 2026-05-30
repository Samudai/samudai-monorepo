import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select, { components } from 'react-select';
import SidebarDao from './elements/SidebarDao';
import SidebarOverview from './elements/SidebarOverview';
import clsx from 'clsx';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import { members } from 'root/members';
import { selectApp } from 'store/features/app/slice';
import { setMemberData } from 'store/features/common/slice';
import { searchRes, searchVal } from 'store/services/Search/Model';
import { useLazyUniversalSearchQuery } from 'store/services/Search/Search';
import {
  useGetMemberByIdMutation,
  useLazyGetConnectionsByMemberIdQuery,
} from 'store/services/userProfile/userProfile';
import useDebounce from 'hooks/useDebounce';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Highlighter from 'ui/Highlighter/Highlighter';
import Magnifier from 'ui/SVG/Magnifier';
import SupportIcon from 'ui/SVG/SupportIcon';
import LogoutIcon from 'ui/SVG/logout.icon';
import { cutText } from 'utils/format';
import { getMemberId } from 'utils/utils';
import './styles/Sidebar.scss';

interface SidebarProps {
  mini?: boolean;
  className?: string;
  onFocus?: (focus: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mini, className, onFocus }) => {
  const { daoid, memberid } = useParams();
  const [fetchUserProfile, {data}] = useGetMemberByIdMutation({
    fixedCacheKey : memberid,
  });
  const [getConnections] = useLazyGetConnectionsByMemberIdQuery();
  const dispatch = useTypedDispatch();
  const memberId = getMemberId();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const { sidebarActive } = useTypedSelector(selectApp);
  const [searchAll] = useLazyUniversalSearchQuery();
  const [searchResults, setSearchResults] = useState<searchVal[]>([]);

  require('dotenv').config();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/signup');
  };

  const AfterFetch = (res: any) => {
    getConnections(memberId,true)
    .unwrap()
    .then((connData) => {
      dispatch(
        setMemberData({ member: res.data!.member, connections: connData.data })
      );
    })
  }

  useEffect(() => {
    const fn = async () => {

      if(data){
        AfterFetch(data);
      }
      else{
        fetchUserProfile({
          member: { type: 'member_id', value: memberId },
        }).unwrap()
        .then((data) => {
          AfterFetch(data);
        })
      }
      // const connectionsData = [...rData?.data.connections, ...sData?.data.connections];
    };
    fn();
  }, [memberid]);

  const fun = async () => {
    try {
      const res = await searchAll(searchValue).unwrap();
      setSearchResults(res?.data || ([] as searchVal[]));
    } catch (err) {
      console.error(err);
    }
  };

  const searchFun = useDebounce(fun, 500);
  useEffect(() => {
    if (!!searchValue) {
      fun();
      // searchFun(undefined);
    }
  }, [searchValue]);

  return sidebarActive ? (
    <aside className={clsx('sidebar', className, { mini })}>
      <header className="sidebar__header" data-class="head">
        <img
          src={require('images/logo.png')}
          alt="logo"
          style={{ cursor: 'pointer' }}
          onClick={() => window.open('https://www.samudai.xyz', '_blank')}
        />
      </header>
      <div className="sidebar__search" data-class="search">
        <Magnifier className="sidebar__searchMagnifier" />
        <Select
          value={null}
          inputValue={searchValue}
          onInputChange={setSearchValue}
          classNamePrefix="rs"
          placeholder="Search Contributors/DAOs"
          styles={{
            ...selectStyles,
            control: (base, state) => ({
              ...selectStyles.control?.(base, state),
              minWidth: mini ? 60 : 'auto',
              maxWidth: mini ? 60 : '100%',
              backgroundColor: colors.black,
            }),
            input: (base, state) => ({
              ...selectStyles.input?.(base, state),
              color: colors.white,
            }),
            menu: (base, state) => ({
              ...selectStyles.menu?.(base, state),
              backgroundColor: '#1C1C1C',
            }),
            menuList: (base, state) => ({
              ...selectStyles.menuList?.(base, state),
              paddingBlock: 12,
            }),
            option: (base, state) => ({
              ...selectStyles.option?.(base, state),
              borderRadius: 15,
              ':last-child': { borderRadius: 15 },
            }),
            valueContainer: (base, state) => ({
              ...selectStyles.valueContainer?.(base, state),
              paddingLeft: 30,
            }),
            dropdownIndicator: () => ({ display: 'none' }),
          }}
          className="sidebar__select"
          options={searchResults.map((res) => ({
            value: res.id,
            label: res.name,
            ...res,
          }))}
          onChange={(e: searchVal) => {
            if (e?.type === 'dao') {
              navigate(`/${e.id}/dashboard/1`);
            } else {
              navigate(`/${e.id}/profile`);
            }
          }}
          formatOptionLabel={(candidate) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <div className="sidebar__selectItemImg">
                <img
                  src={candidate?.profile_picture || '/img/icons/user-4.png'}
                  alt="avatar"
                  className="img-cover"
                />
              </div>
              <p className="sidebar__selectItemName">
                <Highlighter search={searchValue} text={cutText(candidate.name, 30)} />
              </p>
              <div
                style={{
                  position: 'absolute',
                  right: '20px',
                  color: candidate.type === 'member' ? '#b2ffc3' : '#fdc087',
                }}
              >
                {candidate?.type === 'dao' ? 'DAO' : 'Contributor'}
              </div>
            </div>
          )}
        />
      </div>
      <div className="sidebar__dao">
        <SidebarDao mini={mini} />
      </div>
      <div className="sidebar__overview">
        <SidebarOverview />
      </div>
      <button
        className="sidebar__logout"
        onClick={() =>
          window.open(
            `${window.location.origin}/${process.env.REACT_APP_FORM_ID}/form`,
            '_blank'
          )
        }
      >
        <SupportIcon />
        <span>Support</span>
      </button>
      <button
        className="sidebar__logout"
        onClick={handleLogout}
        style={{ marginTop: '40px' }}
      >
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </aside>
  ) : null;
};

export default Sidebar;
