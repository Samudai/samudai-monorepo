package deal

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type FormType string

const (
	FormTypeDeal       FormType = "deal"
	FormTypeSupport    FormType = "support"
	FormTypeOnboarding FormType = "onboarding"
	FormTypeGrant      FormType = "grant"
)

type Form struct {
	FormID    primitive.ObjectID `json:"form_id" bson:"_id"`
	DaoID     string             `json:"dao_id" bson:"dao_id"`
	Name      string             `json:"name" bson:"name"`
	Type      FormType           `json:"type" bson:"type"`
	Questions []Question         `json:"questions" bson:"questions"`

	CreatedBy string  `json:"created_by" bson:"created_by"`
	UpdatedBy *string `json:"updated_by" bson:"updated_by"`

	CreatedAt *time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" bson:"updated_at"`
}

type QuestionType string

const (
	QuestionTypeText        QuestionType = "text"
	QuestionTypeSelect      QuestionType = "select"
	QuestionTypeMultiSelect QuestionType = "multi_select"
	QuestionTypeAttachment  QuestionType = "attachment"
)

type Question struct {
	Id          string       `json:"id" bson:"id"`
	Question    string       `json:"question" bson:"question"`
	Active      bool         `json:"active" bson:"active"`
	SeqId       int          `json:"seq_id" bson:"seq_id"`
	Type        QuestionType `json:"type" bson:"type"`
	Select      []string     `json:"select" bson:"select"`
	Required    bool         `json:"required" bson:"required"`
	Description string       `json:"description" bson:"description"`
}

type FormResponse struct {
	ResponseID primitive.ObjectID `json:"response_id" bson:"_id"`
	FormID     string             `json:"form_id" bson:"form_id"`
	Wallet     string             `json:"wallet" bson:"wallet"`
	Responses  []Response         `json:"responses" bson:"responses"`
	Metadata   *SupportData       `json:"metadata" bson:"metadata"`

	CreatedAt *time.Time `json:"created_at" bson:"created_at"`
}

type SupportData struct {
	MemberID  string `json:"member_id" bson:"member_id"`
	UserAgent string `json:"user_agent" bson:"user_agent"`
}

type Response struct {
	Question   string       `json:"question" bson:"question"`
	Type       QuestionType `json:"type" bson:"type"`
	Select     []string     `json:"select" bson:"select"`
	Required   bool         `json:"required" bson:"required"`
	Answer     []string     `json:"answer" bson:"answer"`
	Attachment string       `json:"attachment" bson:"attachment"`
}
