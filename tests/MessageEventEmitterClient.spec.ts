import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../src/client/MessageEventEmitterClient';

describe('MessageEventEmitterClient', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'title': 'e noe', 'body': 'hi i a red note', 'color': 'red'});
      done();
    });

    socket.emit('data', '{"title": "e noe",');
    socket.emit('data', '"body": "hi i a red note",');
    socket.emit('data', '"color": "red"}');
    socket.emit('end');
  });
});
