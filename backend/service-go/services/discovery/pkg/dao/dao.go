package dao

type EventType string

const (
	ProjectEventCreated   EventType = "project_created"
	ProjectEventCompleted EventType = "project_completed"
	ProjectEventDeleted   EventType = "project_deleted"
)

type EventContext string

const (
	DAOEventProject     EventContext = "project"
	DAOEventBounty      EventContext = "bounty"
	DAOEventOpportunity EventContext = "opportunity"
)

type DAOEvent struct {
	DAOID        string       `json:"dao_id"`
	EventType    EventType    `json:"event_type"`
	EventContext EventContext `json:"event_context"`
}
