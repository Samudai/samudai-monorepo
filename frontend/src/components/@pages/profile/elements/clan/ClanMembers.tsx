import AddMembers from '../../popups/AddMembers';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import Members from 'ui/Members/Members';
import PlusIcon from 'ui/SVG/PlusIcon';
import styles from '../../styles/Widgets.module.scss';

type Member = {
    member_id: string;
    username: string;
    name?: string;
    profile_picture?: string | null;
};

interface ClanMembersProps {
    admin: Member;
    members: Member[];
}

const ClanMembers: React.FC<ClanMembersProps> = ({ admin, members }) => {
    const addMember = usePopup();

    return (
        <div className={styles.widget}>
            <header className={styles.header}>
                <h3 className={styles.title}>Team Members</h3>
            </header>
            <div className={styles.membersAdmin}>
                <div className={styles.membersAdminImg}>
                    <img src={admin.profile_picture || ''} alt="logo" className="img-cover" />
                </div>
                <div className={styles.membersAdminText}>Clan Admin</div>
            </div>
            <div className={styles.membersRow}>
                <Members className={styles.membersList} users={members} max={7} hideMore />
                <Button className={styles.membersAdd} onClick={addMember.open}>
                    <PlusIcon />
                    <span>Add</span>
                </Button>
            </div>
            <PopupBox active={addMember.active} onClose={addMember.close}>
                <AddMembers />
            </PopupBox>
        </div>
    );
};

export default ClanMembers;
