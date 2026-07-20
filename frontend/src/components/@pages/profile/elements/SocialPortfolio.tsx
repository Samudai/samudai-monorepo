import Block from 'components/Block/Block';
import Socials from 'components/Socials/Socials';
import '../styles/SocialPortfolio.scss';

interface IProps {
    social?: {
        type: string;
        url: string;
    }[];
}
const SocialPortfolio: React.FC<IProps> = ({ social }) => {
    return (
        <Block className="social-portfolio">
            <Block.Header>
                <Block.Title>Portfolio</Block.Title>
            </Block.Header>
            <Block.Scrollable className="social-portfolio__content">
                <Socials social={social} />
            </Block.Scrollable>
        </Block>
    );
};

export default SocialPortfolio;
