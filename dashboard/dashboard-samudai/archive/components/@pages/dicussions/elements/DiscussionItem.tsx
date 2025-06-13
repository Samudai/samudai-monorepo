import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import routes from 'root/router/routes';
import { useAddParticipantMutation } from 'store/services/Discussion/discussion';
import Button from 'ui/@buttons/Button/Button';
import Members from 'ui/Members/Members';
import { cutText } from 'utils/format';
import { toast } from 'utils/toast';
import { IDiscussion } from 'utils/types/Discussions';
import { getMemberId } from 'utils/utils';
import styles from '../styles/DiscussionItem.module.scss';

interface DiscussionItemProps {
  className?: string;
  data: DiscussionResponse;
  minimum?: boolean;
  active?: boolean;
}

const DiscussionItem: React.FC<DiscussionItemProps> = ({
  data,
  className,
  minimum,
  active,
}) => {
  const { daoid } = useParams();
  const [optedIn, setOptedIn] = React.useState(data?.opted_in);
  const capitaliseFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const [addParticipant] = useAddParticipantMutation();
  const handleOptIn = async () => {
    try {
      setOptedIn(true);
      const res = await addParticipant({
        participant: { discussion_id: data?.discussion_id!, member_id: getMemberId() },
      }).unwrap();
    } catch (err: any) {
      setOptedIn(false);
      toast('Failure', 5000, 'Cannot Opt-In', err?.data?.message)();
    }
  };

  return (
    <NavLink
      className={clsx(styles.root, className, minimum && styles.rootMinimum)}
      to={'/' + daoid +  '/discussions/' + data.discussion_id}
      data-active={active}
    >
      <ul className={styles.wrapper} data-role="wrapper">
        <li className={styles.colTopic} style={{ marginBottom: '10px' }}>
          <p className={styles.title}>{cutText(data?.topic, 100)}</p>
          {minimum && (
            <p className={styles.type} data-type={data?.category?.toLowerCase()}>
              {capitaliseFirstLetter(data?.category)}
            </p>
          )}
        </li>
        {!minimum && (
          <li className={styles.colCenter}>
            <div className={styles.colAuthor}>
              <p className={styles.name}>By</p>
              <div className={styles.authorImg}>
                <img
                  src={data?.created_by?.profile_picture || '/img/icons/user-4.png'}
                  alt="img"
                  className="img-cover"
                />
              </div>
              <p className={styles.authorName}>{data?.created_by?.name}</p>
            </div>
            <div className={styles.colCreated}>
              <p className={styles.name}>{dayjs(data?.created_at).fromNow()}</p>
            </div>
            <div className={styles.colType}>
              <p className={styles.type} data-type={data?.category?.toLowerCase()}>
                {capitaliseFirstLetter(data?.category)}
              </p>
            </div>
          </li>
        )}
        <li className={styles.colParticipants}>
          <p className={styles.name}>Participants</p>
          <Members className={styles.members} users={data.participants} />
          {!optedIn && !minimum && (
            <Button color="green" style={{ padding: '10px 22px' }} onClick={handleOptIn}>
              Join
            </Button>
          )}
        </li>
      </ul>
    </NavLink>
  );
};

export default DiscussionItem;
