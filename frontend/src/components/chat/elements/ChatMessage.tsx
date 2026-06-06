import { useEffect, useMemo, useState } from 'react';
import { MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FileHelper } from 'utils/helpers/FileHelper';
import styles from '../styles/Message.module.scss';
import usePopup from 'hooks/usePopup';

interface Member {
    wallet: string;
    publicKey: string;
    isAdmin: boolean;
    image: string;
}

interface MessageProps {
    me: boolean;
    data: MessageResponse;
    className?: string;
    showAvatar?: boolean;
    innerRef?: (node: HTMLLIElement) => void;
    members: Member[];
}
const ipfs = (url: string) => `https://${url}.ipfs.w3s.link/`;

const MessageComp: React.FC<MessageProps> = ({
    me,
    data,
    className,
    showAvatar,
    innerRef,
    members,
}) => {
    const fileExt = FileHelper.getFileExt(data.content!);
    const isImage = fileExt && FileHelper.extensions.image.includes(fileExt);

    const [imageUrl, setImageUrl] = useState('');

    const checkDecryptMessage = data.content === 'Unable to decrypt message';
    const previewModal = usePopup();

    const getInfo = useMemo(() => {
        return members.find((member) => member.wallet === data.sender_id);
    }, [members, data]);

    useEffect(() => {
        (async () => {
            if (data.type === 'file') {
                const imageUrl = window.URL || window.webkitURL;
            }
            if (data.attachment_link) {
                setImageUrl(data.attachment_link);
            }
        })();
    }, []);

    console.log(getInfo, members, data);

    return (
        <li className={clsx(styles.root, me && styles.rootMe, className)}>
            {showAvatar && !me && (
                <div className={styles.avatar}>
                    {getInfo?.image && (
                        <img
                            src={getInfo.image}
                            alt="avatar"
                            className="img-cover"
                            style={{ maxHeight: '44px', maxWidth: '44px' }}
                        />
                    )}
                    <span style={{ color: 'white' }}>{''}</span>
                </div>
            )}
            <div className={styles.body}>
                {checkDecryptMessage ? (
                    <div className={styles.msg}>
                        <p className={styles.msgText}>message encrypted before you joined</p>
                    </div>
                ) : (
                    <div className={styles.msg}>
                        {/* Replies */}
                        {/* {data?.reply.map((msg) => (
                  <div key={msg.id} className={styles.reply}>
                    <p className={styles.replyName}>{msg.user.fullname}</p>
                    <p className={styles.replyText}>
                      {msg.text !== '' ? msg.text : msg.attachments.length + 'file(s)'}
                    </p>
                  </div>
                ))} */}
                        {/* Text */}
                        {data.type === 'text' && <p className={styles.msgText}>{data.content}</p>}
                        {/* Attachments */}

                        {data.type === 'gif' && (
                            <div style={{ width: '200px' }}>
                                <img src={data.content} alt="img" className="img-cover" />
                            </div>
                            // <ul className={styles.attachments}>
                            //   <li className={styles.attachmentsItem} key={data.attachment_link}>
                            //     <div className={styles.attachmentsItemContent}>
                            //       <p className={styles.attachmentsItemName} style={{ cursor: 'pointer' }}>
                            //         <div className={styles.imageContainer} data-role="container">
                            //           <img src={data.content} alt="img" className="img-cover" />
                            //           {
                            //             // <p className={styles.imageText} data-role="text">
                            //             //   <span>.{fileExt}</span>
                            //             // </p>
                            //           }
                            //         </div>
                            //       </p>
                            //     </div>
                            //   </li>
                            // </ul>
                        )}
                        {data.type === 'file' && (
                            <>
                                <div style={{ width: '300px' }}>
                                    <img
                                        src={JSON.parse(data.content || '').content}
                                        alt="img"
                                        className="img-cover"
                                    />
                                </div>
                                {/* <PopupBox active={previewModal.active} onClose={previewModal.toggle}>
                  <Popup>
                    <div>
                      <img
                        src={JSON.parse(data.content || '').content}
                        alt="img"
                        className="img-cover"
                      />
                    </div>
                  </Popup>
                </PopupBox> */}
                            </>

                            // <ul className={styles.attachments}>
                            //   <li className={styles.attachmentsItem} key={data.attachment_link}>
                            //     <div className={styles.attachmentsItemContent}>
                            //       <p className={styles.attachmentsItemName} style={{ cursor: 'pointer' }}>
                            //         <div className={styles.imageContainer} data-role="container">
                            //           <img
                            //             src={JSON.parse(data.content || '').content}
                            //             alt="img"
                            //             className="img-cover"
                            //           />
                            //           {
                            //             // <p className={styles.imageText} data-role="text">
                            //             //   <span>.{fileExt}</span>
                            //             // </p>
                            //           }
                            //         </div>
                            //       </p>
                            //     </div>
                            //   </li>
                            // </ul>
                        )}
                    </div>
                )}
                <div className={styles.foot}>
                    {/* {me && (data.readed || true) && (
            <img src="/img/icons/mark-read.svg" alt="read" className={styles.footMark} />
          )} */}
                    <p className={styles.footTime}>{dayjs(data.created_at).format('HH:mm A')}</p>
                </div>
            </div>
        </li>
    );
};

export default MessageComp;
