import fs from 'fs'
import path from 'path'
import getConfig from 'next/config'
import { exec } from 'child_process'
import nodemailer from "nodemailer"
import * as lib from './lib'
import Cors from 'cors'

// TODO 
const cors = Cors({allowedHeaders: 'das'});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '11mb',
    },
  }
}

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      console.log(result)
      if (!req.headers.ip) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

process.on('unhandledRejection', (e) => {
  console.error(`<${Date()}>`, 'UNHANDLED_REJECTION', e);
});

process.on('uncaughtException', (e) => {
  console.error(`<${Date()}>`, 'UNCAUGT_EXCEPTION', e);
})

const dev = process.env.NODE_ENV === 'development';

const { serverRuntimeConfig } = getConfig();
const filesPath = path.resolve(serverRuntimeConfig.PROJECT_ROOT, 'files');

export default async function Task(req, res) {

  //await runMiddleware(req, res, cors);

  const { name, email, desc, files, device } = req.body;
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  
  if (ip) {
    if (ip.substr(0, 7) == "::ffff:") {
      ip = ip.substr(7)
    }
  }
  
  let rawDevice = JSON.parse(Buffer.from(device, 'base64').toString());
  rawDevice.ip = ip;
  rawDevice = JSON.stringify(rawDevice);
  const deviceId = lib.encodeBase64(rawDevice);
  
  let attachments = [];
  let stdError = null;
  const errorFiles = [];
  let createZip = null;

  const devicePath = `${filesPath}/${deviceId}`;
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
        errMess = 'Ваш предыдущий запрос ещё не обработан. Попробуйте через 1 минуту.';
        status = 403;
      }
      else {
        status = 500;
        console.log(`<${Date()}>`, 'ERROR_CREATE_DIR', rawDevice, deviceId, e);
      }
    }
    resolve({
      error: error,
      status: status,
      errMess: errMess
    });
  });

  if (createDir.error === 1) {
    return await res.status(createDir.status).json({
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
            console.log(`<${Date()}>`, 'ERROR_WRITE_FILE', files[i].name, rawDevice, deviceId, err);
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
          console.log(`<${Date()}>`, 'ERROR_CREATE_ZIP', devicePath);
          resolve(error);
        }
        resolve(0)
      });
    });
    if (createZip === 0) {
      attachments = [{
        filename: `${deviceId}.zip`,
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

  const dateNow = Date.now();

  const key = lib.encodeBase64(dateNow.toString());

  const userMessage = {
    from: 'automatic.uyem.ru',
    to: (dev)? '19_pek@mail.ru' : email,
    subject: "Автоматический ответ от сайта",
    text: `Здравствуйте, ${name}. Ваша почта была указана в качестве контакта на сайте https://automatic.uyem.ru. Если это были Вы, просто проигнорируйте данное сообщение. Но если это были не Вы пожалуйста перейдите по ссылке ниже, чтобы мы больше не присылали Вам своих предложений: https://automatic.uyem.ru/unsubscribe?e=${email}&k=${key}`, 
    html: `Здравствуйте, ${name}. Ваша почта была указана в качестве контакта на сайте https://automatic.uyem.ru. Если это были Вы, просто проигнорируйте данное сообщение. Но если это были не Вы пожалуйста перейдите по <a href="http://localhost:3000/unsubscribe?e=${email}&k=${key}">ссылке</a>, чтобы мы больше не присылали Вам своих предложений.`
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
          fs.rmdir(`${devicePath}`, { recursive: true }, (e) => { if (e !== null) console.error(`<${Date()}>`, 'ERROR_RMDIR_DEVICE', deviceId, e) });
          if (files.length > 0) {
            fs.unlink(`${devicePath}.zip`, (e) => { if (e !== null) console.error(`<${Date()}>`, 'ERROR_UNLINK_ZIP', deviceId, e) });
          }
        }, 60 * 1000)
      })
      .catch(e => {
        console.error(`<${Date()}>`, 'ERROR_SEND_ADMIN_EMAIL', adminMessage, e);
      });
  });


  if (errorFiles.length > 0) {
    return await res.status(400).json({
      result: 'warning',
      message: 'Заявка добавлена с предупреждением',
      body: {
        stdError: stdError,
        errorFiles: errorFiles
      }
    })
  }

  return await res.status(201).json({
    result: 'success',
    message: 'Заявка успешно отправлена!',
    body: {

    }
  });
}
