package server

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/Samudai/service-discord/controllers"
	"github.com/Samudai/service-discord/internal/discord"
	pkg "github.com/Samudai/service-discord/pkg/discord"
	"github.com/streadway/amqp"
)

var (
	rmqUser                              = os.Getenv("MQ_USERNAME")
	rmqPass                              = os.Getenv("MQ_PASSWORD")
	rmqHost                              = os.Getenv("MQ_IP")
	pointsDisperseExchange               = "@pointsDisperseExchange"
	pointsDisperseQueue                  = "@pointsDisperseQueue"
	customProductsPointsDisperseExchange = "@customProductsPointsDisperseExchange"
	customProductsPointsDisperseQueue    = "@customProductsPointsDisperseQueue"
	telegramPointsDisperseExchange       = "@telegramPointsDisperseExchange"
	telegramPointsDisperseQueue          = "@telegramPointsDisperseQueue"
	twitterPointsDisperseExchange        = "@twitterPointsDisperseExchange"
	twitterPointsDisperseQueue           = "@twitterPointsDisperseQueue"
)

type RabbitMQConnection struct {
	connection *amqp.Connection
	channel    *amqp.Channel
	connected  bool
}

func (r *RabbitMQConnection) Connect() {
	if r.connected {
		return
	}
	connStr := fmt.Sprintf("amqp://%s:%s@%s:5672/", rmqUser, rmqPass, rmqHost)
	var err error
	r.connection, err = amqp.Dial(connStr)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %s", err)
	}
	r.channel, err = r.connection.Channel()
	if err != nil {
		log.Fatalf("Failed to open a channel: %s", err)
	}

	r.connected = true
	fmt.Println("✅ Rabbit MQ Connection is ready")
}

