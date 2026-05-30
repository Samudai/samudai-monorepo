import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { selectRoleStyles1 } from './utils/select-role.styles';
import { roles } from 'store/services/Settings/model';
import useDelayedSearch from 'hooks/useDelayedSearch';
import { FormDataType } from 'pages/settings/dao/access-managment';
import Highlighter from 'ui/Highlighter/Highlighter';
import styles from './styles/SelectRole.module.scss';

// const roles = Object.values(JobRole);

interface SelectRoleProps {
    roles: roles[];
    setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
    id: 'dao' | 'project' | 'view';
    formData: FormDataType;
}

const SelectRole: React.FC<SelectRoleProps> = ({ roles, setFormData, id, formData }) => {
    const [search, setSearch] = useState('');
    const [list, setList] = useState<roles[]>(roles);
    const [defaultOptions, setDefaultOptions] = useState<any>([]);
    const [load, setLoad] = useState(false);
    const { daoid } = useParams();

    useEffect(() => {
        const accessArray: any[] = [];
        console.log(formData);
        roles?.forEach((val) => {
            if (formData[id].roles.includes(val.role_id)) {
                accessArray.push({
                    label: val.role_id,
                    value: val.name,
                });
            }
        });
        setDefaultOptions(accessArray);
        console.log(defaultOptions);
    }, [formData, id, list, roles, daoid]);

    useEffect(() => {
        setLoad(true);
    }, [defaultOptions]);

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
        setFormData((prev: any) => ({
            ...prev,
            [id]: {
                roles: Array.isArray(e) ? e.map((x) => x.label) : [],
                members: formData[id].members,
            },
        }));
    };

    return (
        <div className={styles.root}>
            <h3 className={styles.suptitle}>Roles</h3>
            <Select
                value={defaultOptions}
                defaultValue={defaultOptions}
                classNamePrefix="rs"
                isClearable={true}
                inputValue={search}
                isMulti
                onChange={handleChange}
                onInputChange={handleSearch}
                options={list.map((value) => {
                    return {
                        value: value.name,
                        label: value.role_id,
                    };
                })}
                // menuIsOpen
                styles={selectRoleStyles1}
                placeholder="Select Roles"
                formatOptionLabel={(data: { value: string }) => (
                    <div className={styles.label} data-select-label>
                        <Highlighter search={search} text={data?.value} />
                    </div>
                )}
            />
        </div>
    );
};

export default SelectRole;
