import sqlite3 from 'sqlite3'
import getConfig from 'next/config'
import path from 'path'

const { serverRuntimeConfig } = getConfig();
const { PROJECT_ROOT } = serverRuntimeConfig;
const db = new sqlite3.Database(path.resolve(PROJECT_ROOT, './database/data.db'));

export type Keys = {
  error: number
  email?: string
  key?: string
  timestamp?: number
}

/**
 * @param email 
 */

export function getKeyByEmail(email: string): Promise<Keys[]> {
  return new Promise(resolve => {
    db.serialize(function() {
      db.all(`SELECT * FROM keys WHERE email='${email}'`, function(err: Error, row: Keys[]) {
        if (err) {
          console.error(`<${Date()}>`, 'ERROR_GET_KEYS', err);
          resolve([{
            error: 1
          }]);
        }
        else {
          resolve(row);
        }
      });
    });
  });
}

export type DeletedEmails = {
  error: number
  email?: string
  date?: Date
}

/**
 * 
 * @param email 
 */

export function getEmailIsDeleted(email: string): Promise<DeletedEmails[]> {
  return new Promise(resolve => {
    db.serialize(function() {
      db.all(`SELECT * FROM deleted_emails WHERE email='${email}'`, function(err: Error, row: DeletedEmails[]) {
        if (err) {
          console.error(`<${Date()}>`, 'ERROR_GET_EMAIL_IS_DELETED', err);
          resolve([{
            error: 1
          }]);
        }
        else {
          resolve(row);
        }
      });
    });
  });
}