func (r *RabbitMQConnection) DeclareExchangeAndQueue(exchangeName, qName string, exchangeType string, routingKey string) {
	err := r.channel.ExchangeDeclare(
		exchangeName,
		exchangeType,
		true,  // durable
		false, // auto-deleted
		false, // internal
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare an exchange: %s", err)
	}

	_, err = r.channel.QueueDeclare(
		qName,
		true,  // durable
		false, // delete when unused
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %s", err)
	}

	err = r.channel.QueueBind(
		qName,
		routingKey, // routing key
		exchangeName,
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		log.Fatalf("Failed to bind a queue: %s", err)
	}
}
func (r *RabbitMQConnection) Consume(qName string, handleIncomingNotification func(msg string)) {
	msgs, err := r.channel.Consume(
		qName,
		"",    // consumer
		false, // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,   // args
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %s", err)
	}

	for msg := range msgs {
		if msg.Body == nil {
			log.Println("Invalid incoming message")
			continue
		}

		handleIncomingNotification(string(msg.Body))

		err = msg.Ack(false)
		if err != nil {
			log.Printf("Failed to acknowledge message: %s", err)
		}
	}
}
func rmq_init() {
	mqConnection := &RabbitMQConnection{}
	mqConnection.Connect()
	mqConnection.DeclareExchangeAndQueue(pointsDisperseExchange, pointsDisperseQueue, "direct", "pointsDisperseRouting")
	mqConnection.DeclareExchangeAndQueue(customProductsPointsDisperseExchange, customProductsPointsDisperseQueue, "direct", "customProductsRouting")
	mqConnection.DeclareExchangeAndQueue(telegramPointsDisperseExchange, telegramPointsDisperseQueue, "direct", "telegramProductsRouting")
	mqConnection.DeclareExchangeAndQueue(twitterPointsDisperseExchange, twitterPointsDisperseQueue, "direct", "twitterRouting")
	go func() {
		mqConnection.Consume(pointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Gateway External: %s\n", msg)
			if strings.Contains(msg, "DiscordTip") {
				var received pkg.ActivityGuild
				err := json.Unmarshal([]byte(msg), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				Member, err := discord.GetMember(*received.To, "discord_user_id")
				if err != nil {
					if err.Error() == "member not found" || err.Error() == "internal server error" {
						received.IsMember = false
					} else {
						log.Printf("Failed to add member activity: %s", err)
					}
				} else {
					received.IsMember = true
					received.MemberID = &Member.MemberID
				}
				err = discord.AddActivityGuild(received)
				if err != nil {
					log.Printf("Failed to add activity: %s", err)
				}
				if received.IsMember {
					err = discord.AddMemberIDActivity(received)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
				} else {
					err = discord.AddMemberActivity(received)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
				}

				err = discord.UpdateMemberPointsNum(*received.To, received.PointId, float64(received.Points))
				if err != nil {
					log.Printf("Failed to add points to member: %s", err)
				}
			} else if strings.Contains(msg, "WalletTip") {
				var received pkg.ActivityWallet
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				hasNFT, err := discord.GetNFTsForWallet(*received.EventNftAddresses, received.WalletAddress, *received.ChainId)
				if err != nil {
					fmt.Errorf("something went wrong while getting NFT")
				}
				if (*received.EventNftAddresses != "" && hasNFT) || (*received.EventNftAddresses == "") {
					var receivedActivity pkg.ActivityGuild
					err = json.Unmarshal([]byte(unquote), &receivedActivity)
					if err != nil {
						fmt.Errorf("something went wrong")
					}
					Member, err := discord.GetMember(received.WalletAddress, "wallet_address")
					if err != nil {
						if err.Error() == "member not found" || err.Error() == "internal server error" {
							received.IsMember = false
						} else {
							log.Printf("Failed to add member activity: %s", err)
						}
					} else {
						received.IsMember = true
						received.MemberId = &Member.MemberID
						receivedActivity.IsMember = true
						receivedActivity.MemberID = &Member.MemberID
					}
					err = discord.AddActivityGuild(receivedActivity)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
					if received.IsMember {
						err = discord.AddMemberIDActivity(receivedActivity)
						if err != nil {
							log.Printf("Failed to add member activity: %s", err)
						}
						err = discord.UpdateMemberIDWalletsPointsNum(received.WalletAddress, received.PointId, float64(received.Points), *receivedActivity.MemberID)
						if err != nil {
							log.Printf("Failed to add points to member: %s", err)
						}
					} else {
						err = discord.AddWalletActivity(received)
						if err != nil {
							log.Printf("Failed to add activity: %s", err)
						}
						err = discord.UpdateMemberWalletsPointsNum(received.WalletAddress, received.PointId, float64(received.Points))
						if err != nil {
							log.Printf("Failed to add points to member: %s", err)
						}
					}
				}
			} else if strings.Contains(msg, "TeamTip") {
				var received pkg.ActivityWallet
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var receivedActivity pkg.ActivityGuild
				err = json.Unmarshal([]byte(unquote), &receivedActivity)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = discord.AddActivityGuild(receivedActivity)
				if err != nil {
					log.Printf("Failed to add activity: %s", err)
				}
				if received.IsMember {
					err = discord.AddMemberIDActivity(receivedActivity)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
					err = discord.UpdateMemberIDWalletsPointsNum(received.WalletAddress, received.PointId, float64(received.Points), *receivedActivity.MemberID)
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				} else {
					err = discord.AddWalletActivity(received)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
					err = discord.UpdateMemberWalletsPointsNum(received.WalletAddress, received.PointId, float64(received.Points))
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(customProductsPointsDisperseQueue, func(msg string) {
			if strings.Contains(msg, "CustomTip") {
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var received pkg.ActivityCustom
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var receivedActivity pkg.ActivityGuild
				err = json.Unmarshal([]byte(unquote), &receivedActivity)
				if err != nil {
					fmt.Errorf("something went wrong")
				}

				if received.Points == 0 {
					Member, err := discord.GetProductMemberAndPoints(received.ProductId, received.UniqueUserId, received.EventName)
					if err != nil {
						log.Printf("Failed to fetch Member: %s", err)
					}

					if Member.MemberID == "" {
						received.IsMember = false
						received.MemberId = &Member.MemberID
						receivedActivity.IsMember = false
						receivedActivity.MemberID = &Member.MemberID
					} else {
						received.IsMember = true
						received.MemberId = &Member.MemberID
						receivedActivity.IsMember = true
						receivedActivity.MemberID = &Member.MemberID
					}
					received.PointId = Member.PointID
					received.Points = Member.PointsNum
					received.ProductName = &Member.ProductName
					receivedActivity.PointId = Member.PointID
					receivedActivity.Points = Member.PointsNum
					receivedActivity.ProductName = &Member.ProductName
				} else {
					Member, err := discord.GetProductMember(received.ProductId, received.UniqueUserId, received.EventName)
					if err != nil {
						log.Printf("Failed to fetch Member: %s", err)
					}

					if Member.MemberID == "" {
						received.IsMember = false
						received.MemberId = &Member.MemberID
						receivedActivity.IsMember = false
						receivedActivity.MemberID = &Member.MemberID
					} else {
						received.IsMember = true
						received.MemberId = &Member.MemberID
						receivedActivity.IsMember = true
						receivedActivity.MemberID = &Member.MemberID
					}
					received.PointId = Member.PointID
					received.ProductName = &Member.ProductName
					receivedActivity.PointId = Member.PointID
					receivedActivity.ProductName = &Member.ProductName
				}

				err = discord.AddActivityGuild(receivedActivity)
				if err != nil {
					log.Printf("Failed to add activity: %s", err)
				}
				if received.IsMember {
					err = discord.AddMemberIDActivity(receivedActivity)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
					err = discord.UpdateMemberIDCustomPointsNum(received.ProductId, *received.ProductName, received.UniqueUserId, received.PointId, float64(received.Points), *receivedActivity.MemberID)
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				} else {
					err = discord.AddCustomActivity(received)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
					err = discord.UpdateCustomPointsNum(received.ProductId, *received.ProductName, received.UniqueUserId, received.PointId, float64(received.Points))
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(telegramPointsDisperseQueue, func(msg string) {
			if strings.Contains(msg, "TelegramTip") {
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var received pkg.ActivityTelegram
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var receivedActivity pkg.ActivityGuild
				err = json.Unmarshal([]byte(unquote), &receivedActivity)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				Member, err := discord.GetTelegramMember(received.JoineeChatId, received.GroupChatId, received.EventName)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				if Member.MemberID == "" {
					received.IsMember = false
					received.MemberId = &Member.MemberID
					receivedActivity.IsMember = false
					receivedActivity.MemberID = &Member.MemberID
				} else {
					received.IsMember = true
					received.MemberId = &Member.MemberID
					receivedActivity.IsMember = true
					receivedActivity.MemberID = &Member.MemberID
				}

				received.PointId = &Member.PointID
				received.Points = &Member.PointsNum
				receivedActivity.PointId = Member.PointID
				receivedActivity.Points = Member.PointsNum

				err = discord.AddActivityGuild(receivedActivity)
				if err != nil {
					log.Printf("Failed to add activity: %s", err)
				}
				if received.IsMember {
					err = discord.AddMemberIDActivity(receivedActivity)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
					err = discord.UpdateMemberIDTelegramPointsNum(received.JoineeChatId, received.JoineeFirstName, received.ChatName, *received.PointId, float64(*received.Points), *receivedActivity.MemberID)
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				} else {
					err = discord.AddTelegramActivity(received)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
					err = discord.UpdateMemberTelegramPointsNum(received.JoineeChatId, received.JoineeFirstName, received.ChatName, *received.PointId, float64(*received.Points))
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(twitterPointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Service X: %s\n", msg)
			if strings.Contains(msg, "TwitterTip") {
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var received pkg.ActivityTwitter
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var receivedActivity pkg.ActivityGuild
				err = json.Unmarshal([]byte(unquote), &receivedActivity)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				Member, err := controllers.GetCachedOrFetchMember(receivedActivity)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				if Member.MemberID == "" {
					received.IsMember = false
					received.MemberId = &Member.MemberID
					receivedActivity.IsMember = false
					receivedActivity.MemberID = &Member.MemberID
				} else {
					received.IsMember = true
					received.MemberId = &Member.MemberID
					receivedActivity.IsMember = true
					receivedActivity.MemberID = &Member.MemberID
				}

				switch received.Description {
				case "Follow":
					received.Points = float64(Member.Points.Follow)
					receivedActivity.Points = float64(Member.Points.Follow)
				case "Mention":
					received.Points = float64(Member.Points.Mention)
					receivedActivity.Points = float64(Member.Points.Mention)
				case "Like":
					received.Points = float64(Member.Points.Like)
					receivedActivity.Points = float64(Member.Points.Like)
				case "Retweet":
					received.Points = float64(Member.Points.Retweet)
					receivedActivity.Points = float64(Member.Points.Retweet)
				case "Quotes":
					received.Points = float64(Member.Points.Quote)
					receivedActivity.Points = float64(Member.Points.Quote)
				case "Hashtag":
					received.Points = float64(Member.Points.HashtagPoints)
					receivedActivity.Points = float64(Member.Points.HashtagPoints)
				}

				err = discord.AddActivityGuild(receivedActivity)
				if err != nil {
					log.Printf("Failed to add activity: %s", err)
				}
				if received.IsMember {
					err = discord.AddMemberIDActivity(receivedActivity)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
					err = discord.UpdateMemberIDTwitterPointsNum(received.ToTwitterUserId, received.ToTwitterUsername, received.PointId, float64(received.Points), *receivedActivity.MemberID)
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				} else {
					err = discord.AddTwitterActivity(received)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
					err = discord.UpdateMemberTwitterPointsNum(received.ToTwitterUserId, received.ToTwitterUsername, received.PointId, float64(received.Points))
					if err != nil {
						log.Printf("Failed to add points to member: %s", err)
					}
				}
			}
		})
	}()

	// mqConnection.Consume(walletPointsDisperseQueue, func(msg string) {
	// 	fmt.Printf("Received message from Webhook Samudai: %s\n", msg)

	// })

	select {}
}
