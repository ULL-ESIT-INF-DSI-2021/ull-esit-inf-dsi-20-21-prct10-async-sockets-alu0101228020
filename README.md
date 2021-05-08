# Desarrollo de Sistemas Informáticos - Grado en Ingeniería Informática - ULL

## Práctica 10 - Cliente y servidor para una aplicación de procesamiento de notas de texto

<p align="center">
    <a href="https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/actions/workflows/node.js.yml">
        <img alt="Tests" src="https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/actions/workflows/node.js.yml/badge.svg">
    </a>
    <a href='https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020?branch=main'>
        <img src='https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/badge.svg?branch=main' alt='Coverage Status' />
    </a>
    <a href='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/actions/workflows/sonarcloud.yml'>
        <img src='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/actions/workflows/sonarcloud.yml/badge.svg' alt='Quality Gate Status' />
    </a>
    <a href='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/actions/workflows/coveralls.yml'>
        <img src='https://github.com/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct10-async-sockets-alu0101228020/actions/workflows/coveralls.yml/badge.svg' alt='Quality Gate Status' />
    </a>
</p>

Para la realización de esta práctica, partiremos de la implementación de la aplicación de procesamiento de notas de texto que se llevó a cabo en la [Práctica 8](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/) realizando un servidor y un cliente haciendo uso de los sockets proporcionados por el módulo `net` de Node.js.

Se deberá poder solicitar, desde el cliente al servidor, las mismas funciones implementadas en la práctica 8, esto es, añadir, modificar, eliminar, listar y leer una nota de un usuario.

**Instrucciones de ejecución:** para ejecutar el programa debemos hacer uso de dos terminales. En una de ellas, debemos tener en ejecución el servidor por lo que ejecutamos `node dist/server/server.js`. En la otra terminal, para hacer uso de las funcionalidades del cliente, hay que ejecutar `node dist/client/client.js comando --parámetros`, donde en "comando" hay que indicar el comando que se quiere solicitar al servidor y en "--parámetros", los parámatros correspondientes dependiendo de cada funcionalidad. Como por ejemplo: `node dist/client/client.js add --user="Usuario" --title="Red note" --body="This is a red note" --color="blue"`.

Por último, se tendrá que comentar en un informe la solución diseñada explicando las decisiones de diseño que se han tomado.
