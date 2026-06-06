export const getArrayFromObject = (objArray, dao, key) => {
    const result = [];
    if (!objArray) {
        return result;
    }
    objArray.forEach((obj) => {
        if (obj.dao_id === dao) {
            if ('roles' in obj) {
                obj.roles.forEach((val) => {
                    result.push(val[key]);
                });
            }
        }
    });
    return result;
};

export const getRoles = (arrayObject, daoId) => {
    let roles = [];
    arrayObject.map((dao) => {
        if (dao.dao_id === daoId) {
            dao.roles.map((role) => {
                roles.push(role.role_id);
            });
        }
    });
    return roles;
};
