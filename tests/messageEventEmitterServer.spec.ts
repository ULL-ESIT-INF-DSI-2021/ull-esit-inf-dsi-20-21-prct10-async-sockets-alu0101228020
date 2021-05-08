import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterServer} from '../src/server/messageEventEmitterServer';

describe('MessageEventEmitterServer', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const server = new MessageEventEmitterServer(socket);

    server.on('request', (message) => {
      expect(message).to.be.eql({'title': 'Red note', 'body': 'This is a red note', 'color': 'red'});
      done();
    });

    socket.emit('data', '{"title": "Red note",');
    socket.emit('data', '"body": "This is a red note",');
    socket.emit('data', '"color": "red"}');
    socket.emit('data', '\n');
  });
});
