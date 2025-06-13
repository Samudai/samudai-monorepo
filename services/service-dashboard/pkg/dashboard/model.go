package dashboard

import "time"

type Dashboard struct {
	DashboardID string `json:"dashboard_id"`
	DAOID       string `json:"dao_id"`
	Name        string `json:"dashboard_name"`
	Description string `json:"description"`
	Default     bool   `json:"default"`
	Visibility  string `json:"visibility"`

	CreatedAt *time.Time `json:"created_at"`
	UpdatedAt *time.Time `json:"updated_at"`
}

type WidgetList int

// Dont comment a widget enum here, it will be used in the frontend
const (
	WidgetListAboutDao WidgetList = 0
	WidgetListExpectedEvents WidgetList = 1
	WidgetListCalendar WidgetList = 2
	WidgetListReviews WidgetList = 3
	WidgetListProjects WidgetList = 4
	WidgetListTwitter WidgetList = 5
	WidgetListRecentActivity WidgetList = 6
	WidgetListContributorProfiles WidgetList = 7
	WidgetListMonthlyPlan WidgetList = 8
	WidgetListTotalBalance WidgetList = 9
	WidgetListPortfolio WidgetList = 10
	WidgetListNotifications WidgetList = 11
	WidgetListDiscussions WidgetList = 12
	WidgetListTransactions WidgetList = 13
	WidgetListChart WidgetList = 14
	WidgetListProposals WidgetList = 15
	WidgetListBlogs WidgetList = 16
	WidgetListTokens WidgetList = 17
	WidgetListDealPipeline WidgetList = 18
	WidgetListLinks WidgetList = 19
)

type DashboardWidget struct {
	DashboardWidgetID int        `json:"dashboard_widget_id"`
	DashboardID       string     `json:"dashboard_id,omitempty"`
	WidgetID          WidgetList `json:"id"`
	Name              string     `json:"name"`
	Active            bool       `json:"active"`
	RowID             int        `json:"row_id"`
	ColID             int        `json:"col_id"`
	Order             int        `json:"order"`
	Draggable         bool       `json:"draggable"`
	PopupID           int        `json:"popup_id"`

	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type DashboardView struct {
	Dashboard
	Widgets []DashboardWidget `json:"widgets"`
}

var DefaultWidgets = []DashboardWidget{
	{
		WidgetID:  WidgetListChart,
		Name:      "DAO Stats",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     0,
		Order:     0,
		PopupID:   0,
	},
	{
		WidgetID:  WidgetListCalendar,
		Name:      "Calendar",
		Active:    true,
		Draggable: true,
		ColID:     0,
		RowID:     0,
		Order:     1,
		PopupID:   3,
	},
	{
		WidgetID:  WidgetListProposals,
		Name:      "Recent Proposals",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     0,
		Order:     2,
		PopupID:   7,
	},
	{
		WidgetID:  WidgetListBlogs,
		Name:      "Websites / Blogs",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     0,
		Order:     3,
		PopupID:   6,
	},
	{
		WidgetID:  WidgetListProjects,
		Name:      "Projects",
		Active:    true,
		Draggable: true,
		ColID:     0,
		RowID:     0,
		Order:     4,
		PopupID:   5,
	},
	{
		WidgetID:  WidgetListContributorProfiles,
		Name:      "Contributor Profiles",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     0,
		Order:     5,
		PopupID:   10,
	},
	{
		WidgetID:  WidgetListLinks,
		Name:      "Links",
		Active:    true,
		Draggable: true,
		ColID:     1,
		RowID:     0,
		Order:     1,
		PopupID:   1,
	},
	{
		WidgetID:  WidgetListAboutDao,
		Name:      "About DAO",
		Active:    true,
		Draggable: true,
		ColID:     1,
		RowID:     0,
		Order:     0,
		PopupID:   1,
	},
	{
		WidgetID:  WidgetListReviews,
		Name:      "Reviews",
		Active:    true,
		Draggable: false,
		ColID:     1,
		RowID:     0,
		Order:     2,
		PopupID:   4,
	},
	{
		WidgetID:  WidgetListExpectedEvents,
		Name:      "Upcoming Events",
		Active:    true,
		Draggable: true,
		ColID:     1,
		RowID:     0,
		Order:     3,
		PopupID:   2,
	},
	{
		WidgetID:  WidgetListRecentActivity,
		Name:      "Recent Activity",
		Active:    true,
		Draggable: false,
		ColID:     1,
		RowID:     0,
		Order:     4,
		PopupID:   9,
	},
	{
		WidgetID:  WidgetListTwitter,
		Name:      "Twitter",
		Active:    true,
		Draggable: true,
		ColID:     1,
		RowID:     0,
		Order:     5,
		PopupID:   8,
	},
	// {
	// 	WidgetID:  WidgetListMonthlyPlan,
	// 	Name:      "Monthly Plan",
	// 	Active:    true,
	// 	Draggable: false,
	// 	ColID:     1,
	// 	RowID:     0,
	// 	Order:     5,
	// 	PopupID:   11,
	// },
	{
		WidgetID:  WidgetListTotalBalance,
		Name:      "Total Balance",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     1,
		Order:     0,
		PopupID:   12,
	},
	{
		WidgetID:  WidgetListTokens,
		Name:      "Tokens",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     1,
		Order:     1,
		PopupID:   16,
	},
	{
		WidgetID:  WidgetListTransactions,
		Name:      "Recent Transaction",
		Active:    true,
		Draggable: false,
		ColID:     1,
		RowID:     1,
		Order:     0,
		PopupID:   17,
	},
	// {
	// 	WidgetID:  WidgetListPortfolio,
	// 	Name:      "Portfolio",
	// 	Active:    true,
	// 	Draggable: false,
	// 	ColID:     0,
	// 	RowID:     2,
	// 	Order:     0,
	// 	PopupID:   13,
	// },
	// {
	// 	WidgetID:  WidgetListNotifications,
	// 	Name:      "Notification Center",
	// 	Active:    true,
	// 	Draggable: false,
	// 	ColID:     0,
	// 	RowID:     2,
	// 	Order:     1,
	// 	PopupID:   14,
	// },
	{
		WidgetID:  WidgetListDiscussions,
		Name:      "Discussions",
		Active:    true,
		Draggable: false,
		ColID:     1,
		RowID:     2,
		Order:     0,
		PopupID:   15,
	},
	{
		WidgetID:  WidgetListDealPipeline,
		Name:      "Deal Pipeline",
		Active:    true,
		Draggable: false,
		ColID:     0,
		RowID:     2,
		Order:     0,
		PopupID:   17,
	},
}
