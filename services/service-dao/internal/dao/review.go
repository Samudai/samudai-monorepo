package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateReview(review dao.Review) (int, error) {
	db := db.GetSQL()
	var reviewID int
	err := db.QueryRow(`INSERT INTO reviews (dao_id, member_id, content, rating) 
		VALUES ($1::uuid, $2, $3, $4) RETURNING id`, review.DAOID, review.MemberID, review.Content, review.Rating).Scan(&reviewID)
	if err != nil {
		return reviewID, err
	}

	return reviewID, nil
}

func ListReviews(daoID string) ([]dao.Review, int, error) {
	db := db.GetSQL()
	var total int
	var reviews []dao.Review
	rows, err := db.Query(`SELECT COUNT(*) over() as total, id, dao_id, member_id, content, rating, created_at 
		FROM reviews WHERE dao_id = $1::uuid
		ORDER BY created_at DESC`, daoID)
	if err != nil {
		return reviews, total, err
	}
	defer rows.Close()

	for rows.Next() {
		var review dao.Review
		err := rows.Scan(&total, &review.ReviewID, &review.DAOID, &review.MemberID, &review.Content, &review.Rating, &review.CreatedAt)
		if err != nil {
			return reviews, total, err
		}

		reviews = append(reviews, review)
	}

	return reviews, total, nil
}

func ListReviewsForReviewerID(memberID string) ([]dao.Review, int, error) {
	db := db.GetSQL()
	var total int
	var reviews []dao.Review
	rows, err := db.Query(`SELECT COUNT(*) over() as total, id, dao_id, member_id, content, rating, created_at 
		FROM reviews WHERE member_id = $1::uuid
		ORDER BY created_at DESC`, memberID)
	if err != nil {
		return reviews, total, err
	}
	defer rows.Close()

	for rows.Next() {
		var review dao.Review
		err := rows.Scan(&total, &review.ReviewID, &review.DAOID, &review.MemberID, &review.Content, &review.Rating, &review.CreatedAt)
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
