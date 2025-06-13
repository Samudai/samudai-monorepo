import clsx from 'clsx';
import Bot from './ConnectDiscordBot';
import Discord from './ConnectListDiscord';
import Children from './ConnectListDropDown';
import Gcal from './ConnectListGcal';
import Item from './ConnectListItem';
import Wallet from './ConnectListWallet';
import './ConnectList.scss';

interface ConnectListProps {
    className?: string;
    children?: React.ReactNode;
}

const ConnectList: React.FC<ConnectListProps> = ({ className, children }) => {
    return (
        <div className={clsx('connect-list', className)}>
            <ul className="connect-list__list">{children}</ul>
        </div>
    );
};

export default Object.assign(ConnectList, {
    Item,
    Wallet,
    Children,
    Bot,
    Gcal,
    Discord,
});
