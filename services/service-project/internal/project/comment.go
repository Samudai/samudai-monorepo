package project

import (
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-project/pkg/project"
)

func CreateComment(comment project.Comment) (string, error) {
	db := db.GetSQL()
	var commentID string
	err := db.QueryRow(`INSERT INTO comments (link_id, body, author, type)
		VALUES ($1::uuid, $2, $3, $4)
		RETURNING id`,
		comment.LinkID, comment.Body, comment.Author, comment.Type).Scan(&commentID)
	if err != nil {
		return commentID, fmt.Errorf("failed to create comment: %w", err)
	}

	return commentID, nil
}

func GetCommentsByLinkID(linkID string) ([]project.Comment, error) {
	db := db.GetSQL()
	var comments []project.Comment
	rows, err := db.Query(`SELECT id, link_id, body, author, type, created_at FROM comments
		WHERE link_id = $1::uuid`, linkID)
	if err != nil {
		return comments, fmt.Errorf("failed to get comments: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var comment project.Comment
		err := rows.Scan(&comment.CommentID, &comment.LinkID, &comment.Body, &comment.Author, &comment.Type)
		if err != nil {
			return nil, fmt.Errorf("failed to scan comment: %w", err)
		}
		comments = append(comments, comment)
	}

	return comments, nil
}

func UpdateComment(comment project.Comment) error {
	db := db.GetSQL()
	_, err := db.Exec(`UPDATE comments SET body = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
		comment.CommentID, comment.Body)
	if err != nil {
		return fmt.Errorf("failed to update comment: %w", err)
	}

	return nil
}

func DeleteComment(commentID int) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM comments WHERE id = $1`, commentID)
	if err != nil {
		return fmt.Errorf("failed to delete comment: %w", err)
	}

	return nil
}
