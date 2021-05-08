# Informe Práctica 10

## Cliente y servidor para una aplicación de procesamiento de notas de texto

### 1. Introducción

Para la realización de esta práctica, partiremos de la implementación de la aplicación de procesamiento de notas de texto que se llevó a cabo en la [Práctica 8](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/) para escribir un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo `net` de Node.js.

Se deberá poder solicitar, desde el cliente al servidor, las mismas funciones implementadas en la práctica 8, esto es, añadir, modificar, eliminar, listar y leer una nota de un usuario. 

### 2. Objetivos

Esta práctica tiene como objetivos:

- Aprender a utilizar el módulo net de Node.js.
- Aprender  sobre la clase EventEmitter del módulo Events de Node.js.
- Aprender a trabajar con sockets cliente-servidor.

### 3. Tareas previas

Antes de comenzar a realizar dicha práctica, debemos realizar las siguientes tareas:

- Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/assignment-invitations/2040e575f8d4b7d81e9336c0d617baf0/status) asociada a esta práctica.
- Familiarizarse con el [módulo net de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/net.html).
- Familiarizarse con la clase [EventEmitter del módulo Events de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter).

### 4. Ejercicio

Para realizar el ejercicio, utilizaremos la estructura básica del proyecto dada en clase, además se deberá incluir todos los ejercicios en el directorio `./src` de dicho proyecto. 

Deberemos seguir la metodología **TDD** o **BDD** a través de las herramientas **Mocha y Chai** que implica confirmar el correcto funcionamiento del software, así como los casos en los que el software debería mostrar un error cuando la entrada no sea la correcta. También deberemos incluir otras pruebas unitarias que verifiquen que el software es robusto ante entradas no válidas o inesperadas. Utilizaremos también las herramientas **Instanbul** con **Coveralls**, **GitHub Action** y **Sonar Cloud** para obtener informes sobre el código y el cubrimiento del código fuente llevado a cabo por las pruebas que se hayan diseñado.

A parte de la realización del código fuente, también deberemos comentar todo el código a través del uso de la herramienta de **TypeDoc**.

Ahora bien, llevaremos a cabo el ejercicio propuesto a continuación, con sus correspondientes explicaciones.

### 4.1 Ejercicio - Descripción de los requisitos de la aplicación de procesamiento de notas de texto

Los requisitos que debe cumplir la aplicación de procesamiento de notas de texto son los enumerados a continuación:

1. La aplicación de notas deberá permitir que múltiples usuarios interactúen con ella.

2. Una nota estará formada, como mínimo, por un título, un cuerpo y un color (rojo, verde, azul o amarillo).

3. Cada usuario tendrá su propia lista de notas, con la que podrá llevar a cabo las siguientes operaciones:

- Añadir una nota a la lista. Antes de añadir una nota a la lista se debe comprobar si ya existe una nota con el mismo título. En caso de que así fuera, deberá mostrarse un mensaje de error por la consola del cliente. En caso contrario, se añadirá la nueva nota a la lista y se mostrará un mensaje informativo por la consola del cliente.

- Modificar una nota de la lista. Antes de modificar una nota, previamente se debe comprobar que exista una nota con el título de la nota a modificar en la lista. Si existe, se procede a su modificación y se emite un mensaje informativo por la consola del cliente. En caso contrario, debe mostrarse un mensaje de error por la consola del cliente.

- Eliminar una nota de la lista. Antes de eliminar una nota, previamente se debe comprobar que exista una nota con el título de la nota a eliminar en la lista. Si existe, se procede a su eliminación y se emite un mensaje informativo por la consola del cliente. En caso contrario, debe mostrarse un mensaje de error por la consola del cliente.

- Listar los títulos de las notas de la lista. Los títulos de las notas deben mostrarse por la consola del cliente con el color correspondiente de cada una de ellas. Use el paquete **chalk** para ello.

- Leer una nota concreta de la lista. Antes de mostrar el título y el cuerpo de la nota que se quiere leer, se debe comprobar que en la lista existe una nota cuyo título sea el de la nota a leer. Si existe, se mostrará el título y cuerpo de la nota por la consola del cliente con el color correspondiente de la nota. Para ello, use el paquete **chalk**. En caso contrario, se mostrará un mensaje de error por la consola del cliente.

