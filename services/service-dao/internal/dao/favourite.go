package dao

import (
	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
)

func CreateDAOFavourite(favourite dao.Favourite) (string, error) {
	db := db.GetSQL()
	var favouriteID string
	err := db.QueryRow(`INSERT INTO favourite (dao_id, member_id) VALUES ($1::uuid, $2::uuid) ON CONFLICT (dao_id, member_id) DO NOTHING RETURNING id`,
		favourite.DAOID, favourite.MemberID).Scan(&favouriteID)
	if err != nil {
		return favouriteID, err
	}

	return favouriteID, nil
}

func GetDAOFavouriteList(memberID string, limit, offset *int) ([]dao.FavouriteResponse, int, error) {
	db := db.GetSQL()
	var favourites []dao.FavouriteResponse
	var total int
	rows, err := db.Query(`SELECT count(*) over() as total, f.id, f.dao_id, f.member_id, f.created_at, d.name, d.profile_picture
		FROM favourite f
		JOIN dao d ON d.dao_id = f.dao_id
		WHERE member_id = $1::uuid 
		ORDER BY created_at DESC`, memberID)
	if err != nil {
		return favourites, total, err
	}

	defer rows.Close()

	for rows.Next() {
		var fav dao.FavouriteResponse
		err := rows.Scan(&total, &fav.FavouriteID, &fav.DAOID, &fav.MemberID, &fav.CreatedAt, &fav.Name, &fav.ProfilePicture)
		if err != nil {
			return favourites, total, err
		}
		favourites = append(favourites, fav)
	}

	return favourites, total, nil
}

func DeleteDAOFavourite(favouriteID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM favourite WHERE id = $1`, favouriteID)
	if err != nil {
		return err
	}

	return nil
}

func GetDAOFavouriteCountByDAO(daoID string) (int, error) {
	db := db.GetSQL()
	var count int
	err := db.QueryRow(`SELECT COUNT(*) FROM favourite WHERE dao_id = $1::uuid`, daoID).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}
