package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateBlog(blog dao.Blog) (int, error) {
	db := db.GetSQL()
	var blogID int
	err := db.QueryRow(`INSERT INTO blogs (dao_id, link, metadata) 
		VALUES ($1::uuid, $2, $3) RETURNING id`, blog.DAOID, blog.Link, blog.Metadata).Scan(&blogID)
	if err != nil {
		return blogID, err
	}

	return blogID, nil
}

func ListBlogsForDAO(daoID string) ([]dao.Blog, error) {
	db := db.GetSQL()
	var blogs []dao.Blog
	rows, err := db.Query(`SELECT id, dao_id, link, created_at, metadata
		FROM blogs WHERE dao_id = $1::uuid
		ORDER BY created_at DESC LIMIT 10`, daoID)
	if err != nil {
		return blogs, err
	}
	defer rows.Close()

	for rows.Next() {
		var blog dao.Blog
		err := rows.Scan(&blog.BlogID, &blog.DAOID, &blog.Link, &blog.CreatedAt, &blog.Metadata)
		if err != nil {
			return blogs, err
		}

		blogs = append(blogs, blog)
	}

	return blogs, nil
}

func DeleteBlog(blogID int) error {
	db := db.GetSQL()
	_, err := db.Exec("DELETE FROM blogs WHERE id = $1", blogID)
	if err != nil {
		return err
	}

	return nil
}