- Todos los mensajes informativos se mostrarán con color verde, mientras que los mensajes de error se mostrarán con color rojo. Use el paquete **chalk** para ello.

- El servidor es responsable de hacer persistente la lista de notas de cada usuario.

- Guardar cada nota de la lista en un fichero con formato JSON. Los ficheros JSON correspondientes a las notas de un usuario concreto deberán almacenarse en un directorio con el nombre de dicho usuario.

- Cargar una nota desde los diferentes ficheros con formato JSON almacenados en el directorio del usuario correspondiente.

1. Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos del cliente. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete **yargs**.

**Clase Notes**

```ts
/**
 * Enum data type that has the different colors of the notes
 */
export enum colours { red = 'red', green = 'green', blue = 'blue', yellow = 'yellow' }

export class Notes {
  /**
    * Class that has the singleton pattern implemented and has a static object
    */
  constructor(private name: string, private title: string, private body: string, private color: colours) {}

  /**
    * Getter public method
    * @returns Username
    */
  getName() {
    return this.name;
  }

  /**
    * Getter public method
    * @returns Note title
    */
  getTitle() {
    return this.title;
  }

  /**
    * Getter public method
    * @returns Note body
    */
  getBody() {
    return this.body;
  }

  /**
    * Getter public method
    * @returns Note color
    */
  getColor() {
    return this.color;
  }
}
```

En primer lugar, debemos contar con la **clase Notes** realizada anteriormente. Como podemos ver contamos con los atributos privados esperados: name (nombre del usuario), title (título de la nota), body (cuerpo de la nota) y color (color de la nota). Todos los datos son tipo cadena menos el último que es de tipo `colours` que es un `enum` donde se almacena los colores permitidos: azul, rojo, amarillo y verde. Además, como son privados dichos atributos, contamos con sus getters correspondientes.

**Clase Database**

```ts
import * as fs from 'fs';
import {Notes, colours} from './notes';

export class Database {
  constructor() {}
  /**
   * Public method that allows adding a note with a JSON structure of a specific user
   * @param note Notes object to add
   * @returns Indicates the affirmative or negative status of the action
   */
  addNote(note: Notes): boolean {
    // Structure of the JSON of each user
    const structure = `{ "title": "${note.getTitle()}", "body": "${note.getBody()}" , "color": "${note.getColor()}" }`;

    // Create the filename with the title along
    const titleTogether = note.getTitle().split(' ').join('');

    // If the user exists
    if (fs.existsSync(`./database/${note.getName()}`) === true) {
      // If the note with the title does not exist
      if (fs.existsSync(`./database/${note.getName()}/${titleTogether}.json`) === false) {
        // The file is added and the filled structure is passed to it
        fs.writeFileSync(`./database/${note.getName()}/${titleTogether}.json`, structure);
        return true;
        // If the note with that title already made, shows the error message
      } else {
        return false;
      }
      // If the user does not exist, the folder is created and populated
    } else {
      fs.mkdirSync(`./database/${note.getName()}`, {recursive: true});
      fs.writeFileSync(`./database/${note.getName()}/${titleTogether}.json`, structure);
      return true;
    }
  }

  /**
     * Public method that allows modifying a note with a JSON structure of a specific user
     * @param name Username
     * @param title Note title
     * @param body Note body
     * @param color Note color
     * @returns Indicates the affirmative or negative status of the action
     */
  modifyNote(name: string, title: string, body: string, color: colours): boolean {
    // Structure of the JSON of each user
    const structure = `{ "title": "${title}", "body": "${body}" , "color": "${color}" }`;

    // Create the filename with the title along
    const titleTogether = title.split(' ').join('');

    // If the user exists
    if (fs.existsSync(`./database/${name}`) === true) {
      // If the note with the title exists
      if (fs.existsSync(`./database/${name}/${titleTogether}.json`) === true) {
        // The note is overwritten
        fs.writeFileSync(`./database/${name}/${titleTogether}.json`, structure);
        return true;
        // If the note with that title does not exist, shows the error message
      } else {
        return false;
      }
      // If the user does not exist, shows the error message
    } else {
      return false;
    }
  }

  /**
     * Public method that allows to delete a note from a specific user through the title
     * @param name Username
     * @param title Note title
     * @returns Indicates the affirmative or negative status of the action
     */
  removeNote(name: string, title: string): boolean {
    // Create the filename with the title along
    const titleTogether = title.split(' ').join('');

    // If the user exists
    if (fs.existsSync(`./database/${name}`) === true) {
      // If the note with the title exists
      if (fs.existsSync(`./database/${name}/${titleTogether}.json`) === true) {
        // The file is deleted
        fs.rmSync(`./database/${name}/${titleTogether}.json`);
        return true;
        // If the note with that title does not exist, shows the error message
      } else {
        return false;
      }
      // If the user does not exist, shows the error message
    } else {
      return false;
    }
  }

  /**
     * Public method that allows to list all the notes of a specific user with the corresponding titles
     * @param name Username
     * @returns Notes object arrays
     */
  listNotes(name: string): Notes[] {
    // If the user exists
    if (fs.existsSync(`./database/${name}`) === true) {
      // Scrolls through user notes
      const arrayNotes: Notes[] = [];
      fs.readdirSync(`./database/${name}/`).forEach((note) => {
        // The file is read and that structure is stored
        const data = fs.readFileSync(`./database/${name}/${note}`);
        const dataJSON = JSON.parse(data.toString());
        arrayNotes.push(new Notes(name, dataJSON.title, dataJSON.body, dataJSON.color));
      });
      return arrayNotes;
      // If the user does not exist, shows the error message
    } else {
      return [];
    }
  }

  /**
     * Public method that allows printing a specific note of a specific user
     * @param name Username
     * @param title Note title
     * @returns If the action has been performed, it returns the notes object and if not, it returns null
     */
  readNote(name: string, title: string): null | Notes {
    // Create the filename with the title along
    const titleTogether = title.split(' ').join('');
    // If the user exists
    if (fs.existsSync(`./database/${name}`) === true) {
      if (fs.existsSync(`./database/${name}/${titleTogether}.json`) === true) {
        // The file is read and that structure is stored
        const data = fs.readFileSync(`./database/${name}/${titleTogether}.json`);
        const dataJSON = JSON.parse(data.toString());
        return new Notes(name, dataJSON.title, dataJSON.body, dataJSON.color);
        // If the note with that title does not exist, shows the error message
      } else {
        return null;
      }
      // If the user does not exist, shows the error message
    } else {
      return null;
    }
  }
}
```

