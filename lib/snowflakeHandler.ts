import { Handler, ResourceConfig } from '@jagql/framework';
import {
  CreateFunction,
  DeleteFunction,
  FindFunction,
  HandlerCallback,
  JsonApiRequest,
  SearchFunction,
  UpdateFunction
} from '@jagql/framework/types/Handler';
import { logger } from '@utils';
import { createConnection, execute } from './snowflake';

class SnowflakeHandler {
  config: any = {};
  connection: any;

  constructor(config: any) {
    this.connection = createConnection();
    this.config = config;
  }

  ready: boolean = false;
  handlesSort: boolean = true;
  handlesFilter: boolean = true;

  initialise = (resConfig: ResourceConfig<any>) => {
    this.connection.connect((err: any) => {
      if (err) {
        logger.error('Unable to connect: ' + err.message);
      } else {
        logger.info('Successfully connected to Snowflake.');
        this.ready = true;
      }
    });
  };

  /**
   * for searching for resources that match some vague parameters.
   */
  search: SearchFunction = (request: JsonApiRequest, callback: HandlerCallback<any[], number>): void => {
    execute(this.connection).then(results => {
      console.log(JSON.stringify(results));
      callback(null, results, results.length);
    });
  };

  /**
   * for finding a specific resource by id.
   */
  find: FindFunction = (request: JsonApiRequest, callback: HandlerCallback<any>): void => {
    const {
      params: { id }
    } = request;

    execute(this.connection, `where ID=${id}`).then(results => {
      console.log(JSON.stringify(results));
      callback(null, results, results);
    });
  };

  close = () => {
    this.connection.destroy((err: any, conn: any) => {
      if (err) {
        console.error('Unable to disconnect: ' + err.message);
      } else {
        console.log('Disconnected connection with id: ' + this.connection.getId());
      }
    });
  };

  create: CreateFunction = (request: JsonApiRequest, newResource: any, callback: HandlerCallback<any>): void => {
    /* Not supported */
  };
  delete: DeleteFunction = (request: JsonApiRequest, callback: HandlerCallback<void>): void => {
    /* Not supported */
  };
  update: UpdateFunction = (
    request: JsonApiRequest,
    newPartialResource: Partial<any>,
    callback: HandlerCallback<any>
  ): void => {
    /* Not supported */
  };
}

export const snowflakeHandler = (config = {}): Handler => new SnowflakeHandler(config);
