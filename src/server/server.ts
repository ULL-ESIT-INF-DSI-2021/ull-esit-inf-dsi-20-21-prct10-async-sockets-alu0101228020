import * as net from 'net';
import {ResponseType} from '../types';
import * as chalk from 'chalk';
import {Notes} from '../notes/notes';
import {Database} from '../notes/database';
import {MessageEventEmitterServer} from './messageEventEmitterServer';

/**
 * Every time a client connects to the server, that handler runs
 * The handler parameter, that is, connection is a Socket object, with which we can send / receive data to / from the clients
 */
const server = net.createServer((connection) => {
  console.log(chalk.cyanBright('\nClient connected'));

  const socket = new MessageEventEmitterServer(connection);

  /**
   * Processing of request received by the server
   */
  socket.on('request', (message) => {
    const request = message;
    const database = new Database();
    console.log(chalk.cyanBright('Client\'s request has been received'));

    // Response type
    const response: ResponseType = {
      type: 'add',
      success: true,
    };

    // Command line options depending on the type
    switch (request.type) {
      // Add note
      case 'add':
        // The object to be added is created by the indicated client information
        const add = new Notes(request.user, request.title, request.body, request.color);
        // If successful, the success is true, otherwise false
        if (database.addNote(add) === false) {
          response.success = false;
        }
        break;
      // Modify note
      case 'modify':
        // The object to be modified is created by the indicated client information
        const modify = new Notes(request.user, request.title, request.body, request.color);
        response.type = 'modify';
        // If successful, the success is true, otherwise false
        if (database.modifyNote(modify.getName(), modify.getTitle(), modify.getBody(), modify.getColor()) === false) {
          response.success = false;
        }
        break;
      // Remove note
      case 'remove':
        // The object is deleted by the indicated client information
        response.type = 'remove';
        // If successful, the success is true, otherwise false
        if (database.removeNote(request.user, request.title) === false) {
          response.success = false;
        }
        break;
      // List note
      case 'list':
        // The different objects of a user are listed by the indicated client information
        response.type = 'list';
        const notesArray = database.listNotes(request.user);
        // If successful the event is true and the notes objects of the type are updated, otherwise it is false
        if (notesArray.length === 0) {
          response.success = false;
        } else response.notes = notesArray;
        break;
      // Read note
      case 'read':
        // An object specified is read by the indicated client information
        response.type = 'read';
        const read = database.readNote(request.user, request.title);
        // If successful the event is true and the notes object of the type is updated, otherwise it is false
        if (read == null) {
          response.success = false;
        } else response.notes = [read];
        break;
      // Default error
      default:
        console.log(chalk.red('Error: Invalid type registered'));
        break;
    }
    /**
     * A message is sent to the client, once the response is sent to the client
     */
    connection.write(JSON.stringify(response), (err: any) => {
      if (err) {
        console.log(chalk.red('\nError: The response could not be sent'));
      } else {
        console.log(chalk.green('\nThe response has been sent successfully'));
        connection.end();
      }
    });
  });
  connection.on('close', () => {
    console.log(chalk.cyanBright('\nA client has disconnected'));
  });
});

/**
 * The server will be listening to the specified port,
 * which is the port where the clients will have to connect in order to use the service
 */
server.listen(60300, () => {
  console.log(chalk.cyanBright('Waiting for clients to connect...'));
});
