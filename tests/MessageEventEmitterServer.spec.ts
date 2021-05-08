import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterServer} from '../src/server/MessageEventEmitterServer';

describe('MessageEventEmitterServer', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterServer(socket);

    client.on('request', (message) => {
      expect(message).to.be.eql({'title': 'e noe', 'body': 'hi i a red note', 'color': 'red'});
      done();
    });

    socket.emit('data', '{"title": "e noe",');
    socket.emit('data', '"body": "hi i a red note",');
    socket.emit('data', '"color": "red"}');
    socket.emit('data', '\n');
  });
});