A continuación, tenemos la **clase Database** dónde están los métodos correspondientes que ejecutan las acciones necesarias de una nota indicada por una acción de un usuario.

**- addNote():** Este método público permite añadir una nota, para ellos debemos de pasarle un **objeto Notes** y este devuelve un booleano. En primer lugar, creamos la estructura, de cómo debería ser el JSON y también, como el nombre de los ficheros de cada nota de un usuario, será expresado por el título de la nota, en una nueva variable, hacemos uso del `split()` y `join()` para juntar el título ya que los nombres de los ficheros nunca están separados por espacios. El primero es en el que el usuario ya existe y para ello utilizamos la función`existsSync()` con la ruta `./database/${name}`, donde name será el parámetro pasado por la función. Si tenemos la carpeta de ese usuario, podemos encontrarnos con que el título pasado por la función no exista y por tanto, con el `writeFileSync()`, creamos un fichero `.json` en la ruta especificada y escribimos en ese fichero la estructura especificada más arriba y devolvemos true dado que la acción se ha realizado correctamente. En caso de que el título sí exista, devolvemos false. Y por último, el caso en el que el usuario no está en nuestra base de datos, ya que no tenemos una carpeta con su nombre, para ello, simplemente creamos dicha carpeta y escribimos en un fichero `.json` la estructura especificada y devolvemos true.

**- modifyNote():** Este método público permite modificar una nota ya registrada. Esta función sería idéntica a la anterior, salvo que, por parámetro, debemos pasarle todos los parámetros necesarios de una nota y si el usuario que ya existe, tiene una nota con ese mismo título, modificamos dicha nota y si nuestro usuario no está en nuestra base de datos, simplemente devolvemos false.

**- removeNote():** Este método público permite borrar una nota de un usuario en específico a través del título. Es similar a la función `modifyNote()`, salvo que solo hace falta como parámetro el nombre del usuario y el título de la nota, además si el título existe, deberemos borrar dicho fichero `.json` con la función `rmSync()` y devolver true.

