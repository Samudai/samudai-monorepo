import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useScrollbar } from 'hooks/useScrollbar';
import { useDAO } from 'components/new-sidebar/lib/hooks';
import PlusIcon from 'ui/SVG/PlusIcon';
import { getInitial } from 'utils/utils';
import css from './sidebar-daos.module.scss';
import usePopup from 'hooks/usePopup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import AddDao from '../add-dao-modal';
import Tutorial from 'ui/tutorial';
import { useTypedSelector, useTypedDispatch } from 'hooks/useStore';
import { tutorialStep, changeTutorialStep } from 'store/features/common/slice';

interface SidebarDaosProps {
    extended: boolean;
    className?: string;
    onShrinkMenu?: () => void;
}

export const SidebarDaos: React.FC<SidebarDaosProps> = ({ extended, className, onShrinkMenu }) => {
    const { DAOList, activeDAO, handleAddDao, handleChangeDao } = useDAO(onShrinkMenu);
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    const checkDaoActive = (daoId: string) => activeDAO.id === daoId;
    const currTutorialStep = useTypedSelector(tutorialStep);
    const dispatch = useTypedDispatch();
    const addDao = usePopup();

    const AddButton = useCallback(
        ({ addDao }: { addDao: () => void }) => (
            <button
                className={clsx(css.daos_item, css.daos_itemAdd)}
                onClick={addDao}
                data-analytics-click="add_dao_button"
                id="add_dao_button"
            >
                <span className={css.daos_addBtn}>
                    <PlusIcon />
                </span>
            </button>
        ),
        []
    );

    return (
        <div
            ref={ref}
            className={clsx(
                css.daos,
                extended && css.daosExtended,
                isScrollbar && css.daosScrollbar,
                className
            )}
        >
            <div className={css.daos_list}>
                {DAOList.map((dao) => (
                    <button
                        className={clsx(
                            css.daos_item,
                            checkDaoActive(dao.id) && css.daos_itemActive
                        )}
                        onClick={!checkDaoActive(dao.id) ? () => handleChangeDao(dao) : undefined}
                        key={dao.id}
                        data-analytics-click={dao.name}
                    >
                        {dao?.profilePicture ? (
                            <img src={dao.profilePicture} alt="logo" className={css.daos_image} />
                        ) : (
                            <span className={css.daos_logo}>
                                <span>{getInitial(dao.name)}</span>
                            </span>
                        )}
                        <span className={css.daos_name}>
                            <span>{dao.name}</span>
                        </span>
                    </button>
                ))}
                {!isScrollbar && (
                    <AddButton addDao={addDao.open} data-analytics-click="add_dao_button" />
                )}
            </div>
            {isScrollbar && (
                <AddButton addDao={addDao.open} data-analytics-click="add_dao_button" />
            )}
            <Tutorial
                id="add_dao_button"
                active={currTutorialStep === 1}
                step={{
                    id: 1,
                    name: 'Community',
                    description: 'Click the “+” button to onboard your communities on Samudai',
                    skip: true,
                }}
                totalSteps={6}
                position="right-top"
                nextStep={() => dispatch(changeTutorialStep({ step: 2 }))}
                onSkip={() => dispatch(changeTutorialStep({ step: 0 }))}
                onClose={() => dispatch(changeTutorialStep({ step: -1 }))}
            />
            <PopupBox active={addDao.active} onClose={addDao.close}>
                <AddDao onClose={addDao.close} />
            </PopupBox>
        </div>
    );
};
