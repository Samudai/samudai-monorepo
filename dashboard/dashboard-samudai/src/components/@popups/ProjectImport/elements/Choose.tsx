import React from 'react';
import Select from 'ui/@form/Select/Select';
import { ServiceType } from '../utils';
import styles from '../styles/Choose.module.scss';

interface ChooseProps {
    link: string;
    service: ServiceType;
    onChangeLink: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeService: (service: ServiceType) => void;
}

const Choose: React.FC<ChooseProps> = ({ link, service, onChangeLink, onChangeService }) => {
    return (
        <div className={styles.root}>
            <Select className={styles.select} closeClickItem closeClickOuside>
                <Select.Button className={styles.selectBtn}>
                    <div className={styles.selectContent}>
                        <div className={styles.selectIcon}>
                            <img src={service.icon} alt="icon" />
                        </div>
                        <p className={styles.selectName}>{service.name}</p>
                    </div>
                </Select.Button>
                {/* <Select.List className={styles.selectList}>
          {services
            .filter((s) => s.name !== service.name)
            .map((service) => (
              <Select.Item
                key={service.name}
                className={styles.selectItem}
                onClick={() => onChangeService(service)}
              >
                <div className={styles.selectContent}>
                  <div className={styles.selectIcon}>
                    <img src={service.icon} alt="icon" />
                  </div>
                  <p className={styles.selectName}>{service.name}</p>
                </div>
              </Select.Item>
            ))}
        </Select.List> */}
            </Select>
            {/* <Input
        title="Link"
        value={link}
        className={styles.input}
        placeholder="Type link here..."
        onChange={onChangeLink}
      /> */}
        </div>
    );
};

export default Choose;
