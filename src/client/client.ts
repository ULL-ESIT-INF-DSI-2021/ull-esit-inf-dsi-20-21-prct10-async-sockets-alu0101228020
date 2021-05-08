import * as net from 'net';
import {RequestType} from '../types';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {colours} from '../notes/notes';
import {MessageEventEmitterClient} from './MessageEventEmitterClient';

/**
 * Port connected by the client, which matches the port listened to by the server
 */
const client = net.connect({port: 60300});
const socket = new MessageEventEmitterClient(client);

/**
 * Type of request
 */
let request: RequestType = {
  type: 'add',
  user: '',
};

/**
 * Execution of the add function through this command
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'User\'s name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color. If the color is none of these: red, green, blue and yellow; Yelow is set by default',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // If the user does not choose between the colors: red, green, blue and yellow. Yellow is set by default
    let colourNote: colours = colours.yellow;
    if (typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string' && typeof argv.user === 'string') {
      Object.values(colours).forEach((value) => {
        if (argv.color == value) {
          colourNote = value;
        }
      });
      request = {
        type: 'add',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: colourNote,
      };
    }
  },
});

/**
 * Execution of the modify function through this command
 */
yargs.command({
  command: 'modify',
  describe: 'Modify a note',
  builder: {
    user: {
      describe: 'User\'s name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color. If the color is none of these: red, green, blue and yellow; Yellow is set by default',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // If the user does not choose between the colors: red, green, blue and yellow. Yellow is set by default
    if (typeof argv.user === 'string' && typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      let colourNote: colours = colours.yellow;
      Object.values(colours).forEach((value) => {
        if (argv.color == value) {
          colourNote = value;
        }
      });
      request = {
        type: 'modify',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: colourNote,
      };
    }
  },
});

/**
 * Execution of the remove function through this command
 */
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    user: {
      describe: 'User\'s name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      request = {
        type: 'remove',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
 * Execution of the list function through this command
 */
yargs.command({
  command: 'list',
  describe: 'List all the notes',
  builder: {
    user: {
      describe: 'User\'s name',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      request = {
        type: 'list',
        user: argv.user,
      };
    }
  },
});

/**
 * Execution of the read function through this command
 */
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    user: {
      describe: 'User\'s name',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string' && typeof argv.title === 'string') {
      request = {
        type: 'read',
        user: argv.user,
        title: argv.title,
      };
    }
  },
});

/**
 * Process arguments passed from command line to application
 */
yargs.parse();

/**
 * Print to the client console if the information has been sent successfully or not
 */
client.write(JSON.stringify(request) + '\n', (err) => {
  if (err) console.log(chalk.red('Data couldn\'t be sended\n'));
  else console.log(chalk.green('Data could be sent\n'));
});

/**
 * The event 'message' is executed that prints the response of the action performed in the client console
 */
socket.on('message', (request) => {
  switch (request.type) {
    // Add note
    case 'add':
      // If it is true, the confirmation message is sent and if not, an error message
      if (request.success == true) {
        console.log(chalk.green(`New note added! \nNote: If you do not choose between the colors: blue, red, green and yellow. Yellow is set by default.`));
      } else {
        console.log(chalk.red('Error: Note title taken!'));
      }
      break;
    case 'modify':
      // If it is true, the confirmation message is sent and if not, an error message
      if (request.success == true) {
        console.log(chalk.green(`Modified note! \nNote: If you do not choose between the colors: blue, red, green and yellow. Yellow is set by default.`));
      } else {
        console.log(chalk.red('Error: This is because the username or title is wrong'));
      }
      break;
    case 'remove':
      // If it is true, the confirmation message is sent and if not, an error message
      if (request.success == true) {
        console.log(chalk.green('Note removed!'));
      } else {
        console.log(chalk.red('Error: This is because the username or title is wrong'));
      }
      break;
    case 'list':
      if (request.success == true) {
        // If true, all notes for the specified user are returned
        console.log(chalk.green('Your notes: ' + '\n'));
        request.notes.forEach((note: any) => {
          console.log(chalk.keyword(note.color)('- Title: ' + note.title + '\n'));
        });
      } else {
        console.log(chalk.red(`Error: User not found!`));
      }
      break;
    case 'read':
      // If true, the note specified by the user is returned
      if (request.success == true) {
        console.log(chalk.keyword(request.notes[0].color)('- Title: ' + request.notes[0].title));
        console.log(chalk.keyword(request.notes[0].color)('- Body: ' + request.notes[0].body + '\n'));
      } else {
        console.log(chalk.red(`Error: This is because the username or title is wrong`));
      }
      break;
    // Default error
    default:
      console.log(chalk.red('Error: Invalid type registered'));
      break;
  };
});

/**
 * Connection error information
 */
client.on('error', (err) => {
  console.log(chalk.red(`Error: Connection could not be established: ${err.message}`));
});
