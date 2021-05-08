import {EventEmitter} from 'events';
/**
 * Client Message EventEmitter class
 */
export class MessageEventEmitterClient extends EventEmitter {
  /**
   * A handler or callback is registered that will be executed with each emission of the data event by the EventEmitter object
   * @param connection An EventEmitter object
   */
  constructor(connection: EventEmitter) {
    super();
    /**
     * A complete message received in pieces from the server is stored in data
     */
    let data = '';
    connection.on('data', (dataChunk) => {
      data += dataChunk;
    });
    /**
     * The MessageEventEmitterClient object emits an event of type message
     */
    connection.on('end', () => {
      const request = JSON.parse(data.toString());
      this.emit('message', request);
    });
  }
}