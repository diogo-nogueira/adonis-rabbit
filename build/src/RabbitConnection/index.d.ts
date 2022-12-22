import { Connection } from 'amqplib';
import { RabbitConfig } from '@ioc:Adonis/Addons/Rabbit';
export default class RabbitConnection {
    private readonly rabbitConfig;
    hasConnection: boolean;
    private $connection;
    private readonly $credentials;
    private readonly $hostname;
    private readonly $protocol;
    private readonly $parameters;
    constructor(rabbitConfig: RabbitConfig);
    private handleCredentials;
    private handleHostname;
    private handleParams;
    private handleProtocol;
    get url(): string;
    getConnection(): Promise<Connection>;
    closeConnection(): Promise<void>;
}
