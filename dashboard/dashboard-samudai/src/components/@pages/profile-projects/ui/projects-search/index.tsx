import Sprite from 'components/sprite';
import React from 'react';
import Input from 'ui/@form/Input/Input';
import css from './projects-search.module.scss';

interface ProjectsSearchProps {
    search: string;
    setSearch: (search: string) => void;
}

export const ProjectsSearch: React.FC<ProjectsSearchProps> = ({ search, setSearch }) => {
    return (
        <div className={css.search}>
            <Input
                value={search}
                onChange={(ev) => setSearch(ev.target.value)}
                className={css.search_input}
                icon={<Sprite className={css.search_icon} url="/img/sprite.svg#magnifier" />}
                placeholder="Search DAO, Project, Task"
            />
        </div>
    );
};
