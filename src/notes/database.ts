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
    if (fs.existsSync(`./database/${note.getName()}`) == true) {
      // If the note with the title does not exist
      if (fs.existsSync(`./database/${note.getName()}/${titleTogether}.json`) == false) {
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
    if (fs.existsSync(`./database/${name}`) == true) {
      // If the note with the title exists
      if (fs.existsSync(`./database/${name}/${titleTogether}.json`) == true) {
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
    if (fs.existsSync(`./database/${name}`) == true) {
      // If the note with the title exists
      if (fs.existsSync(`./database/${name}/${titleTogether}.json`) == true) {
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
    if (fs.existsSync(`./database/${name}`) == true) {
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
    if (fs.existsSync(`./database/${name}`) == true) {
      if (fs.existsSync(`./database/${name}/${titleTogether}.json`) == true) {
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
