import Block from 'components/Block/Block';
import CoinIcon from 'ui/SVG/CoinIcon';
import ChartIcons from 'ui/SVG/chart';
import '../styles/Bounty.scss';

const Bounty: React.FC = () => {
    return (
        <Block className="dashboard-bounty">
            <Block.Header>
                <Block.Title>Bounty</Block.Title>
            </Block.Header>
            <Block.Scrollable className="dashboard-bounty__list" component="ul">
                <li className="dashboard-bounty__item">
                    <h3 className="dashboard-bounty__item-title">Total Bounty</h3>
                    <p className="dashboard-bounty__item-value">
                        <CoinIcon className="orange" />
                        <span>80%</span>
                    </p>
                </li>
                <li className="dashboard-bounty__item">
                    <h3 className="dashboard-bounty__item-title">From Yesterday</h3>
                    <p className="dashboard-bounty__item-value">
                        <ChartIcons.Increase className="green" />
                        <span>+12%</span>
                    </p>
                </li>
            </Block.Scrollable>
        </Block>
    );
};

export default Bounty;
