package dao

import (
	"encoding/json"

	"github.com/Samudai/samudai-pkg/db"
	"github.com/Samudai/service-dao/pkg/dao"
	"github.com/lib/pq"
)

func AddSubscriptionForDao(subscription dao.Subscription) (string, error) {
	db := db.GetSQL()
	var daoID string

	planJSON, err := json.Marshal(subscription.Plan)
	if err != nil {
		return daoID, err
	}

	err = db.QueryRow(`INSERT INTO stripe_subscription (dao_id, member_id, subscription_id, 
		customer_id, invoice_ids, subscription_status, quantity, current_period_end, current_period_start, plan, created_at) 
		VALUES ($1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING dao_id`,
		subscription.DaoID, subscription.MemberID, subscription.SubscriptionID,
		subscription.CustomerID, pq.Array(subscription.InvoiveId),
		subscription.SubscriptionStatus, subscription.Quantity, subscription.CurrentPeriodEnd,
		subscription.CurrentPeriodStart, planJSON, subscription.CreatedAt).Scan(&daoID)
	if err != nil {
		return daoID, err
	}

	return daoID, nil
}

func UpdateSubscriptionForDao(subscription dao.Subscription) error {
	db := db.GetSQL()

	planJSON, err := json.Marshal(subscription.Plan)
	if err != nil {
		return err
	}

	_, err = db.Exec(`UPDATE stripe_subscription SET invoice_ids = $2, subscription_status = $3, 
		quantity = $4, current_period_end = $5, current_period_start = $6, plan =$7 WHERE subscription_id = $1`,
		subscription.SubscriptionID, pq.Array(subscription.InvoiveId), subscription.SubscriptionStatus, subscription.Quantity,
		subscription.CurrentPeriodEnd, subscription.CurrentPeriodStart, planJSON)
	if err != nil {
		return err
	}

	return nil
}

func GetSubscriptionCountForDao(daoId string) (int, error) {
	db := db.GetSQL()
	var count int

	err := db.QueryRow(`SELECT COUNT(*) FROM stripe_subscription WHERE dao_id = $1`, daoId).Scan(&count)
	if err != nil {
		return count, err
	}

	return count, nil
}

func GetCustomerIdForDao(daoId string) (string, error) {
	db := db.GetSQL()
	var customerID string

	err := db.QueryRow(`SELECT customer_id FROM stripe_subscription WHERE dao_id = $1`, daoId).Scan(&customerID)
	if err != nil {
		return customerID, err
	}

	return customerID, nil
}

func AddCustomerForDao(customer dao.Customer) (string, error) {
	db := db.GetSQL()
	var customerID string

	addressJSON, err := json.Marshal(customer.Address)
	if err != nil {
		return customerID, err
	}

	err = db.QueryRow(`INSERT INTO stripe_customer (customer_id, name, email, address, phone) 
		VALUES ($1, $2, $3, $4, $5) RETURNING customer_id`,
		customer.CustomerID, customer.Name, customer.Email, addressJSON, customer.Phone).Scan(&customerID)
	if err != nil {
		return customerID, err
	}

	return customerID, nil
}

func UpdateCustomerForDao(customer dao.Customer) error {
	db := db.GetSQL()

	addressJSON, err := json.Marshal(customer.Address)
	if err != nil {
		return err
	}

	_, err = db.Exec(`UPDATE stripe_customer SET name = $2, email = $3, 
	address = $4, phone = $5 WHERE customer_id = $1`,
		customer.CustomerID, customer.Name, customer.Email, addressJSON, customer.Phone)
	if err != nil {
		return err
	}

	return nil
}
