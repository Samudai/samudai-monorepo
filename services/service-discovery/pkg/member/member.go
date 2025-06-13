package member

type EventType string

const (
	TaskEventCreated    EventType = "task_created"
	TaskEventAssigned   EventType = "task_assigned"
	TaskEventUnassigned EventType = "task_unassigned"
	TaskEventCompleted  EventType = "task_completed"
	TaskEventDeleted    EventType = "task_deleted"

	VerifyCredEventCreated EventType = "verifyable_creds_created"
	VerifyCredEventUpdated EventType = "verifyable_creds_updated"
)

type EventContext string

const (
	MemberEventTask        EventContext = "task"
	MemberEventVerifyCreds EventContext = "verify_creds"
)

type MemberEvent struct {
	MemberID     string       `json:"member_id"`
	DAOID		 string		  `json:"dao_id"`
	EventType    EventType    `json:"event_type"`
	EventContext EventContext `json:"event_context"`
}
