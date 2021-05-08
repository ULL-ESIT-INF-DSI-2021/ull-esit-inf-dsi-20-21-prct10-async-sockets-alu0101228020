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