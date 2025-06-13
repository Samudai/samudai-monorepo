package member

import (
	"database/sql"
	"fmt"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-member/pkg/member"
)

func AddMobileForMember(mobileInfo member.Mobile) (string, error) {
	db := db.GetSQL()
	var memberId string

	err := db.QueryRow(`
        UPDATE mobile 
        SET linked_status = $2 
        WHERE mobile_otp = $1 
        RETURNING member_id`,
		mobileInfo.MobileOTP, mobileInfo.LinkedStatus).Scan(&memberId)

	if err != nil {
		if err == sql.ErrNoRows {
			return memberId, fmt.Errorf("Wrong OTP!")
		} else {
			return memberId, err
		}
	}

	return memberId, nil

}

func CreateOrUpdateGeneratedOTP(memberId string, mobile_otp string) (string, error) {
	db := db.GetSQL()
	var mobileID string

	var existingMobileID string
	err := db.QueryRow(`SELECT mobile_id FROM mobile WHERE member_id = $1`, memberId).Scan(&existingMobileID)

	if err == sql.ErrNoRows {
		err = db.QueryRow(`INSERT INTO mobile (member_id, mobile_otp) VALUES ($1::uuid, $2) RETURNING mobile_id`, memberId, mobile_otp).Scan(&mobileID)
		if err != nil {
			return mobileID, err
		}
	} else if err != nil {
		return mobileID, err
	} else {
		_, err = db.Exec(`UPDATE mobile SET mobile_otp = $1 WHERE member_id = $2`, mobile_otp, memberId)
		if err != nil {
			return mobileID, err
		}
		mobileID = existingMobileID
	}

	return mobileID, nil
}

func GetLinkedStatusForMember(memberId string) (bool, error) {
	db := db.GetSQL()
	var mobile member.Mobile
	err := db.QueryRow(`SELECT linked_status from mobile where member_id=$1`, memberId).Scan(&mobile.LinkedStatus)

	if err != nil {
		if err == sql.ErrNoRows {
			return mobile.LinkedStatus, nil
		} else {
			return mobile.LinkedStatus, err
		}
	}

	return mobile.LinkedStatus, nil
}

func DeleteMobileForMember(memberID string) error {
	db := db.GetSQL()
	_, err := db.Exec(`DELETE FROM mobile WHERE member_id = $1`, memberID)
	if err != nil {
		return err
	}

	return nil
}
