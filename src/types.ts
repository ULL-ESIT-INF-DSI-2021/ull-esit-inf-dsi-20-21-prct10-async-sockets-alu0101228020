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
