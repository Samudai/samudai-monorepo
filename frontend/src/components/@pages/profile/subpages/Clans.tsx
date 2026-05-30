import { useEffect, useState } from 'react';

import { IClanInfo } from 'utils/types/Clan';
import { mockup_clans } from 'root/mockup/clans';
import { useLazyGetClanByMemberIdQuery } from 'store/services/userProfile/clans';
import useInput from 'hooks/useInput';
import useRequest from 'hooks/useRequest';
import styles from '../styles/Clans.module.scss';

const Clans: React.FC = () => {
    const [data, setData] = useState<IClanInfo[]>([]);
    const [selected, setSelected] = useState<IClanInfo | null>(null);
    const [value, setValue] = useInput('');
    const [getClansByMember] = useLazyGetClanByMemberIdQuery();

    const [fetchData, loading] = useRequest(async () => {
        await new Promise((res) => setTimeout(res, 250));
        if (mockup_clans) {
            setData(mockup_clans);
            setSelected(mockup_clans[0]);
        }
    });

    const fetchData1 = () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = JSON.parse(localData!);
        const memberId = parsedData.member_id;
        getClansByMember(memberId, true)
            .unwrap()
            .then((res) => {
                console.log('fetch1', res);
                console.log(res.data);
                // setData(res.data);
                // setSelected(data[0]);
            });
    };

    const handleSelectClan = (clan: IClanInfo) => {
        setSelected(clan);
    };

    const filteredClans = value.trim()
        ? data.filter((cl) => {
              if (cl === selected || cl.name.toLowerCase().includes(value.trim().toLowerCase()))
                  return true;

              return false;
          })
        : data;

    useEffect(() => {
        fetchData();
        // fetchData1();
    }, []);

    if (loading || selected === null) {
        return <h2 className={styles.loading}>Loading...</h2>;
    }

    return (
        <div className={styles.root}>
            {/* <div className={styles.table}>
        <Sidebar
          title="Clans"
          searchProps={{
            value,
            onChange: setValue,
            placeholder: 'Search clans',
          }}
        >
          {filteredClans.map((clan) => (
            <Sidebar.Item
              type="clan"
              key={clan.id}
              data={{
                id: clan.id,
                img: clan.logo,
                name: clan.name,
                time: Date.now(),
                messages: 100,
              }}
              active={clan.id === selected.id}
              onClick={() => handleSelectClan(clan)}
            />
          ))}
        </Sidebar>
        <Content>
          <Hat className={styles.hat}>
            <HatInfo
              img={selected.logo}
              text={selected.name}
              members={`${selected.members.length} members`}
            />
            <div className={styles.hatRight}>
              <HatButton icon={<ChatIcon />} text="Go to Chat" />
              <Settings className={styles.settings}>
                <Settings.Item icon="/img/icons/information.svg" title="Unknown" />
                <Settings.Item icon="/img/icons/information.svg" title="Unknown 2" />
                <Settings.Item icon="/img/icons/information.svg" title="Unknown 3" />
              </Settings>
            </div>
          </Hat>
          <Workspace className={styles.workspace}>
            <div className={styles.row}>
              <div className={styles.col}>
                <ClanProjects projects={selected.projects} />
              </div>
              <div className={styles.col}>
                <ClanBadges earnedBadges={selected.earned_badges} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                <ClanMembers admin={selected.admin} members={selected.members} />
              </div>
              <div className={styles.col}>
                <ClanBounty bounty={selected.total_bounty} />
              </div>
            </div>
            <div className={styles.row}>
              <ClanSkills skills={selected.skills} />
            </div>
            <div className={styles.row}>
              <div className={styles.col}>
                <ClanApplications applications={selected.applications} />
              </div>
              <div className={styles.col}>
                <ClanReviews reviews={selected.reviews} />
              </div>
            </div>
          </Workspace>
        </Content>
      </div> */}
        </div>
    );
};

export default Clans;
