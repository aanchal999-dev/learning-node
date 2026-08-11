import { InternalServerErrorException, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StoredUser } from 'src/common/types';

const logger = new Logger('StorageUtil');
const rootDir = process.cwd().endsWith('src') ? path.resolve(process.cwd(), '..') : process.cwd();
const filePath = path.join(rootDir, 'storage', 'data.json');

export async function readUsers(): Promise<StoredUser[]> {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData) as StoredUser[];
  } catch (error) {
    logger.error('Error reading data file', error);
    throw new InternalServerErrorException('Error reading storage data');
  }
}

export async function writeUsers(users: StoredUser[]): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    logger.error('Error writing data file', error);
    throw new InternalServerErrorException('Error saving user data');
  }
}
