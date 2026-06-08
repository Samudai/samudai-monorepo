DROP VIEW IF EXISTS public.dashboard_view;

CREATE VIEW public.dashboard_view AS
 SELECT dashboard_id,
    dao_id,
    dashboard_name,
    description,
    "default",
    visibility,
    COALESCE(( SELECT json_agg(json_build_object('dashboard_widget_id', w.dashboard_widget_id, 'dashboard_id', w.dashboard_id, 'id', w.id, 'name', w.name, 'active', w.active, 'row_id', w.row_id, 'col_id', w.col_id, 'order', w."order", 'draggable', w.draggable, 'popup_id', w.popup_id, 'created_at', w.created_at, 'updated_at', w.updated_at) ORDER BY w."order") AS json_agg
           FROM public.dashboard_widget w
          WHERE (w.dashboard_id = d.dashboard_id)), '[]'::json) AS widgets,
    created_at,
    updated_at
   FROM public.dashboard d;
