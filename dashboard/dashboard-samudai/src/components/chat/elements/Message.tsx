import { useEffect, useState } from 'react';
import { MessageResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { downloadFile } from 'utils/fileupload/fileupload';
import { FileHelper } from 'utils/helpers/FileHelper';
import { StorageType } from 'utils/types/FileUpload';
import styles from '../styles/Message.module.scss';

interface MessageProps {
    me: boolean;
    data: MessageResponse;
    className?: string;
    showAvatar?: boolean;
    innerRef?: (node: HTMLLIElement) => void;
}
const ipfs = (url: string) => `https://${url}.ipfs.w3s.link/`;

const MessageComp: React.FC<MessageProps> = ({ me, data, className, showAvatar, innerRef }) => {
    const fileExt = FileHelper.getFileExt(data.content!);
    const isImage = fileExt && FileHelper.extensions.image.includes(fileExt);

    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        (async () => {
            if (data.attachment_link) {
                setImageUrl(data.attachment_link);
            }
        })();
    }, []);

    return (
        <li className={clsx(styles.root, me && styles.rootMe, className)}>
            {showAvatar && !me && (
                <div className={styles.avatar} style={{ width: '80px' }}>
                    <img
                        src={data?.sender?.profile_picture || '/img/icons/user-4.png'}
                        alt="avatar"
                        className="img-cover"
                        style={{ maxHeight: '44px', maxWidth: '44px' }}
                    />
                    <span style={{ color: 'white' }}>{data.sender?.name?.slice(0, 10)}</span>
                </div>
            )}
            <div className={styles.body}>
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
                    <p className={styles.msgText}>{data.content}</p>
                    {/* Attachments */}

                    {!!data.attachment_link && (
                        <ul className={styles.attachments}>
                            <li className={styles.attachmentsItem} key={data.attachment_link}>
                                {/* <div className={styles.attachmentsItemContent}>
                <Attachment
                  key={data.message_id}
                  name={data.content!}
                  url={data.attachment_link}
                />
                </div> */}
                                <div className={styles.attachmentsItemContent}>
                                    <p
                                        className={styles.attachmentsItemName}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() =>
                                            downloadFile(
                                                data.attachment_link!,
                                                StorageType.SPACES,
                                                data.content!
                                            )
                                        }
                                    >
                                        <div
                                            className={styles.imageContainer}
                                            data-role="container"
                                        >
                                            {isImage && (
                                                <img
                                                    src={imageUrl}
                                                    alt="img"
                                                    className="img-cover"
                                                />
                                            )}
                                            {!isImage && (
                                                <p className={styles.imageText} data-role="text">
                                                    <span>.{fileExt}</span>
                                                </p>
                                            )}
                                        </div>

                                        {/* <a href={ipfs(data.attachment_link)} target="_blank" rel="noreferrer">
                      {data.attachment_link.slice(0, 20)}
                    </a> */}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    )}
                </div>
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