**- listNotes():** Este método público permite listar todos los títulos de las distintas notas de un usuario. Para ello, simplemente le pasamos el nombre del usuario a la función y devolvemos un array de Notes. A través de la función `readdirSync()` con un `forEach()` leemos cada uno de los ficheros, que corresponde a cada nota del usuario. Almacenamos dicha información de la nota en una variable `data` y con la función `JSON.parse()` transformamos el valor producido por el análisis en JSON y la almacenamos en una nueva variable `dataJSON`. Al final, metemos en un nuevo array, nuevos objetos Notes con la información JSON del fichero actual y devolvemos dicho array. En caso de que el usuario no exista, devolvemos un array vacío [ ].

**- readNote():** Este método público permite leer una nota de un usuario donde se especifica dicha nota a través del título. Es bastante similar al método anterior, `listNotes()`, salvo que por parámetro necesitamos pasarle también el título y esta función devolverá un objeto Notes o un dato null. Una vez sabemos esto, podemos comprobar si dicho título existe para ese usuario, en caso afirmativo, realizamos lo mismo que la anterior función, salvo que no hará falta recorrer todas las notas ya que en este caso, solo es una nota en específico por lo que leemos dicha nota, guardamos la estructura, la pasamos a JSON y devolvemos el nuevo objeto Notes creado con la información del JSON. En caso de error, devolvemos null.

**Fichero types**

```ts
import {Notes} from './notes/notes';

/**
 * Type of request
 */
export type RequestType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    user?: string;
    title?: string;
    body?: string;
    color?: string;
  }

/**
  * Type of response
  */
export type ResponseType = {
    type: 'add' | 'modify' | 'remove' | 'read' | 'list';
    success: boolean;
    notes?: Notes[];
  }
```

Seguidamente, en este fichero, almacenaremos los types que utilizaremos como **solicitud y respuesta** de cliente a servidor.

El **type RequestType** contiene:

**- type:** cadenas que representan las acciones realizadas que puede solicitar el cliente.
**- user?:** de manera opcional, tenemos la cadena de información del nombre del usuario.
**- title?:** de manera opcional, tenemos la cadena de información del título de la nota.
**- body?:** de manera opcional, tenemos la cadena de información del cuerpo de la nota.
**- color?:** de manera opcional, tenemos la cadena de información del color de la nota.

El **type ResponseType** contiene:

**- type:** cadenas que representan las acciones realizadas que puede solicitar el cliente.
**- success:** booleano que permite decidir si la acción se ha llevado a cabo correctamente (true) o ha habido un error (false).
**- notes?:** de manera opcional, tenemos el array de **Notes** que almacena distintas notas de un usuario.

**Clase MessageEventEmitterServer**

```ts
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
```

Para el servidor, contamos con la clase **MessageEventEmitterServer** que recibe en su constructor un objeto **EventEmitter**. Luego, sobre dicho EventEmitter apuntado por connection, registramos un manejador o callback que se ejecutará con cada emisión del evento data por parte del objeto EventEmitter.

En `connection.on()`, este manejador trata de almacenar en message un mensaje completo recibido a trozos desde el cliente.

Para ello, en primer lugar, colocamos el límite del mensaje que viene señalado por el `\n` ya que cada mensaje finaliza con el carácter `\n`. Es por ello que el manejador siempre trata de encontrar dicho carácter en data. 

Una vez que se ha recibido un mensaje completo, esto es, que en data exista, al menos un caracter `\n` que es recogido dicho índice con la función `indexOf()`. Entonces, mientras el índice sea distinto de -1, sustraemos y almacenamos en la variable message desde la posición 0 hasta la cantidad de veces de caracteres a recorrer indicada por el índice anterior. Luego, actualizamos data, eliminando la cadena sustraída con `substring()` y hacemos que un objeto **MessageEventEmitterServer** emita un evento de tipo `request`, además de emitir también el message pero pasado a un objeto JSON con ayuda de la función `JSON.parse()`. Finalmente, actualizamos el índice sobre data con la función `indexOf()` buscando el siguiente mensaje completo que termine en `\n`.

**Fichero Server**

```ts
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
```

