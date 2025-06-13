package dashboard

import (
	"encoding/json"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dashboard/pkg/dashboard"
)

func CreateDashboard(Dashboard dashboard.Dashboard) (string, error) {
	db := db.GetSQL()
	var dashboardID string
	err := db.QueryRow(`INSERT INTO dashboard (dao_id, dashboard_name, description, "default", visibility) 
		VALUES ($1::uuid, $2, $3, $4, $5) RETURNING dashboard_id`,
		Dashboard.DAOID, Dashboard.Name, Dashboard.Description, Dashboard.Default, Dashboard.Visibility).Scan(&dashboardID)
	if err != nil {
		return dashboardID, err
	}

	logger.LogMessage("info", "dashboard created for dao: %s", Dashboard.DAOID)

	err = CreateDefaultWidgets(dashboardID)
	if err != nil {
		return dashboardID, err
	}

	return dashboardID, nil
}

func ListDashboardView(daoID string) ([]dashboard.DashboardView, error) {
	db := db.GetSQL()
	rows, err := db.Query(`SELECT dashboard_id, dao_id, dashboard_name, description, "default", 
		visibility, widgets, created_at, updated_at 
		FROM dashboard_view WHERE dao_id = $1::uuid`, daoID)
	if err != nil {
		return nil, err
	}

	var dashboards []dashboard.DashboardView
	for rows.Next() {
		var Dashboard dashboard.DashboardView
		var widgetsJSON *json.RawMessage
		err := rows.Scan(&Dashboard.DashboardID, &Dashboard.DAOID, &Dashboard.Name, &Dashboard.Description, &Dashboard.Default, &Dashboard.Visibility, &widgetsJSON, &Dashboard.CreatedAt, &Dashboard.UpdatedAt)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(*widgetsJSON, &Dashboard.Widgets)
		if err != nil {
			return nil, err
		}

		dashboards = append(dashboards, Dashboard)
	}

	return dashboards, nil
}

func UpdateDashboard(Dashboard dashboard.Dashboard) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dashboard SET dashboard_name = $2, description = $3, "default" = $4, visibility = $5, 
		updated_at = CURRENT_TIMESTAMP WHERE dashboard_id = $1::uuid`,
		Dashboard.DashboardID, Dashboard.Name, Dashboard.Description, Dashboard.Default, Dashboard.Visibility)
	if err != nil {
		return err
	}

	return nil
}

func UpdateDashboardName(DashboardID string, Name string) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dashboard SET dashboard_name = $2, 
		updated_at = CURRENT_TIMESTAMP WHERE dashboard_id = $1::uuid`,
		DashboardID, Name)
	if err != nil {
		return err
	}

	return nil
}

func DeleteDashboard(dashboardID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM dashboard WHERE dashboard_id = $1::uuid`, dashboardID)
	if err != nil {
		return err
	}

	return nil
}

func UpdateDashboardVisibility(dashboardID int, visibility bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dashboard SET visibility = $2, updated_at = CURRENT_TIMESTAMP WHERE dashboard_id = $1::uuid`, dashboardID, visibility)
	if err != nil {
		return err
	}

	return nil
}
