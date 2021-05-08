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

