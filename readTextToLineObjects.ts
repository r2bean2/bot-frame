import fs from 'fs';

export interface LineObject {
  line: string;
}

/**
 * Reads a .txt file and returns a list object with each line as a separate object.
 * @param filePath - The path to the .txt file to read
 * @returns An array of LineObject, where each object contains a single line from the file
 */
export function readTextToLineObjects(filePath: string): LineObject[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Split the content by newlines and handle both \n and \r\n
  const lines = fileContent.split(/\r?\n/);
  
  // Filter out empty lines and map each line to an object
  const lineObjects: LineObject[] = lines
    .filter(line => line.length > 0)
    .map(line => ({ line }));
  
  return lineObjects;
}