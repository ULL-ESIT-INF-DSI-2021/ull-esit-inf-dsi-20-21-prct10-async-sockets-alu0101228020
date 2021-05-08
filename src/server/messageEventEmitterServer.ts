import {EventEmitter} from 'events';

/**
 * Server Message EventEmitter class
 */
export class MessageEventEmitterServer extends EventEmitter {
  /**
   * A handler or callback is registered that will be executed with each emission of the data event by the EventEmitter object
   * @param connection An EventEmitter object
   */
  constructor(connection: EventEmitter) {
    super();

    /**
     * This handler tries to store in a message a complete message received in pieces from the client
     * Each message ends with the character '\ n'
     */
    let data = '';
    connection.on('data', (dataChunk) => {
      data += dataChunk;

      let messageLimit = data.indexOf('\n');
      while (messageLimit !== -1) {
        const message = data.substring(0, messageLimit);
        data = data.substring(messageLimit + 1);
        this.emit('request', JSON.parse(message)); // A MessageEventEmitterServer object emits an event of type request
        messageLimit = data.indexOf('\n');
      }
    });
  }
}