Seguidamente, tenemos la localización del **servidor**. Para ello, utilizamos el módulo `net` para crear un servidor que expone algún tipo de servicio a partir de un puerto predeterminado al cual se conectan los clientes que será el puerto **60300**.

El método `createServer()` nos permite recibir como parámetro un manejador y devolver un objeto Server. Cada vez que un cliente se conecta al servidor, dicho manejador se ejecuta. El parámetro del manejador, esto es, connection es un objeto Socket, con el cual podemos enviar/recibir datos a/desde los clientes.

Seguidamente, creamos un objeto socket que será un objeto proveniente de la clase **MessageEventEmitterServer**, donde se le pasa el manejador correspondiente, connection.

Una vez hecho esto, a través de la función `socket.on()`, procesamos la respuesta recibida del cliente. Entonces el evento `request` lanzado en la clase **MessageEventEmitterServer**, procesará el mensaje pasado por parámetro `message` que corresponderá a la información en JSON pasada por el cliente.

En primer lugar, guardamos dicho mensaje en una variable `message` y creamos un objeto de la **clase Database**. Luego inicializamos el **type ResponseType** que contendrá las respuestas del cliente. A través de un switch, donde se difieren los casos por el type especificado en la solicitud del cliente que corresponde a la acción a realizar, se llevará a cabo la llamada a las funciones de la clase Database que realizan las funcionalidades sobre los **objetos Notes**.

Contamos con el caso `add`, donde almacenamos en una variable un nuevo **objeto Notes** donde se le pasa la información correspondiente del JSON de la solicitud de información del cliente, es decir, de request. Luego, se realiza un if donde realizamos la llamada a la función `addNote()` a través del objeto Database y se le pasa por parámetro el objeto Notes a añadir en nuestra base de datos. Si al realizar dicha acción, el booleano de la función devuelve false, entonces el `success` del type de respuesta se deberá cambiar a `false`, si no, se quedará como predeterminado en true.

Para el caso `modify`, sucede exactamente lo mismo que en el anterior caso, salvo que de manera predeterminada, la propiedad type del type de respuesta está puesto `add` y aquí lo deberemos cambiar a `modify` y además, esta vez creamos el objeto correspondiente pero le pasamos a la función `modifyNote()`, los valores de dicho objeto.

En el caso `remove` actualizamos la propiedad type del type de respuesta como `remove` y simplemente, le pasamos a la función `removeNote()` la información de usuario y el título almacenado en el propio type request del cliente.

En el caso de `list` deberemos tener en cuenta cambiar la propiedad type del type de respuesta del cliente y además almacenar en una variable, el array de objetos Notes que devolverá la llamada a la función `listNotes()`, si el tamaño del array está a 0, entonces es cuando cambiamos el `success` a falso si no, deberemos actualizar el notes de respuesta, pasándole el array de Notes correspondiente.

Y por último, en el caso del `read` también actualizamos el type correspondiente y almacenamos el objeto o tipo de dato null que nos puede devolver la función `readNote()` y si dicho valor es null, entonces es cuando el success se pondrá a false y si no, actualizamos la propiedad notes del type de respuesta al cliente, con el objeto notes que devuelve la función.

Luego, tenemos la función `connection.write()` que le sigue que enviará el type de respuesta al usuario dependiendo de la acción y además, enviará un mensaje de confirmación o no, dependiendo de si el envío ha sido exitoso o no.

Cuando el cliente se desconecta, es decir, que la sesión acaba se lanza el evento `close` de `connection.on()` que permite imprimir un mensaje en la consola del cliente con la información de que el cliente ha sido desconectado.

Finalmente, a través de la función `server.listen()`, el servidor escucha a espera del cliente en el puerto especificado que es el 60300, que coincide con el puerto al que el cliente debe conectarse para poder utilizar el servicio.

**Clase MessageEventEmitterClient**

```ts
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
```

Para el cliente, contamos con la clase **MessageEventEmitterClient** que recibe en su constructor un objeto EventEmitter. Luego, sobre dicho EventEmitter apuntado por connection, registramos un manejador que se ejecutará con cada emisión del evento data por parte del objeto EventEmitter, como hemos dicho anteriormente para la clase **MessageEventEmitterServer**.

