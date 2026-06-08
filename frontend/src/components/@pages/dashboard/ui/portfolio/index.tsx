import { useEffect, useState } from 'react';
import axios from 'axios';
import useRequest from 'hooks/useRequest';
import Block from 'components/Block/Block';
import Skeleton from 'components/Skeleton/Skeleton';
import { PortfolioItem, PortfolioSkeleton } from './components';
import './portfolio.scss';

export const Portfolio: React.FC = () => {
    const [data, setData] = useState<any>([]);
    const [fetchData, loading] = useRequest(async function () {
        const { data } = await axios.get<any>('/mockup/portfolio.json');
        setData(data);
    });

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Block className="portfolio" data-analytics-parent="portfolio_widget_parent">
            <Block.Header>
                <Block.Title>Portfolio</Block.Title>
            </Block.Header>
            <Block.Scrollable>
                <Skeleton
                    className="portfolio__content"
                    component="ul"
                    skeleton={<PortfolioSkeleton />}
                    loading={loading}
                >
                    {data.map(PortfolioItem)}
                </Skeleton>
            </Block.Scrollable>
        </Block>
    );
};
