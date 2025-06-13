import './portfolio-item.scss';

export const PortfolioItem: React.FC<any> = ({ idx, icon, title }) => {
    return (
        <li className="portfolio-item" key={idx}>
            <div className="portfolio-item__wrapper">
                <img src={icon} className="portfolio-item__icon" alt={title} />
                <h4 className="portfolio-item__title">{title}</h4>
            </div>
        </li>
    );
};
