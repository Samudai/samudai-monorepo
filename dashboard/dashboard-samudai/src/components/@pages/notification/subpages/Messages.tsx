import { NfItem, NfTitle } from 'components/notifications/elements';
import NfMessage from 'components/notifications/items/NfMessage';
import React from 'react';
import styles from '../styles/Messages.module.scss';

interface MessagesProps {}

const Messages: React.FC<MessagesProps> = (props) => {
    return (
        <React.Fragment>
            <NfItem type="actions">
                <NfTitle className={styles.msg_title}>Phyllis Hall sent a message</NfTitle>
                <NfMessage />
            </NfItem>
            <NfItem type="actions">
                <NfTitle className={styles.msg_title}>Phyllis Hall sent a message</NfTitle>
                <NfMessage />
            </NfItem>
            <NfItem type="actions">
                <NfTitle className={styles.msg_title}>Phyllis Hall sent a message</NfTitle>
                <NfMessage />
            </NfItem>
            <NfItem type="actions">
                <NfTitle className={styles.msg_title}>Phyllis Hall sent a message</NfTitle>
                <NfMessage />
            </NfItem>
        </React.Fragment>
    );
};

export default Messages;