En `connection.on()`, se trata de almacenar en message un mensaje completo recibido a trozos desde el servidor.

Una vez que se ha recibido el mensaje completo, tenemos la función `connection.on()` con el evento `end` que finaliza el procesamiento, donde se escoge la respuesta a la solicitud realizada y hacemos que un objeto **MessageEventEmitterClient** emita un evento de tipo message, además de emitir también el request pero pasado a un objeto JSON con ayuda de la función `JSON.parse()`.

**Fichero client**

```ts
import * as net from 'net';
import {RequestType} from '../types';
import * as yargs from 'yargs';
import * as chalk from 'chalk';
import {colours} from '../notes/notes';
import {MessageEventEmitterClient} from './messageEventEmitterClient';

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
      describe: 'Note title to add',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body to add',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color to add. If the color is none of these: red, green, blue and yellow; Yelow is set by default',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // If the user does not choose between the colors: red, green, blue and yellow. Yellow is set by default
    let colourNote: colours = colours.yellow;
    if (typeof argv.title === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string' && typeof argv.user === 'string') {
      Object.values(colours).forEach((value) => {
        if (argv.color === value) {
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
      describe: 'Note title to modify',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note Body to modify',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note Color to modify. If the color is none of these: red, green, blue and yellow; Yellow is set by default',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    // If the user does not choose between the colors: red, green, blue and yellow. Yellow is set by default
    if (typeof argv.title === 'string' && typeof argv.user === 'string' && typeof argv.body === 'string' && typeof argv.color === 'string') {
      let colour: colours = colours.yellow;
      Object.values(colours).forEach((value) => {
        if (argv.color == value) {
          colour = value;
        }
      });
      request = {
        type: 'modify',
        user: argv.user,
        title: argv.title,
        body: argv.body,
        color: colour,
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
      describe: 'Note title to remove',
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
      describe: 'Note title to read',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string' && typeof argv.user === 'string') {
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
    case 'add':
      // If it is true, the confirmation message is sent and if not, an error message
      if (request.success === true) {
        console.log(chalk.green(`New note added! \nNote: If you do not choose between the colors: blue, red, green and yellow. Yellow is set by default.`));
      } else {
        console.log(chalk.red('Error: Note title taken!'));
      }
      break;
    case 'modify':
      // If it is true, the confirmation message is sent and if not, an error message
      if (request.success === true) {
        console.log(chalk.green(`Modified note! \nNote: If you do not choose between the colors: blue, red, green and yellow. Yellow is set by default.`));
      } else {
        console.log(chalk.red('Error: This is because the username or title is wrong'));
      }
      break;
    case 'remove':
      // If it is true, the confirmation message is sent and if not, an error message
      if (request.success === true) {
        console.log(chalk.green('Note removed!'));
      } else {
        console.log(chalk.red('Error: This is because the username or title is wrong'));
      }
      break;
    case 'list':
      if (request.success === true) {
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
      if (request.success === true) {
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
  }
});

/**
 * Connection error information
 */
client.on('error', (err) => {
  console.log(chalk.red(`Error: Connection could not be established: ${err.message}`));
});
```

Por último, tenemos la localización del **cliente** donde, nos conectamos inicialmente al puerto 60300 que coincide con el puerto escuchado por el servidor y creamos un objeto socket que será un objeto proveniente de la clase MessageEventEmitterClient, donde se le pasa el manejador correspondiente, client.

Seguidamente, tenemos inicializado el **type RequestType** y a través del `yargs`, donde permitirá coger la acción y los parámetros de dicha acción por línea de comandos del cliente, rellenaremos dicho type con dicha información, dependiendo de cada caso.

Luego tenemos la función `client.write()` que permite enviar el type de solicitud al servidor y escribir en la consola del cliente si ha sido exitoso o no la entrega del mensaje.

Una vez tenemos la respuesta del servidor, se lanza el evento `request` de `socket.on()` donde, a través del switch, diferimos los casos dependiendo de la acción realizada por el cliente especificada en el type del request. En los casos de **add, modify y remove**, dependiendo del success si es afirmativo (true), se imprimirá una respuesta de confirmación de la acción realizada y si es negativo (false), justo lo contrario. En el caso de **list**, si el success está a true, debemos recorrer el array de notes del request a través de un `forEach()` e ir imprimiendo por consola los títulos de cada una de las notas del array. Y en el caso de **read** simplemente, como sabemos que debe ser una única nota, a través del array de notes del request, cogemos la nota en la posición 0 e imprimimos los valores por pantalla.

