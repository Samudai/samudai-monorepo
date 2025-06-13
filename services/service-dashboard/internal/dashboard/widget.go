package dashboard

import (
	"encoding/json"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/samudai-pkg/logger"
	"github.com/Samudai/service-dashboard/pkg/dashboard"
)

func CreateDashboardWidget(dashboardWidget dashboard.DashboardWidget) (int, error) {
	db := db.GetSQL()
	var dashboardWidgetID int
	err := db.QueryRow(`INSERT INTO dashboard_widget (dashboard_id, id, name, active, row_id, 
		col_id, "order", draggable, popup_id)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING dashboard_widget_id`,
		dashboardWidget.DashboardID, dashboardWidget.WidgetID, dashboardWidget.Name, dashboardWidget.Active, dashboardWidget.RowID,
		dashboardWidget.ColID, dashboardWidget.Order, dashboardWidget.Draggable, dashboardWidget.PopupID).Scan(&dashboardWidgetID)
	if err != nil {
		return dashboardWidgetID, err
	}

	logger.LogMessage("info", "Created dashboard widget with id: %d", dashboardWidgetID)

	return dashboardWidgetID, nil
}

func ListDashboardWidgetView(dashboardID string) ([]dashboard.DashboardWidget, error) {
	db := db.GetSQL()
	var widgetsJSON *json.RawMessage
	err := db.QueryRow(`SELECT widgets FROM dashboard_view WHERE dashboard_id = $1::uuid`, dashboardID).Scan(&widgetsJSON)
	if err != nil {
		return nil, err
	}

	var widgets []dashboard.DashboardWidget
	err = json.Unmarshal(*widgetsJSON, &widgets)
	if err != nil {
		return nil, err
	}

	return widgets, nil
}

func UpdateDashboardWidget(dashboardID string, dashboardWidgets []dashboard.DashboardWidget) error {
	db := db.GetSQL()

	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	_, err = tx.Exec(`DELETE FROM dashboard_widget WHERE dashboard_id = $1::uuid`, dashboardID)
	if err != nil {
		return fmt.Errorf("Error executing statement: %w", err)
	}

	for _, dashboardWidget := range dashboardWidgets {
		_, err = tx.Exec(`INSERT INTO dashboard_widget (dashboard_id, id, name, active, row_id, 
		col_id, "order", draggable, popup_id)
		VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9)`,
			dashboardID, dashboardWidget.WidgetID, dashboardWidget.Name, dashboardWidget.Active, dashboardWidget.RowID,
			dashboardWidget.ColID, dashboardWidget.Order, dashboardWidget.Draggable, dashboardWidget.PopupID)
		if err != nil {
			return fmt.Errorf("Error executing statement: %w", err)
		}
		logger.LogMessage("info", "added dashboard widget %+v", dashboardWidget.WidgetID)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("Error committing transaction: %w", err)
	}

	return nil
}

func UpdateWidgetActive(dashboardWidgetID int, active bool) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE dashboard_widget SET active = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`, dashboardWidgetID, active)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Updated dashboard widget active with id: %d", dashboardWidgetID)

	return nil
}

func DeleteDashboardWidget(dashboardWidgetID int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM dashboard_widget WHERE id = $1`, dashboardWidgetID)
	if err != nil {
		return err
	}

	logger.LogMessage("info", "Deleted dashboard widget with id: %d", dashboardWidgetID)

	return nil
}

func CreateDefaultWidgets(dashboardID string) error {
	db := db.GetSQL()
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("Error starting transaction: %w", err)
	}

	for _, widget := range dashboard.DefaultWidgets {
		_, err = tx.Exec(`INSERT INTO dashboard_widget (dashboard_id, id, name, active, row_id,
			col_id, "order", draggable, popup_id)
			VALUES ($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9)`, dashboardID, widget.WidgetID, widget.Name, widget.Active, widget.RowID,
			widget.ColID, widget.Order, widget.Draggable, widget.PopupID)
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
