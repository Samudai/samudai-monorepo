package controllers

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)

type Check struct {
	Str string `json:"str"`
	Int int    `json:"int"`
}

var (
	rmqUser                = os.Getenv("MQ_USERNAME")
	rmqPass                = os.Getenv("MQ_PASSWORD")
	rmqHost                = os.Getenv("MQ_IP")
	pointsDisperseExchange = "@pointsDisperseExchange"
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
func (r *RabbitMQConnection) SendToExchange(message, routingKey string) {
	if !r.connected {
		r.Connect()
	}

	err := r.channel.Publish(
		pointsDisperseExchange,
		routingKey, // routing key
		false,      // mandatory
		false,      // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        []byte(message),
		})
	if err != nil {
		log.Fatalf("Failed to publish a message: %s", err)
	}
}
func HandleExchangeReq(msg string) {
	mqConnection := &RabbitMQConnection{}
	mqConnection.Connect()
	mqConnection.SendToExchange(msg, "pointsDisperseRouting")
}
func RMQ_INIT() {
	mqConnection := &RabbitMQConnection{}
	mqConnection.Connect()
	select {}
}
