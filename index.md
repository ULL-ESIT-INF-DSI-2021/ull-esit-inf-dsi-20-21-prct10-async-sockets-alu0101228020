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
