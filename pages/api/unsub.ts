import path from 'path'
import getConfig from 'next/config'
import * as lib from './lib'
import * as orm from './orm'
import express from 'express'
import sqlite3 from 'sqlite3'

process.on('unhandledRejection', (e) => {
  console.error(`<${Date()}>`, 'UNHANDLED_REJECTION_UNSUB', e);
});

process.on('uncaughtException', (e) => {
  console.error(`<${Date()}>`, 'UNCAUGT_EXCEPTION_UNSUB', e);
})

const dev = process.env.NODE_ENV === 'development';
const { serverRuntimeConfig } = getConfig();
const { PROJECT_ROOT, KEY_DAYS } = serverRuntimeConfig;

const db = new sqlite3.Database(path.resolve(PROJECT_ROOT, './database/data.db'));

export default async function Task(req: express.Request, res: express.Response) {

  const { email, key } = req.body;

  const errorRes = {
    result: 'error',
    message: 'Ошибка сервера. Попробуйте ещё раз через несколько минут.',
    body: {}
  };

  const unknowRes = {
    result: 'warning',
    message: `Почта ${email} не была указана на сайте, в качестве контакта, либо ключ запроса не совпадает или просрочен.`,
    body: {}
  };

  const getKeys: orm.Keys[] = await orm.getKeyByEmail(email);
  
  if (getKeys.length === 0) {
    return res.status(400).json(unknowRes);
  }
  if (getKeys[0].error === 1) {
    return res.status(500).json(errorRes);
  }
  
  if (getKeys[0].key !== key) {
    return res.status(400).json(unknowRes);
  }

  if ((Date.now() - getKeys[0].timestamp) > 3 * 24 * 3600 * 1000) {
    return res.status(400).json(unknowRes);
  }

  const isDeleted: orm.DeletedEmails[] = await orm.getEmailIsDeleted(email);

  const endMessage = 'не хотите чтобы эта почта была в стоп листе, напишите нам в ответ на письмо, по которому получили эту ссылку.'

  if (isDeleted.length !== 0) {
    if (isDeleted[0].error === 1) {
      return res.status(500).json(errorRes);
    }
    return res.status(400).json({
      result: 'warning',
      message: `Почта ${email} была добавлена в стоп лист ранее. Если Вы ${endMessage}`,
      body: {}
    });
  }

  const saveRes = await new Promise(resolve => {
    db.serialize(function() {
      const stmt = db.prepare("INSERT INTO deleted_emails (email, date) VALUES (?, ?)");
      const data = stmt.run(email, Date());
      resolve(data);
    });
  });

  return res.status(201).json({
    result: 'success',
    message: `Почта ${email} была успешно добавлена в стоп лист. Теперь её не смогут указывать в качестве контакта на нашем сайте. Если Вы случайно перешли по этой ссылке и ${endMessage}`,
    body: {
      
    }
  });
}
