package dao

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

// CreateDAODepartments creates a new department for a DAO.
func CreateDAODepartments(daoID string, departments []string) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, department := range departments {
		_, err = tx.Exec(`INSERT INTO department (dao_id, name) VALUES ($1::uuid, $2)`, daoID, department)
		if err != nil {
			return fmt.Errorf("Error executing statement: %w", err)
		}
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

// CreateDAODepartment creates a new department for a DAO.
func CreateDAODepartment(daoID string, departments string) (string, error) {
	db := db.GetSQL()
	var departmentID string
	err := db.QueryRow(`INSERT INTO department (dao_id, name) VALUES ($1::uuid, $2) returning department_id`, daoID, departments).Scan(&departmentID)
	if err != nil {
		return departmentID, fmt.Errorf("Error executing statement: %w", err)
	}

	return departmentID, nil
}

// ListDepartmentsForDAO returns a list of departments for a DAO.
func ListDepartmentsForDAO(daoID string) ([]dao.Department, error) {
	db := db.GetSQL()
	var departments []dao.Department
	rows, err := db.Query(`SELECT department_id, dao_id, name, created_at, updated_at FROM department WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return departments, err
	}
	defer rows.Close()
	for rows.Next() {
		var department dao.Department
		err := rows.Scan(&department.DepartmentID, &department.DAOID, &department.Name, &department.CreatedAt, &department.UpdatedAt)
		if err != nil {
			return departments, err
		}
		departments = append(departments, department)
	}
	return departments, nil
}

// DeleteDAODepartment deletes a department for a DAO.
func DeleteDAODepartment(departmentID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM department WHERE department_id = $1::uuid`, departmentID)
	if err != nil {
		return err
	}
	return nil
}
