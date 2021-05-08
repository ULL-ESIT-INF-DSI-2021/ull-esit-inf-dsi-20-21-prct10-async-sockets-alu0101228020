import * as net from 'net';
import {ResponseType} from '../types';
import * as chalk from 'chalk';
import {Notes} from '../notes/notes';
import {Database} from '../notes/database';
import {MessageEventEmitterServer} from './MessageEventEmitterServer';
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
    const response: ResponseType = {
      type: 'add',
      success: true,
    };
    // Command line options depending on the type
    switch (request.type) {
      case 'add':
        // The object to be added is created by the indicated client information
        const add = new Notes(request.user, request.title, request.body, request.color);
        if (!database.addNote(add)) response.success = false;
        break;
      case 'modify':
        // The object to be modified is created by the indicated client information
        const modify = new Notes(request.user, request.title, request.body, request.color);
        response.type = 'modify';
        if (!database.modifyNote(modify.getName(), modify.getTitle(), modify.getBody(), modify.getColor())) response.success = false;
        break;
      case 'remove':
        // The object is deleted by the indicated client information
        response.type = 'remove';
        if (!database.removeNote(request.user, request.title)) response.success = false;
        break;
      case 'list':
        // The different objects of a user are listed by the indicated client information
        response.type = 'list';
        const notesArray = database.listNotes(request.user);
        if (notesArray.length == 0) response.success = false;
        else response.notes = notesArray;
        break;
      case 'read':
        // An object specified is read by the indicated client information
        response.type = 'read';
        const read = database.readNote(request.user, request.title);
        if (read == null) response.success = false;
        else response.notes = [read];
        break;
      default:
        console.log(chalk.red('Error: Invalid type registered'));
        break;
    }
    // A message is sent to the client, once the response is sent to the client
    connection.write(JSON.stringify(response), (err: any) => {
      if (err) console.log(chalk.red('\nError: The response could not be sent'));
      else {
        console.log(chalk.green('\nThe response has been sent successfully'));
        connection.end();
      }
    });
  });
});
// The server will be listening to the specified port,
// which is the port where the clients will have to connect in order to use the service
server.listen(60300, () => {
  console.log(chalk.cyanBright('Waiting for clients to connect...'));
});