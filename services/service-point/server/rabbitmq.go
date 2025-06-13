package server

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/Samudai/service-point/controllers"
	"github.com/Samudai/service-point/internal/point"
	pkg "github.com/Samudai/service-point/pkg/point"
	"github.com/streadway/amqp"
)

var (
	rmqUser                              = os.Getenv("MQ_USERNAME")
	rmqPass                              = os.Getenv("MQ_PASSWORD")
	rmqHost                              = os.Getenv("MQ_IP")
	pointsDisperseExchange               = "@pointsDisperseExchange"
	pointsDisperseQueue                  = "@pointsDisperseQueueServicePoint"
	customProductsPointsDisperseExchange = "@customProductsPointsDisperseExchange"
	customProductsPointsDisperseQueue    = "@customProductsPointsQueueServicePoint"
	teamPointsDisperseExchange           = "@teamPointsDisperseExchange"
	teamPointsDisperseQueue              = "@teamPointsDisperseQueueServicePoint"
	telegramPointsDisperseExchange       = "@telegramPointsDisperseExchange"
	telegramPointsDisperseQueue          = "@telegramPointsDisperseQueueServicePoint"
	twitterPointsDisperseExchange        = "@twitterPointsDisperseExchange"
	twitterPointsDisperseQueue           = "@twitterPointsDisperseQueueServicePoint"
	referralPointsDisperseExchange       = "@referralPointsDisperseExchange"
	referralPointsDisperseQueue          = "@referralPointsDisperseQueuePoint"
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
	mqConnection.DeclareExchangeAndQueue(teamPointsDisperseExchange, teamPointsDisperseQueue, "direct", "teamDisperseRouting")
	mqConnection.DeclareExchangeAndQueue(telegramPointsDisperseExchange, telegramPointsDisperseQueue, "direct", "telegramProductsRouting")
	mqConnection.DeclareExchangeAndQueue(twitterPointsDisperseExchange, twitterPointsDisperseQueue, "direct", "twitterRouting")
	mqConnection.DeclareExchangeAndQueue(referralPointsDisperseExchange, referralPointsDisperseQueue, "direct", "referralDisperseRouting")

	go func() {
		mqConnection.Consume(pointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Gateway External: %s\n", msg)
			if strings.Contains(msg, "DiscordTip") {
				var received pkg.ActivityGuild
				err := json.Unmarshal([]byte(msg), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}

				var param pkg.FetchMemberParams
				param.Type = pkg.FetchMemberTypeDiscord
				param.DiscordUserID = received.To

				Member, err := point.FetchMember(param)
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
				if received.IsMember {
					err = point.UpdatePoints(*received.MemberID, received.PointId, float64(received.Points))
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
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
				var param pkg.FetchMemberParams
				param.Type = pkg.FetchMemberTypeWallet
				param.WalletAddress = &received.WalletAddress

				Member, err := point.FetchMember(param)
				if err != nil {
					if err.Error() == "member not found" || err.Error() == "internal server error" {
						received.IsMember = false
					} else {
						log.Printf("Failed to add member activity: %s", err)
					}
				} else {
					received.IsMember = true
					received.MemberId = &Member.MemberID
				}
				if received.IsMember {
					err = point.UpdatePoints(*received.MemberId, received.PointId, float64(received.Points))
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(teamPointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Webhook: %s\n", msg)
			if strings.Contains(msg, "TeamTip") {
				var received pkg.ActivityWallet
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				var param pkg.FetchMemberParams
				param.Type = pkg.FetchMemberTypeWallet
				param.WalletAddress = &received.WalletAddress

				Member, err := point.FetchMember(param)
				if err != nil {
					if err.Error() == "member not found" || err.Error() == "internal server error" {
						received.IsMember = false
					} else {
						log.Printf("Failed to add member activity: %s", err)
					}
				} else {
					received.IsMember = true
					received.MemberId = &Member.MemberID
				}
				if received.IsMember {
					err = point.UpdatePoints(*received.MemberId, received.PointId, float64(received.Points))
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(customProductsPointsDisperseQueue, func(msg string) {
			if strings.Contains(msg, "CustomTip") {
				var received pkg.ActivityCustom
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}

				if received.Points == 0 {
					PointId, MemberID, Points, ProductName, err := controllers.FetchProductAndMemberFxn(received.ProductId, received.UniqueUserId, received.EventName)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}

					if MemberID != "" {
						received.IsMember = true
					}
					received.MemberId = &MemberID
					received.PointId = PointId
					received.Points = Points
					received.ProductName = &ProductName
				} else {
					PointId, MemberID, ProductName, err := controllers.FetchProductAndMemberByIdFxn(received.ProductId, received.UniqueUserId)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}

					if MemberID != "" {
						received.IsMember = true
					}
					received.MemberId = &MemberID
					received.PointId = PointId
					received.ProductName = &ProductName
				}

				if received.IsMember {
					err = point.UpdatePoints(*received.MemberId, received.PointId, received.Points)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(referralPointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Webhook: %s\n", msg)
			if strings.Contains(msg, "ReferralTip") {
				var received pkg.ActivityCustom
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				if received.EventName == "referrer" {
					err := point.UpdateUsersInvited(received.ProductId, received.UniqueUserId, *received.ReferreUniqueUserId)
					if err != nil {
						fmt.Errorf("something went wrong while updating users")
					}
				}
				// if received.Points == 0 {
				// 	PointId, MemberID, Points, ProductName, err := controllers.FetchProductAndMemberFxn(received.ProductId, received.UniqueUserId, received.EventName)
				// 	if err != nil {
				// 		log.Printf("Failed to add member activity: %s", err)
				// 	}

				// 	if MemberID != "" {
				// 		received.IsMember = true
				// 	}
				// 	received.MemberId = &MemberID
				// 	received.PointId = PointId
				// 	received.Points = Points
				// 	received.ProductName = &ProductName
				// } else {
				PointId, MemberID, ProductName, err := controllers.FetchProductAndMemberByIdFxn(received.ProductId, received.UniqueUserId)
				if err != nil {
					log.Printf("Failed to add member activity: %s", err)
				}

				if MemberID != "" {
					received.IsMember = true
				}
				received.MemberId = &MemberID
				received.PointId = PointId
				received.ProductName = &ProductName
				// }

				if received.IsMember {
					err = point.UpdatePoints(*received.MemberId, received.PointId, received.Points)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(telegramPointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Telegram Bot: %s\n", msg)
			if strings.Contains(msg, "TelegramTip") {
				var received pkg.ActivityTelegram
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}

				var MemberID, PointId string
				var Points float64

				if *received.Points == 0 {
					MemberID, PointId, Points = controllers.GetTelegramMemberByUsernameFxn(*received.JoineeChatId, received.EventName, received.GroupChatId)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
					received.Points = &Points
				} else {
					MemberID, PointId = controllers.GetTelegramMemberByUsernameFxn1(*received.ToTelegramUsername, received.GroupChatId)
					if err != nil {
						log.Printf("Failed to add member activity: %s", err)
					}
				}

				if MemberID != "" {
					received.IsMember = true
				}
				received.MemberId = &MemberID
				received.PointId = &PointId

				if received.IsMember {
					err = point.UpdatePoints(*received.MemberId, *received.PointId, *received.Points)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
				}
			}
		})
	}()
	go func() {
		mqConnection.Consume(twitterPointsDisperseQueue, func(msg string) {
			fmt.Printf("Received message from Service-x: %s\n", msg)
			if strings.Contains(msg, "TwitterTip") {
				var received pkg.ActivityTwitter
				unquote, err := strconv.Unquote(msg)
				if err != nil {
					fmt.Errorf("something went wrong")
				}
				err = json.Unmarshal([]byte(unquote), &received)
				if err != nil {
					fmt.Errorf("something went wrong")
				}

				MemberID, Points := controllers.GetTwitterMemberByUserIdFxn(received.PointId, received.ToTwitterUserId, received.ToTwitterUsername)
				if err != nil {
					log.Printf("Failed to add member activity: %s", err)
				}

				if MemberID == "" {
					received.IsMember = false
					received.MemberId = &MemberID
				} else {
					received.IsMember = true
					received.MemberId = &MemberID
				}

				switch received.Description {
				case "Follow":
					received.Points = float64(Points.Follow)
				case "Mention":
					received.Points = float64(Points.Mention)
				case "Like":
					received.Points = float64(Points.Like)
				case "Retweet":
					received.Points = float64(Points.Retweet)
				case "Quotes":
					received.Points = float64(Points.Quote)
				case "Hashtag":
					received.Points = float64(Points.HashtagPoints)
				}

				if received.IsMember {
					err = point.UpdatePoints(*received.MemberId, received.PointId, received.Points)
					if err != nil {
						log.Printf("Failed to add activity: %s", err)
					}
				}
			}
		})
	}()
	select {}
}
