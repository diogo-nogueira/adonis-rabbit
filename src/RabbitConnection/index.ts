import { connect, Connection } from 'amqplib'
import { RabbitConfig } from '@ioc:Adonis/Addons/Rabbit'
import InvalidRabbitConfigException from '../Exceptions/InvalidRabbitConfigException'

export default class RabbitConnection {
  /**
   * Whether the connection has already been established
   */
  public hasConnection: boolean = false

  /**
   * The connection
   */
  private $connection: Connection

  /**
   * The credentials
   */
  private readonly $credentials: string

  /**
   * The hostname
   */
  private readonly $hostname: string

  /**
   * The protocol
   */
  private readonly $protocol: string

  /**
   * The params
   */
  private readonly $parameters: string

  constructor(private readonly rabbitConfig: RabbitConfig) {
    this.$credentials = this.handleCredentials(
      this.rabbitConfig.user,
      this.rabbitConfig.password
    )

    this.$hostname = this.handleHostname(
      this.rabbitConfig.hostname,
      this.rabbitConfig.port
    )

    this.$hostname = this.handleHostname(
      this.rabbitConfig.hostname,
      this.rabbitConfig.port
    )

    this.$protocol = this.handleProtocol(this.rabbitConfig.protocol)

    this.$parameters = this.handleParams(this.rabbitConfig.parameters)
  }

  /**
   * Returns the credentials
   *
   * @param user The username
   * @param password The password
   */
  private handleCredentials(
    user: RabbitConfig['user'],
    password: RabbitConfig['password']
  ) {
    if (!user) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ user')
    }

    if (!password) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ password')
    }

    return `${user}:${password}@`
  }

  /**
   * Returns the hostname
   *
   * @param hostname The hostname
   * @param port The port
   */
  private handleHostname(
    hostname: RabbitConfig['hostname'],
    port?: RabbitConfig['port']
  ) {
    if (!hostname) {
      throw new InvalidRabbitConfigException('Missing RabbitMQ hostname')
    }

    return port ? `${hostname}:${port}` : hostname
  }

  /**
   * Custom protocol
   *
   * @param protocol
   */
  private handleParams(parameters: RabbitConfig['parameters']) {
    if (!parameters) {
      parameters = {}
    }

    return parameters
  }

  /**
   * Custom params
   *
   * @param params
   */
  private handleProtocol(protocol: RabbitConfig['protocol']) {
    if (!protocol) {
      protocol = 'amqp://'
    }

    return protocol
  }

  /**
   * Returns the connection URL
   */
  public get url() {
    return [this.$protocol, this.$credentials, this.$hostname].join('')
  }

  /**
   * Returns the connection
   */
  public async getConnection() {
    if (!this.$connection) {
      this.$connection = await connect(this.url, this.$parameters)
    }

    return this.$connection
  }

  /**
   * Closes the connection
   */
  public async closeConnection() {
    if (this.hasConnection) {
      await this.$connection.close()
      this.hasConnection = false
    }
  }
}
