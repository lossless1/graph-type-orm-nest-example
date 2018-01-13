/** Dependencies **/
import { find } from 'lodash';
import { Component, Inject } from '@nestjs/common';
import { createConnection, Connection, EntityManager, Repository, ObjectType, QueryRunner } from 'typeorm';

/** Config **/
import { DatabaseConfig } from '../../../../config/database.config';

@Component()
export class DatabaseProvider {

  private _connections: Connection[] = [];

  constructor(@Inject('DatabaseConfig') private readonly databaseConfig: DatabaseConfig) {
  }

  private async connection(connectionName: string = 'default'): Promise<Connection> {
    let connection: Connection = find(this._connections, {name: connectionName});

    if (!connection) {
      connection = await createConnection(find(this.databaseConfig, {name: connectionName}));

      this._connections.push(connection);
    }

    return connection;
  }

  /**
   * Method to get database connection.
   *
   * @param {string} connectionName
   * @returns {Promise<Connection>}
   */
  public async getConnection(connectionName: string = 'default'): Promise<Connection | never> {
    const connection: Connection = await this.connection(connectionName);

    if (!connection) {
      throw new Error();
    }

    return connection;
  }

  /**
   * Method to close connections.
   *
   * @returns {Promise<void>}
   */
  public async closeConnections(): Promise<void> {
    await Promise.all(this._connections.map(connection => {
      return connection.close();
    }));
  }

  /**
   * Method to create query runner.
   *
   * @param {"master" | "slave"} mode
   * @param {string} connectionName
   * @returns {Promise<QueryRunner>}
   */
  public async createQueryRunner(mode?: 'master' | 'slave', connectionName: string = 'default'): Promise<QueryRunner> {
    return (await this.getConnection(connectionName)).createQueryRunner(mode);
  }

  /**
   * Method to get database manager.
   *
   * @param {string} connectionName
   * @returns {Promise<EntityManager>}
   */
  public async getManager(connectionName: string = 'default'): Promise<EntityManager> {
    return (await this.getConnection(connectionName)).manager;
  }

  /**
   * Method to get entity repository.
   *
   * @param {ObjectType<T> | string} entityClassOrName
   * @param {string} connectionName
   * @returns {Promise<Repository<T>>}
   */
  public async getRepository<T>(entityClassOrName: ObjectType<T> | string, connectionName: string = 'default'): Promise<Repository<T>> {
    return (await this.getConnection(connectionName)).getRepository<T>(entityClassOrName);
  }

}
