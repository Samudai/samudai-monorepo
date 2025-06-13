package member

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)

func CreateReview(review member.Review) (int, error) {
	db := db.GetSQL()
	var reviewID int
	err := db.QueryRow(`INSERT INTO reviews (member_id, reviewer_id, content, rating) 
		VALUES ($1::uuid, $2, $3, $4) RETURNING id`, review.MemberID, review.ReviewerID, review.Content, review.Rating).Scan(&reviewID)
	if err != nil {
		return reviewID, err
	}

	return reviewID, nil
}

func ListReviews(memberID string) ([]member.MemberReviewReponse, int, error) {
	db := db.GetSQL()
	var total int
	var reviews []member.MemberReviewReponse
	rows, err := db.Query(`SELECT COUNT(*) over() as total, r.id, r.member_id, r.reviewer_id, r.content, r.rating, 
		r.created_at, m.name, m.username, m.profile_picture 
		FROM reviews r
		JOIN members m on m.member_id = r.member_id
		WHERE r.reviewer_id = $1::uuid
		ORDER BY created_at DESC`, memberID)
	if err != nil {
		return reviews, total, err
	}
	defer rows.Close()

	for rows.Next() {
		var review member.MemberReviewReponse
		err := rows.Scan(&total, &review.ReviewID, &review.MemberID, &review.ReviewerID, &review.Content, &review.Rating,
			&review.CreatedAt, &review.Name, &review.Username, &review.ProfilePicture)
		if err != nil {
			return reviews, total, err
		}

		reviews = append(reviews, review)
	}

	return reviews, total, nil
}

func ListReviewsForReviewerID(memberID string) ([]member.MemberReviewReponse, int, error) {
	db := db.GetSQL()
	var total int
	var reviews []member.MemberReviewReponse
	rows, err := db.Query(`SELECT COUNT(*) over() as total, r.id, r.member_id, r.reviewer_id, r.content, r.rating, 
		r.created_at, m.name, m.username, m.profile_picture 
		FROM reviews r
		JOIN members m on m.member_id = r.reviewer_id
		WHERE r.reviewer_id = $1::uuid
		ORDER BY created_at DESC`, memberID)
	if err != nil {
		return reviews, total, err
	}
	defer rows.Close()

	for rows.Next() {
		var review member.MemberReviewReponse
		err := rows.Scan(&total, &review.ReviewID, &review.MemberID, &review.ReviewerID, &review.Content, &review.Rating,
			&review.CreatedAt, &review.Name, &review.Username, &review.ProfilePicture)
		if err != nil {
			return reviews, total, err
		}

		reviews = append(reviews, review)
	}

	return reviews, total, nil
}

func DeleteReview(reviewID int) error {
	db := db.GetSQL()
	_, err := db.Exec("DELETE FROM reviews WHERE id = $1", reviewID)
	if err != nil {
		return err
	}

	return nil
}