Finalmente, cabe destacar que tenemos el `client.on()` que transmite un evento `error` en caso de que la conexión no se haya establecido.

Cabe destacar que en todos los ficheros, hacemos uso del **chalk**, donde permite colorear un mensaje ya sea indicado por el color de una nota dependiendo de la acción solicitada por el usuario o los mensajes de confirmación en verde y los mensajes de error transmitidos en rojo.

### 5. Tests

A continuación, destacamos el porcentaje exitoso del cubrimiento de código en los siguientes test realizados sobre los ficheros anteriormente hablados.

**Test clase Notes**

```ts
import 'mocha';
import {expect} from 'chai';
import * as fs from 'fs';
import {Notes, colours} from '../src/notes/notes';

describe('Ejercicio - Implementación de un cliente y un servidor de la aplicación de procesamiento de notas mediante Sockets en Node.js', () => {
  const notes = new Notes('Test', 'Prueba test', 'Probando test', colours.blue);

  describe('Notes class test', () => {
    it('It is a notes object', () => {
      expect(notes).not.to.be.equal(null);
    });

    it('notes.getName() returns Test', () => {
      expect(notes.getName()).to.be.equal('Test');
    });

    it('notes.getTitle() returns Prueba test', () => {
      expect(notes.getTitle()).to.be.equal('Prueba test');
    });

    it('notes.getBody() returns Probando test', () => {
      expect(notes.getBody()).to.be.equal('Probando test');
    });

    it('notes.getColor() returns blue', () => {
      expect(notes.getColor()).to.be.equal(colours.blue);
    });
  });
});
```

**Test clase Database**

```ts
import 'mocha';
import {expect} from 'chai';
import * as fs from 'fs';
import {Notes, colours} from '../src/notes/notes';
import {Database} from '../src/notes/database';

const database = new Database();

describe('Database class test', () => {
  it('It is a database object', () => {
    expect(database).not.to.be.equal(null);
  });

  describe('database.addNote() test', () => {
    it('notes.addNote() returns true', () => {
      expect(database.addNote(new Notes('Test', 'Prueba test', 'Probando test añadido', colours.blue))).to.be.equal(true);
    });
    it('notes.addNote() returns true', () => {
      expect(database.addNote(new Notes('Test', 'Prueba test 2', 'Probando test 2 añadido', colours.yellow))).to.be.equal(true);
    });
    it('notes.addNote() with fail returns false', () => {
      expect(database.addNote(new Notes('Test', 'Prueba test 2', 'Probando test 2 añadido', colours.yellow))).to.be.equal(false);
    });
  });

  describe('database.modifyNote() test', () => {
    it('notes.modifyNote() returns true', () => {
      expect(database.modifyNote('Test', 'Prueba test', 'Probando test modificado', colours.blue)).to.be.equal(true);
    });
    it('notes.modifyNote() with fail returns false', () => {
      expect(database.modifyNote('Test fail', 'Prueba test fail', 'Probando test modificado fail', colours.blue)).to.be.equal(false);
    });
    it('notes.modifyNote() with fail returns false', () => {
      expect(database.modifyNote('Test', 'Prueba test fail', 'Probando test modificado fail', colours.blue)).to.be.equal(false);
    });
  });

  describe('database.removeNote() test', () => {
    it('notes.removeNote() returns true', () => {
      expect(database.removeNote('Test', 'Prueba test')).to.be.equal(true);
    });
    it('notes.removeNote() with fail returns false', () => {
      expect(database.removeNote('Test fail', 'Prueba test fail')).to.be.equal(false);
    });
    it('notes.removeNote() with fail returns false', () => {
      expect(database.removeNote('Test', 'Prueba test fail')).to.be.equal(false);
    });
  });

  describe('database.listNotes() class test', () => {
    const notesTest = new Notes('Test', 'Prueba test 2', 'Probando test 2 añadido', colours.yellow);
    it('notes.listNotes() returns [notesTest]', () => {
      expect(database.listNotes('Test')).to.be.eql([notesTest]);
    });
    it('notes.listNotes() with fail returns []', () => {
      expect(database.listNotes('Test fail')).to.be.eql([]);
    });
  });

  describe('database.readNote() class test', () => {
    const notesTest = new Notes('Test', 'Prueba test 2', 'Probando test 2 añadido', colours.yellow);
    it('notes.readNote() returns notesTest', () => {
      expect(database.readNote('Test', 'Prueba test 2')).to.be.eql(notesTest);
    });
    it('notes.readNote() with fail returns null', () => {
      expect(database.readNote('Test', 'Prueba test fail')).to.be.equal(null);
    });
    it('notes.readNote() with fail returns null', () => {
      expect(database.readNote('Test fail', 'Prueba test fail')).to.be.equal(null);
    });
  });
});

fs.rmdirSync('./database', {recursive: true});
```
Aquí tenemos los test sobre **Notes**, que prueban los getters correspondientes de los atributos privados y luego los test sobre **Database**, que ya los habíamos realizado en la práctica 8, que prueban cada una de las acciones solicitadas por el usuario de manera manual.

