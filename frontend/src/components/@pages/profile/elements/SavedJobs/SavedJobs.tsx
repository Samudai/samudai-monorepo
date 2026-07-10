import Block from 'components/Block/Block';
import SavedJobsCard from './SavedJobsCard';
import { data } from './temp_data';
import '../../styles/SavedJobs.scss';

const SavedJobs: React.FC = () => {
    return (
        <Block className="saved-jobs">
            <Block.Header>
                <Block.Title>Saved Jobs</Block.Title>
                <Block.Link />
            </Block.Header>
            <Block.Scrollable className="saved-jobs__content">
                <ul className="saved-jobs__list">
                    {data.map((job) => (
                        <SavedJobsCard key={job.id} {...job} />
                    ))}
                </ul>
            </Block.Scrollable>
        </Block>
    );
};

export default SavedJobs;
