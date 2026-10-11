import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import * as amqp from "amqplib";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
    private channel: amqp.Channel;
    private connection: amqp.ChannelModel;
    private readonly logger = new Logger(QueueService.name);

    constructor(private readonly config: ConfigService) {}

    // On module initialization, we will connect to RabbitMQ
    async onModuleInit() {
        await this.connectToRabbitMQ();
    }

    // On module shutdown, we will gracefully close the connection and channel
    async onModuleDestroy() {
        await this.closeConnection();
    }

    // Establish connection to RabbitMQ and create a channel
    async connectToRabbitMQ() {
        try {
            const url = this.config.getOrThrow<string>('RABBITMQ_URL');
            this.connection = await amqp.connect(url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue("dum_queue", { durable: true }); // durable queue for persistence
            this.logger.log("Connected to RabbitMQ and created the channel");

            // Start listening for messages
            this.listenForMessages();
        } catch (error) {
            this.logger.error("Error connecting to RabbitMQ:", error);
            process.exit(1); // Exit the process if connection fails
        }
    }

    // Send a message via the manually created channel
    async sendMessage(payload: string) {
        try {
            const messageBuffer = Buffer.from(payload);
            this.channel.sendToQueue("dum_queue", messageBuffer, {
                persistent: true,
            });
            this.logger.log(`Message sent to queue 'dum_queue': ${payload}`);
        } catch (error) {
            this.logger.error("Error sending message to RabbitMQ:", error);
        }
    }

    // Listen for incoming messages from RabbitMQ
    async listenForMessages() {
        try {
            this.channel.consume(
                "dum_queue",
                (msg) => {
                    if (msg) {
                        const content = msg.content.toString();
                        this.logger.log(`Received message: ${content}`);

                        // Acknowledge the message after processing
                        this.channel.ack(msg);
                    } else {
                        this.logger.warn("No message received");
                    }
                },
                { noAck: false }
            ); // Disable auto-ack, need manual acknowledgment
        } catch (error) {
            this.logger.error("Error while listening for messages:", error);
        }
    }

    // Gracefully close the RabbitMQ connection and channel
    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
                this.logger.log("Channel closed");
            }
            if (this.connection) {
                await this.connection.close();
                this.logger.log("RabbitMQ connection closed");
            }
        } catch (error) {
            this.logger.error("Error closing RabbitMQ connection:", error);
        }
    }
}