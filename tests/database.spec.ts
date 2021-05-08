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
