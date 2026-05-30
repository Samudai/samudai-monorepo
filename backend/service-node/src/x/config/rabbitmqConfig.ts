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

  async sendToExchange(exchange: string, routingKey: string, message: any) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      this.channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

const mqConnection = new RabbitMQConnection();

export default mqConnection;