**Test clase MessageEventEmitterServer**

```ts
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
```

**Test clase MessageEventEmitterClient**

```ts
import 'mocha';
import {expect} from 'chai';
import {EventEmitter} from 'events';
import {MessageEventEmitterClient} from '../src/client/messageEventEmitterClient';

describe('MessageEventEmitterClient', () => {
  it('Should emit a message event once it gets a complete message', (done) => {
    const socket = new EventEmitter();
    const client = new MessageEventEmitterClient(socket);

    client.on('message', (message) => {
      expect(message).to.be.eql({'title': 'Red note', 'body': 'This is a red note', 'color': 'red'});
      done();
    });

    socket.emit('data', '{"title": "Red note",');
    socket.emit('data', '"body": "This is a red note",');
    socket.emit('data', '"color": "red"}');
    socket.emit('end');
  });
});
```

Estos test son prácticamente iguales y como puede observarse, lo primero que hacemos dentro de la prueba es declarar un objeto **EventEmitter** apuntado por socket, que utilizaremos para emular el socket por el cual el servidor o cliente envía mensajes, posiblemente, en trozos, gracias a la emisión de diferentes eventos de tipo data. 

Además, también definimos un objeto **MessageEventEmitterClient** o **MessageEventEmitterServer** apuntado por client o server respectivamente, cuyo constructor recibe como argumento al objeto EventEmitter apuntado por socket. A continuación, registramos un manejador para el evento **message** o **request**, respectivamente, de nuestro objeto.

Y finalmente, se emiten cuatro eventos de tipo data, cada uno de ellos con un trozo del mensaje. En el server, el último evento `\n` se debe indicar para que se vea donde termina el mensaje y en el client, el último evento es `end`, haciendo la invocación al objeto que emite dicho evento.

### 6. Conclusiones

En conclusión, podemos destacar el gran uso de **sockets** familiarizándonos con el **módulo net de Node.js** al igual que la **clase EventEmitter del módulo Events de Node.js**. Es cierto que fue dificultoso y aparatoso el entendimiento en el inicio pero el mecanismo es bastante similar a anteriores prácticas de sockets de otras asignaturas, por lo tanto, se completó de manera satisfactoria los requisitos y objetos de la práctica, así como los consejos de implementación para esta práctica.

Finalmente, cabe decir que la funcionalidad de estos sockets entre servidor-cliente, nos permite acercarnos más al mundo real y a los protocolos de comunicaciones permitiendo enviar mensajes y transferir información de un lado a otro.

### 7. Bibliografía

* [Guión práctica 10](https://ull-esit-inf-dsi-2021.github.io/prct10-async-sockets/)
* [Apuntes de sockets de la asignatura](https://ull-esit-inf-dsi-2021.github.io/nodejs-theory/nodejs-sockets.html)
* [Documentación del paquete yargs](https://www.npmjs.com/package/yargs)
* [Documentación del paquete chalk](https://www.npmjs.com/package/chalk)
* [Módulo net de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/net.html)
* [Clase EventEmitter del módulo Events de Node.js](https://nodejs.org/dist/latest-v16.x/docs/api/events.html#events_class_eventemitter)
