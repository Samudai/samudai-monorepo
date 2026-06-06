import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import { editProfileToggle } from 'store/features/popup/slice';
import usePopup from 'hooks/usePopup';
import { useTypedDispatch } from 'hooks/useStore';
import { ReviewsSkeleton } from 'components/@pages/dashboard';
import styles from 'components/@pages/dashboard/ui/reviews/reviews.module.scss';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import SkillsAdd from 'components/@signup/ProfileSetup/steps/SetupSkills/SkillsAdd';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import FavoriteIcon from 'ui/SVG/FavoriteIcon';
import PenIcon from 'ui/SVG/PenIcon';
import UserSkill from 'ui/UserSkill/UserSkill';
import { getMemberId } from 'utils/utils';
import Settings from './SkillsIcon';
import '../styles/Skills.scss';

interface IProps {
    skills?: string[];
}

const Skills: React.FC<IProps> = ({ skills }) => {
    const dispatch = useTypedDispatch();
    const popup = usePopup();
    const { memberid } = useParams();
    const [skillsData, setSkillsData] = useState(skills);
    // const data = useTypedSelector(selectUserData);

    const handleEdit = () => {
        dispatch(editProfileToggle(true));
    };

    const sameMember = getMemberId() === memberid;

    useEffect(() => {
        setSkillsData(skills);
    }, [skills]);

    return (skillsData || []).length > 0 ? (
        <Block className="dashboard-skills">
            <Block.Header>
                <Block.Title>Skills</Block.Title>
                {sameMember && (
                    <button className="dashboard-skills__edit" onClick={popup.open}>
                        <PenIcon />
                    </button>
                )}
            </Block.Header>
            <Block.Scrollable className="dashboard-skills__list">
                {skillsData?.map((skill, idx) => (
                    <UserSkill
                        className="dashboard-skills__list-item"
                        key={skill}
                        skill={skill}
                        hideCross={true}
                    />
                ))}
            </Block.Scrollable>
            <PopupBox active={popup.active} onClose={popup.close}>
                <SkillsAdd onClose={popup.close} data={skillsData} changeSkills={setSkillsData} />
            </PopupBox>
        </Block>
    ) : (
        <Block className={clsx(styles.root)}>
            <Block.Header>
                {/* <button className="dashboard-skills__edit" onClick={popup.open}>
          <PenIcon />
        </button> */}
            </Block.Header>
            <Block.Scrollable>
                {(skillsData || [])?.length === 0 && (
                    <Skeleton loading={false} skeleton={<ReviewsSkeleton />}>
                        <div className={styles.reviewsPreview} style={{ marginTop: '0px' }}>
                            <h2 className={styles.reviewsPreviewTitle} style={{}}>
                                Skills
                            </h2>
                            {sameMember && (
                                <button className={styles.reviewsPreviewBtn1} onClick={popup.open}>
                                    <FavoriteIcon />
                                    <span>Add Skills</span>
                                </button>
                            )}
                            <Settings style={{ height: '200px' }} />
                        </div>
                    </Skeleton>
                )}
            </Block.Scrollable>
            {/* <Block.Scrollable className="dashboard-skills__tools">
        <ul className="dashboard-skills__tools-list">
          {tools.map((tool, id) => (
            <li className="dashboard-skills__tools-item" key={id}>
              <img src={tool} alt="tool" />
            </li>
          ))}
        </ul>
      </Block.Scrollable> */}
            <PopupBox active={popup.active} onClose={popup.close}>
                <SkillsAdd onClose={popup.close} changeSkills={setSkillsData} />
            </PopupBox>
        </Block>
    );
};

export default Skills;
