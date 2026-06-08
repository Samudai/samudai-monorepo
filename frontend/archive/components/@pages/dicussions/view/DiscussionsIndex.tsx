import { useOutletContext } from 'react-router-dom';
import DiscussionsList from '../elements/DicussionsList';
import DiscussionItem from '../elements/DiscussionItem';
import { DiscussionResponse } from '@samudai_xyz/gateway-consumer-types';
import { IDiscussion } from 'utils/types/Discussions';
import styles from '../styles/DiscussionsIndex.module.scss';

interface DiscussionsIndexProps {}

const DiscussionsIndex: React.FC<DiscussionsIndexProps> = (props) => {
  const items = useOutletContext<DiscussionResponse[]>();

  return (
    <DiscussionsList>
      {(items || [])?.map((item) => (
        <DiscussionItem data={item} key={item.discussion_id} />
      ))}
    </DiscussionsList>
  );
};

export default DiscussionsIndex;
