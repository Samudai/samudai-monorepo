package member

type Wallet struct {
	WalletID      int    `json:"id"`
	MemberID      string `json:"member_id"`
	WalletAddress string `json:"wallet_address"`
	ChainID       int    `json:"chain_id"`
	Default       bool   `json:"default"`
}

type WalletView struct {
	WalletID      int    `json:"wallet_id"`
	WalletAddress string `json:"wallet_address"`
	ChainID       int    `json:"chain_id"`
	Default       bool   `json:"default"`
}
