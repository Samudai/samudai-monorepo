-- dashboard service fixes: dashboard.go (ListDashboardView) and widget.go
-- (ListDashboardWidgetView) read FROM dashboard_view, which 000001 never created.
-- The view denormalizes each dashboard's widgets into a json array.
-- ListDashboardView scans, in order: dashboard_id, dao_id, dashboard_name, description,
-- "default", visibility, widgets(json), created_at, updated_at. widget.go filters the
-- same view by dashboard_id and reads only widgets — so both columns must be selectable.
-- The widget json keys match the dashboard.DashboardWidget struct json tags.
CREATE OR REPLACE VIEW public.dashboard_view AS
SELECT
  d.dashboard_id,
  d.dao_id,
  d.dashboard_name,
  d.description,
  d."default",
  d.visibility,
  COALESCE(
    (
      SELECT json_agg(
               json_build_object(
                 'dashboard_widget_id', w.dashboard_widget_id,
                 'dashboard_id',        w.dashboard_id,
                 'id',                  w.id,
                 'name',                w.name,
                 'active',              w.active,
                 'row_id',              w.row_id,
                 'col_id',              w.col_id,
                 'order',               w."order",
                 'draggable',           w.draggable,
                 'popup_id',            w.popup_id,
                 'created_at',          w.created_at,
                 'updated_at',          w.updated_at
               )
               ORDER BY w."order"
             )
      FROM dashboard_widget w
      WHERE w.dashboard_id = d.dashboard_id
    ),
    '[]'::json
  ) AS widgets,
  d.created_at,
  d.updated_at
FROM dashboard d;
