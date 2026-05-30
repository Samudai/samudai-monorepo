import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';

export const ProposalsItem = ({ id, title, choices, scores, state }: any) => {
    const totalVotes = scores.reduce((acc: number, val: number) => acc + val, 0);
    return (
        <li className="proposals-item" key={id}>
            <div
                className="proposals-item__col proposals-item__col-info"
                onClick={() => {
                    window.open(
                        `https://snapshot.org/#/${
                            localStorage.getItem('daoData') || ''
                        }/proposal/${id}`,
                        '_blank'
                    );
                }}
            >
                <p className="proposals-item__action">{title}</p>
            </div>
            {/* <div className="proposals-item__col proposals-item__col-progress">
        {choices.length > 0 &&
          choices.map((choice: string, i: number) => {
            if (i > 2) return null;
            return (
              <>
                <div className="proposals-item__progress proposals-item__progress_for">
                  <Progress hideText percent={(scores[i] / totalVotes) * 100} />
                  <p>
                    <strong>Votes for {choice}</strong>
                  </p>
                </div>
              </>
            );
          })}
      </div> */}
            <div className="proposals-item__col proposals-item__col-status">
                <div
                    className={clsx(
                        'proposals-item__status',
                        state === 'closed' ? 'pending' : 'active'
                    )}
                >
                    {state}
                </div>
            </div>
            <div className="proposals-item__col proposals-item__col-controls">
                <Button color="green" className="proposals-item__view" onClick={() => {}}>
                    <ArrowLeftIcon />
                    <span>View</span>
                </Button>
            </div>
            {/* <div className="proposals-item__col proposals-item__col-controls">
        <button className="proposals-item__btn">
          <ArrowDownIcon />
        </button>
        <button className="proposals-item__btn">
          <ArrowDownIcon />
        </button>
      </div> */}
        </li>
    );
};
