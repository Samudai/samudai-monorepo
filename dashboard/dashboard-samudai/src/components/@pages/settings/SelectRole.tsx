import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { selectRoleStyles } from './utils/select-role.styles';
import { selectActiveDao } from 'store/features/common/slice';
import { roles } from 'store/services/Settings/model';
import useDelayedSearch from 'hooks/useDelayedSearch';
import { useTypedSelector } from 'hooks/useStore';
import { FormDataType } from 'pages/settings/dao/access-managment';
import Highlighter from 'ui/Highlighter/Highlighter';
import styles from './styles/SelectRole.module.scss';

interface SelectRoleProps {
    roles: roles[];
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    id: 'dao' | 'project' | 'job' | 'payment' | 'view';
    formData: FormDataType;
}

const SelectRole: React.FC<SelectRoleProps> = ({ roles, setFormData, id, formData }) => {
    const [search, setSearch] = useState('');
    const [list, setList] = useState<roles[]>(roles);
    const [defaultOptions, setDefaultOptions] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const { daoid } = useParams();
    const activeDao = useTypedSelector(selectActiveDao);

    useEffect(() => {
        const defaultOptions: any[] = [];
        roles?.forEach((val) => {
            if (formData[id].roles.includes(val.role_id)) {
                defaultOptions.push({
                    label: val.role_id,
                    value: val.name,
                });
            }
        });
        setDefaultOptions(defaultOptions);
        setLoad(true);
    }, [formData, id, list, daoid, activeDao]);

    const searchDelay = useDelayedSearch((value: string) => {
        const search = value.toLowerCase().trim();
        if (search !== '') {
            const v = roles.filter((r) => r.name.trim().toLowerCase().includes(search));
            setList(v);
        } else {
            setList(roles);
        }
    }, 0);

    const handleSearch = (value: string) => {
        setSearch(value);
        searchDelay(value);
    };

    const handleChange = (e: any) => {
        setFormData((prev) => ({
            ...prev,
            [id]: {
                roles: Array.isArray(e) ? e.map((x) => x.label) : [],
                members: formData[id].members,
            },
        }));
    };

    // const defaultOptions = formData[id].roles.map((r) =>
    //   list.find((val) => val.role_id === r)
    // );
    // console.log('list', list);
    // console.log('formData[id].roles', formData[id].roles);

    return (
        <div className={styles.root}>
            <h3 className={styles.suptitle}>Roles</h3>
            {load && (
                <Select
                    defaultValue={defaultOptions}
                    classNamePrefix="rs"
                    className={styles.selectRole}
                    inputValue={search}
                    isClearable={true}
                    isMulti={true}
                    onInputChange={handleSearch}
                    onChange={handleChange}
                    options={list.map((value) => {
                        return {
                            value: value.name,
                            label: value.role_id,
                        };
                    })}
                    styles={selectRoleStyles}
                    placeholder="select roles"
                    formatOptionLabel={(data: { value: string }) => (
                        <div className={styles.label} data-select-label>
                            <Highlighter search={search} text={data?.value} />
                        </div>
                    )}
                />
            )}
        </div>
    );
};

export default SelectRole;
