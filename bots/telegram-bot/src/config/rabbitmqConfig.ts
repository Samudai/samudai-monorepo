import client, { Connection, Channel, ConsumeMessage } from 'amqplib';


const rmqUser = process.env.MQ_USERNAME;
const rmqPass = process.env.MQ_PASSWORD;
const rmqhost = process.env.MQ_IP;

class RabbitMQConnection {
    connection!: Connection;
    channel!: Channel;
    private connected!: Boolean;

    async connect() {
        if (this.connected && this.channel) return;
        else this.connected = true;

        try {
            console.log(`⌛️ Connecting to Rabbit-MQ Server`);
            this.connection = await client.connect(`amqp://${rmqUser}:${rmqPass}@${rmqhost}:5672`);

            console.log(`✅ Rabbit MQ Connection is ready`);

            this.channel = await this.connection.createChannel();

            console.log(`🛸 Created RabbitMQ Channel successfully`);

            // await this.startListeningToNewMessages();
        } catch (error) {
            console.error(error);
            console.error(`Not connected to MQ Server`);
        }
    }

    // async startListeningToNewMessages() {
    //     await this.channel.assertExchange(API_EXCHANGE, 'fanout', {
    //         durable: true,
    //     });

    //     await this.channel.assertQueue(API_QUEUE, {
    //         durable: true,
    //     });

    //     await this.channel.bindQueue(API_QUEUE, API_EXCHANGE, '');

    //     this.channel.consume(
    //         API_QUEUE,
    //         (msg) => {
    //             {
    //                 if (!msg) {
    //                     return console.error(`Invalid incoming message`);
    //                 }

    //                 handleIncomingAPI_Req(msg);

    //                 this.channel.ack(msg);
    //             }
    //         },
    //         {
    //             noAck: false,
    //         }
    //     );
    // }

    async sendToExchange(exchange: string, routingKey: string, message: any) {
        try {
          if (!this.channel) {
            await this.connect();
          }
    
          this.channel.publish(
            exchange,
            routingKey,
            Buffer.from(JSON.stringify(message))
          );
        } catch (error) {
          console.error(error);
          throw error;
        }
      }
}

// const handleIncomingAPI_Req = (msg: ConsumeMessage) => {
//     try {
//         const parsedMessage = JSON.parse(msg?.content?.toString());
//         console.log('Parsed message: ', parsedMessage);
//         // Implement all the API Requests
//     } catch (error) {
//         console.error(`Error While Parsing the message`);
//     }
// };

const mqConnection = new RabbitMQConnection();

export default mqConnection;
