import { useCallback, useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import DiscussionsList from '../elements/DicussionsList';
import DiscussionsItem from '../elements/DiscussionItem';
import {
  DiscussionResponse,
  Message,
  MessageResponse,
  NotificationsEnums,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { mockup_messages } from 'root/mockup/messages';
import {
  useAddParticipantMutation,
  useLazyCheckIsParticipantQuery,
  useLazyGetMessagesQuery,
} from 'store/services/Discussion/discussion';
import useInput from 'hooks/useInput';
import AddPeople from 'components/@popups/components/elements/AddPeopleDao';
import Content from 'components/chat/elements/Content';
import ControlPanel from 'components/chat/elements/ControlPanel';
import Hat from 'components/chat/elements/Hat';
import MessageComp from 'components/chat/elements/Message';
import Settings from 'components/chat/elements/Settings';
import Workspace from 'components/chat/elements/Workspace';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import BookIcon from 'ui/SVG/BookIcon';
import Magnifier from 'ui/SVG/Magnifier';
import mixpanel from 'utils/mixpanel/mixpanelInit';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { IDiscussion } from 'utils/types/Discussions';
import { getMemberId } from 'utils/utils';
import styles from '../styles/DiscussionsChat.module.scss';

interface IMember {
  member_id: string;
  profile_picture: string | null;
  username: string;
  name: string;
}

interface DiscussionsChatProps {}

const DiscussionsChat: React.FC<DiscussionsChatProps> = () => {
  const [search, setSearch] = useInput('');
  const [text, setText, _, clearText] = useInput<HTMLTextAreaElement>('');
  const listRef = useRef<HTMLUListElement>(null);
  const items = useOutletContext<DiscussionResponse[]>();
  const { id } = useParams();
  const [message, setMessage] = useState<MessageResponse[]>([]);
  const [leads, setLeads] = useState<IMember[]>([]);
  const [showControl, setShowControl] = useState<boolean>(false);
  const [fetchMessages, { isSuccess }] = useLazyGetMessagesQuery();
  const [addParticipant] = useAddParticipantMutation();
  const [check] = useLazyCheckIsParticipantQuery();

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [message, id]);

  const fetch = useCallback(async () => {
    fetchMessages(id!)
      .unwrap()
      .then((res) => {
        if (isSuccess) {
          const reversed = [...(res.data || [])]?.reverse();
          console.log('reversed', reversed);
          setMessage(reversed);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [fetchMessages, id, isSuccess]);

  const handleOptIn = async () => {
    setShowControl(true);
    try {
      const res = await addParticipant({
        participant: { discussion_id: id!, member_id: getMemberId() },
      }).unwrap();
      mixpanel.track('discussion_opt_in', {
        discussion_id: id!,
        member_id: getMemberId(),
        timestamp: new Date().toUTCString(),
      });
    } catch (err: any) {
      setShowControl(false);
      toast('Failure', 5000, 'Cannot Opt-In', err?.data?.message)();
    }
  };

  const checkOptIn = async () => {
    const res = await check({ discussionId: id!, memberId: getMemberId() },true).unwrap();
    if (res?.data?.is_participant) {
      setShowControl(res?.data?.is_participant);
    } else {
      setShowControl(false);
    }
  };

  useEffect(() => {
    console.log('check');
    fetch();
    checkOptIn();
  }, [id, fetch, id!]);

  const title = items?.find((val) => val.discussion_id === id)?.topic;

  const handleAddLead = (user: IMember) => {
    toast('Success', 3000, 'Invitation Sent', '')();
    sendNotification({
      to: [user?.member_id],
      for: NotificationsEnums.NotificationFor.MEMBER,
      from: getMemberId(),
      origin: '/discussions',
      by: NotificationsEnums.NotificationCreatedby.MEMBER,
      metadata: {
        id: id!,
        // id: paymentMock.payment_id,
      },
      type: NotificationsEnums.SocketEventsToService.INVITED_TO_DISCUSSION,
    });
    setLeads([]);
  };

  return (
    <div className={styles.root}>
      <div className={styles.left}>
        {/* <Input
          placeholder="Discussions"
          className={styles.search}
          value={search}
          onChange={setSearch}
          icon={<Magnifier className={styles.searchIcon} />}
        /> */}
        <DiscussionsList className={styles.list}>
          {items.map((item) => (
            <DiscussionsItem
              className={styles.list_item}
              data={item}
              key={item.discussion_id}
              active={item.discussion_id === id}
              minimum
            />
          ))}
        </DiscussionsList>
      </div>

      <div className={styles.right}>
        <Content className={styles.chat}>
          <Hat className={styles.hat}>
            <div className={styles.hatInfo}>
              <BookIcon className={styles.hatIcon} />
              <p className={styles.hatName}>{title}</p>
            </div>
            <li className={styles.colRight} style={{ listStyle: 'none' }}>
              <AddPeople
                title=""
                users={leads}
                onAddUser={handleAddLead}
                buttonText="Invite"
                className={styles.invite}
                right
              />
            </li>
            {/* <Settings>
              <Settings.Item
                icon="/img/icons/off-notifications.svg"
                title="Turn off notifications"
              />
              <Settings.Item icon="/img/icons/change-colors.svg" title="Change colors" />
              <Settings.Item
                icon="/img/icons/view-attachments.svg"
                title="View Attachments"
              />
              <Settings.Item
                icon="/img/icons/delete-history.svg"
                title="Delete history"
              />
            </Settings> */}
          </Hat>
          <Workspace className={styles.workspace}>
            {showControl && (
              <>
                <ul className={clsx(styles.messages, 'orange-scrollbar')} ref={listRef}>
                  {(message || [])?.map((message, id, arr) => (
                    <MessageComp
                      showAvatar
                      key={id}
                      me={message.message_id === '1'}
                      data={message}
                    />
                  ))}
                </ul>

                <ControlPanel
                  className={styles.panel}
                  value={text}
                  onChange={setText}
                  clear={clearText}
                  fetch={fetch}
                />
              </>
            )}
            {!showControl && (
              <div
                className={styles.optIn}
                style={{
                  minHeight: '70vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  className={styles.optInButton}
                  onClick={handleOptIn}
                  color="green"
                >
                  Join
                </Button>
              </div>
            )}
          </Workspace>
        </Content>
      </div>
    </div>
  );
};

export default DiscussionsChat;
