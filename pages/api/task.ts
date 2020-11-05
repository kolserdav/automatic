import fs, { read } from 'fs'
import path from 'path'
import getConfig from 'next/config'
import { exec } from 'child_process'
import nodemailer from "nodemailer"
import * as lib from './lib'
import * as orm from './orm'
import express from 'express'
import sqlite3 from 'sqlite3'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  }
}


process.on('unhandledRejection', (e) => {
  console.error(`<${Date()}>`, 'UNHANDLED_REJECTION_TASK', e);
});

process.on('uncaughtException', (e) => {
  console.error(`<${Date()}>`, 'UNCAUGT_EXCEPTION_TASK', e);
})

const dev = process.env.NODE_ENV === 'development';
const { serverRuntimeConfig } = getConfig();
const { PROJECT_ROOT, KEY_DAYS, CAPTCHA_SECRET } = serverRuntimeConfig;

const filesPath = path.resolve(PROJECT_ROOT, 'files');
const db = new sqlite3.Database(path.resolve(PROJECT_ROOT, './database/data.db'));

export default async function Task(req: express.Request, res: express.Response) {

  const { name, email, desc, files, device, _old } = req.body;

  const { token } = req.headers;

  if (_old !== 1) {
    const checkRecaptcha: any = await new Promise(resolve => {
      fetch('https://www.google.com/recaptcha/api/siteverify', { 
      method: 'post', 
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${CAPTCHA_SECRET}&response=${token}` 
    })
      .then(res => res.json())
      .then(json => resolve(json))
      .catch(e => {
        console.warn(`<${Date()}>`, 'ERROR_CHECK_CAPTCHA', e);
        resolve(1);
      });
    });
    
    if (checkRecaptcha === 1) {
      return res.status(502).json({
        result: 'error',
        message: 'Ошибка проверки капчи',
        body: {}
      });
    }
  
    if (!checkRecaptcha.success) {
      return res.status(403).json({
        result: 'warning',
        message: 'Неверный код капчи',
        body: {}
      });
    }
  }

  const errorRes = {
    result: 'error',
    message: 'Ошибка сервера. Попробуйте ещё раз через несколько минут.',
    body: {}
  };

  if (!device || !Array.isArray(files)) {
    return res.status(400).json({
      result: 'error',
      message: 'Неполный запрос',
      body: {}
    });
  }

  if (!name) {
    return res.status(400).json({
      result: 'warning',
      message: 'Имя не указано',
      body: {}   
    });
  }

  if (!email) {
    return res.status(400).json({
      result: 'warning',
      message: 'Почта не указана',
      body: {}   
    });
  }

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!re.test(String(email).toLowerCase())) {
    return res.status(400).json({
      result: 'warning',
      message: 'Почта имеет неверный формат',
      body: {}   
    }); 
  }

  const deletedRes: orm.DeletedEmails[] = await orm.getEmailIsDeleted(email);

  if (deletedRes.length !== 0) {
    if (deletedRes[0].error === 1) {
      return res.status(500).json(errorRes);
    }
    return res.status(403).json({
      result: 'warning',
      message: `Данная почта (${email}) была добавлена в стоп лист. Вы не сможете использовать её в качестве контакта на этом сайте.`,
      body: {
        stdError: 'Дата добавления в стоп лист:',
        dataError: [deletedRes[0].date]
      }
    });
  }

  if (!desc) {
    return res.status(400).json({
      result: 'warning',
      message: 'Описание не может быть пустым',
      body: {}   
    });
  }

  const dateNow = Date.now();
  const key = lib.encodeBase64(dateNow.toString());

  const getRes: any = await orm.getKeyByEmail(email);

  if (getRes === 1) {
    return res.status(500).json(errorRes);
  }
  
  let updateRes: any;

  if (getRes.length !== 0) {
    updateRes = await new Promise(resolve => {
      db.serialize(function() {
        db.all(`UPDATE keys SET timestamp='${dateNow}' WHERE email='${email}'`, (err: Error, row: any) => {
          if (err) {
            console.error(`<${Date()}>`, 'ERROR_UPDATE_TIMESTAMP', err);
            resolve(1);
          }
          else {
            resolve(row)
          }
        });
      });
    });
  }
  else {
    updateRes = await new Promise(resolve => {
      db.serialize(function() {
        const stmt = db.prepare("INSERT INTO keys (email, key, timestamp) VALUES (?, ?, ?)", (err: Error, row: orm.Keys[]) => {
          if (err) {
            console.error(`<${Date()}>`, 'ERROR_INSERT_KEYS', err);
            resolve(1);
          }
          else {
            resolve(row);
          }
        });
        stmt.run(email, key, dateNow);
      });
    });
  }
  if (updateRes === 1) {
    return res.status(500).json(errorRes);
  }

  let ip: any = req.headers['x-forwarded-for'];
  
  let rawDevice = JSON.parse(Buffer.from(device, 'base64').toString());
  rawDevice.ip = ip;
  rawDevice = JSON.stringify(rawDevice);
  const deviceId = lib.encodeBase64(rawDevice);
  
  let attachments = [];
  let stdError = null;
  const errorFiles = [];
  let createZip = null;

  const devicePath = `${filesPath}/${key}`;
  const createDir: any = await new Promise(resolve => {
    let status = 201;
    let error = 0;
    let errMess = 'Ошибка чтения данных. Попробуйте позже';
    try { 
      fs.mkdirSync(devicePath);
    }
    catch(e) {
      error = 1;
      if (e.message.match(/^EEXIST/)) {
        error = 0;
      }
      else {
        status = 500;
        console.log(`<${Date()}>`, 'ERROR_CREATE_DIR', rawDevice, key, e);
      }
    }
    resolve({
      error: error,
      status: status,
      errMess: errMess
    });
  });

  if (createDir.error === 1) {
    return res.status(createDir.status).json({
      result: 'error',
      message: createDir.errMess,
      body: {}
    });
  }
  if (files.length > 0) {
    for (let i = 0; files[i]; i ++) {
      const writeFile = await new Promise(resolve => {
        fs.writeFile(`${devicePath}/${files[i].name}`, files[i].buffer, 'binary', (err) => {
          if (err) {
            console.log(`<${Date()}>`, 'ERROR_WRITE_FILE', files[i].name, rawDevice, key, err);
            errorFiles.push(files[i].name);
            resolve(errorFiles);
          }
          else {
            resolve(0);
          }
        });
      });
      if (writeFile !== 0) stdError = 'Некоторые файлы не были записаны. Возможно причиной явились недопустимые символы в названии.';
    }

    createZip = await new Promise(resolve => {
      exec(`zip -r ${devicePath}.zip ${devicePath}`, (error, stdout, stderr) => {
        if (error) {
          console.log(`<${Date()}>`, 'ERROR_CREATE_ZIP', devicePath, error);
          resolve(error);
        }
        resolve(0)
      });
    });
    if (createZip === 0) {
      attachments = [{
        filename: `${key}.zip`,
        path: `${devicePath}.zip`
      }]
    }
  }

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'uyem.ru@gmail.com',
      pass: 'syrymbhvyvnpwqqa',
    },
  });

  const server = (dev)? 'http://localhost:3000' : 'https://automatic.uyem.ru';

  const userMessage = {
    from: 'automatic.uyem.ru',
    to: (dev)? '19_pek@mail.ru' : email,
    subject: "Автоматический ответ c сайта",
    text: `Здравствуйте, ${name}. Ваша почта была указана в качестве контакта на сайте https://automatic.uyem.ru. Если это были Вы, просто проигнорируйте данное сообщение. Но если это были не Вы пожалуйста перейдите по ссылке ниже, чтобы мы больше не присылали Вам своих предложений: ${server}/unsubscribe?e=${email}&k=${key} .Ссылка действительна в течении ${KEY_DAYS} дней.`, 
    html: `Здравствуйте, ${name}. Ваша почта была указана в качестве контакта на сайте https://automatic.uyem.ru. Если это были Вы, просто проигнорируйте данное сообщение. Но если это были не Вы пожалуйста перейдите по <a href="${server}/unsubscribe?e=${email}&k=${key}">ссылке</a>, чтобы мы больше не присылали Вам своих предложений. <i>Ссылка действительна в течении ${KEY_DAYS} дней.</i>`
  };

  const uM = transporter.sendMail(userMessage);
  const handleErr = new Promise(resolve => {
    uM.then(data => {
      resolve(0)
    })
    .catch(e => {
      resolve(e);
    })
  });
  handleErr.then(data => {
    let err = '';
    if (data !== 0) {
      err = `<tr>
        <td><b>Ошибка отправки письма клиенту:</b></td>
        <td>${data}</td>
      </tr>`
    }
    const adminMessage = {
      from: 'automatic.uyem.ru',
      to: "serega12101983@gmail.com",
      subject: "Заявка с сайта",
      text: "Hello world?", 
      html: `<table>
        <tr>
          <td><b>Имя:</b></td>
          <td>${name}</td>
        </tr>
        <tr>
          <td><b>Почта:</b></td>
          <td>${email}</td>
        </tr>
        <tr>
          <td><b>IP:</b></td>
          <td>${ip}</td>
        </tr>
        <tr>
          <td><b>Заголовки:</b></td>
          <td>${JSON.stringify(req.headers)}</td>
        </tr>
        <tr>
          <td><b>Данные с устройства:</b></td>
          <td>${rawDevice}</td>
        </tr>
        <tr>
          <td><b>ИД:</b></td>
          <td>${deviceId}</td>
        </tr>
        <tr>
          <td><b>Описание:</b></td>
          <td>${desc}</td>
        </tr>  
        <tr>
          <td><b>Ошибка записи:</b></td>
          <td>${stdError}</td>
        </tr> 
        <tr>
          <td><b>Файлы вызвавшие ошибку:</b></td>
          <td>${errorFiles}</td>
        </tr>
        <tr>
          <td><b>Ошибка создания архива:</b></td>
          <td>${createZip}</td>
        </tr> 
        ${err}
      </table>`, 
      attachments: attachments
    };
    transporter.sendMail(adminMessage)
      .then(result => {
        setTimeout(() => {
          if (createZip === 0) {
            fs.rmdir(`${devicePath}`, { recursive: true }, (e) => { if (e !== null) console.error(`<${Date()}>`, 'ERROR_RMDIR_DEVICE', deviceId, e) });
            if (files.length > 0) {
              fs.unlink(`${devicePath}.zip`, (e) => { if (e !== null) console.error(`<${Date()}>`, 'ERROR_UNLINK_ZIP', deviceId, e) });
            }
          }
        }, 6 * 1000)
      })
      .catch(e => {
        console.error(`<${Date()}>`, 'ERROR_SEND_ADMIN_EMAIL', adminMessage, e);
      });
  });


  if (errorFiles.length > 0) {
    return await res.status(400).json({
      result: 'success',
      message: 'Заявка добавлена с предупреждением.',
      body: {
        stdError: stdError,
        dataError: errorFiles
      }
    })
  }

  return await res.status(201).json({
    result: 'success',
    message: 'Заявка отправлена.',
    body: {

    }
  });
}
