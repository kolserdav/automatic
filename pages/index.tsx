import Head from 'next/head'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import classnames from 'classnames'
import h from '../styles/home/Header.module.scss'
import n from '../styles/home/Notice.module.scss'
import s from '../styles/home/Stage.module.scss'
import p from '../styles/home/Person.module.scss'
import a from '../styles/home/Adv.module.scss'
import e from '../styles/home/Enter.module.scss'
import f from '../styles/home/Footer.module.scss'
import t from '../styles/home/Task.module.scss'
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import FaceIcon from '@material-ui/icons/Face'
import StorageIcon from '@material-ui/icons/Storage'
import DoneOutLineIcon from '@material-ui/icons/DoneOutline'
import DevicesOtherIcon from '@material-ui/icons/DevicesOther'
import ContactSupportIcon from '@material-ui/icons/ContactSupport'
import DoneIcon from '@material-ui/icons/Done';
import AttachFileIcon from '@material-ui/icons/AttachFile'
import CloseIcon from '@material-ui/icons/Close'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { GoogleReCaptchaProvider, GoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useCookies } from 'react-cookie'

import { 
  ThemeProvider, 
  createMuiTheme,
  Button,
  Collapse,
  LinearProgress
} from '@material-ui/core'
import { 
  Alert,
  AlertTitle 
} from '@material-ui/lab'

const firstYear = 2020;
const maxSize = 5;
const allSize = 10;
const maxDesc = 14000;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#104b5d'
    },
    secondary: {
      main: '#5c093e'
    },
    action: {
      active: '#f78b00',
      disabled: '#df6300'
    },
    error: {
      main: '#970110'
    }
  }
})

const stageIcon = {
  margin: '0 auto 0 auto',
  fontSize: '4vh',
  marginTop: '40px'
};

const advIcon = {
  fontSize: '4vh',
  margin: 'auto 0 auto 0',
};

function toAnchor(selector) {
  var element = document.querySelector('#' + selector);
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

type MyButtonProps = {
  title: string
  onClick: () => void
  text: string
  disabled: boolean
}

const MyButton = (props: MyButtonProps) => {
  return <button disabled={props.disabled} title={props.title} onClick={props.onClick} className={classnames(n.askButton, (() => { if (props.disabled) return n.disabled })(), 'button')}>{props.text}</button>
};

type AlertProps = {
  result: 'error' | 'warning' | 'success' | 'info'
  message: string
  open: boolean
  handleClose: () => void
  button?: Element | null
}


const MyAlert = (props: AlertProps) => {

  useEffect(() => {
    
  }, [props]);

  let result: string = props.result;

  switch(props.result) {
    case 'error':
      result = 'Ошибка!';
      break;
    case 'warning':
      result = 'Внимание!';
      break;
    case 'success':
      result = 'Успешно!';
      break;
    case 'info':
      result = 'Действие!';
      break;
  }

  return (<Collapse in={props.open}>
    <Alert 
      severity={props.result}
      onClose={() => {}}
      action={!props.button?
        <Button className="alertButton" onClick={props.handleClose} color="inherit" size="small">
          <CloseIcon />
        </Button> : props.button
      }
    >
      <AlertTitle>{result}</AlertTitle>
      { props.message }
    </Alert>
  </Collapse>)
};


export async function getStaticProps() {
  return {
    props: {
      apiKey: process.env.CAPTCHA_SITE
    }
  }
}


export default function Home(props) {

  const [cookies, setCookie] = useCookies(['a']);

  const file: any = useRef();
  const checkbox: any = useRef();
  const recaptchaRef: any = useRef();

  const initialAlert: AlertProps = {
    result: 'info',
    open: false,
    message: 'Уведомление закрывается...',
    button: null,
    handleClose: () => {}
  };

  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ desc, setDesc ] = useState('');
  const [ files, setFiles ] = useState([]);
  const [ alert, setAlert ] = useState(initialAlert); 
  const [ tAHeight, setTAHeight ] = useState(5);
  const [ buttonDisabled, setButtonDisabled ] = useState(true);
  const [ checkCaptcha, setChackCaptcha ] = useState(false);
  const [ showPopup, setShowPopup ] = useState(false);
  const [ progress, setProgress ] = useState(false);

  const sendTask = async (token: string) => {
    const deviceId = btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      platform: navigator.platform
    }));
    const fileReaders = [];
    for (let i = 0; files[i]; i ++) {
      const reader = new FileReader();
      reader.readAsBinaryString(files[i]);
      await new Promise(resolve => {
        reader.addEventListener('load', (ev) => {
          fileReaders.push({
            name: files[i].name,
            type: files[i].type,
            size: files[i].size,
            buffer: ev.target.result
          });
          resolve(0);
        });
      });
    }
    fetch('api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        device: deviceId,
        name: name,
        email: email,
        desc: desc,
        files: fileReaders
      })
    })
      .then(r => r.json())
      .then(data => {
        setProgress(false);
        if (data.result === 'success') {
          checkbox.current.checked = false;
          setName('');
          setEmail('');
          setDesc('');
          setFiles([]);
          setTAHeight(5);
        }
        else {
          setButtonDisabled(false);
        }
        let button = null;
        if (data.body.stdError) {
          let dataButton = null;
          if (data.body.dataError) {
            dataButton = <Button className="alertButton" onClick={() => {
              setAlert({
                result: 'info',
                message: data.body.dataError.map((e, i) => <b key={i}>{e}<br/></b>),
                open: true,
                handleClose: () => { setAlert(initialAlert) }
              })
            }}>
              Детали
            </Button>
          }
          button = <Button className="alertButton" onClick={() => {
            setAlert({
              result: 'warning',
              message: data.body.stdError,
              open: true,
              button: dataButton,
              handleClose: () => { setAlert(initialAlert) }
            })
          }}>
            Подробнее
          </Button>
        }
        setAlert({
          open: true,
          result: data.result,
          message: data.message,
          button: button,
          handleClose: () => { setAlert(initialAlert) }
        })
      })
      .catch(e => {
        setProgress(false);
        setAlert({
          open: true,
          result: 'error',
          message: 'Сервер не доступен или отсутствует соединение с сетью.',
          handleClose: () => { setAlert(initialAlert) }
        })
      })
  }

  useEffect(() => {
    setShowPopup(cookies.a !== 'true');
    // TODO development mode
    /*if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        const html = document.querySelector('html')
        console.log(document.body.clientWidth)
        console.log('scrollBar', html.offsetWidth)
      }); 
    }*/
  }, [files, buttonDisabled]);

  const addFilesHandle = (e) => {
    const allFiles = e.target.files;
    let newSize = files.map(i => i.size);
    const fNewSize = newSize.reduce((a, b) => a + b, 0);
    let nNewSize = 0;
    let err = false;
    for (let i = 0; allFiles[i]; i ++) {
      if (allFiles[i].size > maxSize * 1000000) {
        err = true;
        setAlert({
          open: true,
          message: `Файл ${allFiles[i].name} имеет недопустимый размер!`,
          button: null,
          result: 'warning',
          handleClose: () => { setAlert(initialAlert) }
        });
        continue;
      }
      nNewSize += allFiles[i].size;
      if (fNewSize + nNewSize > allSize * 1000000) {
        err = true;
        setAlert({
          result: 'warning',
          message: 'Превышен максимальный размер файлов',
          open: true,
          handleClose: () => { setAlert(initialAlert) }
        });
        break;
      } 
      if (files.indexOf(allFiles[i].name) === -1) files.push(allFiles[i]); 
    }
    if (!err) {
      setAlert({
        result: 'info',
        message: `Добавлено ${allFiles.length} файлa(ов)`,
        open: true,
        handleClose: () => { setAlert(initialAlert) }
      });
    }
    setFiles([...files]);
  };
  
  const captchaChange = (e) => {
    console.log(e)
  };

  const onSubmit = (e) => {
    const recaptchaValue = recaptchaRef.current.getValue();
    console.log(recaptchaValue)
  };

  const title = 'Автоматизация процессов обработки данных';
  const description = 'Создание простых и сложных скриптов выполняющих повторяющиеся действия при работе с данными на вашем ПК или веб сервисе';

  return (
    <ThemeProvider theme={theme}>
      {progress? <div className='progress'>
        <LinearProgress color="primary" />
      </div> : ''}
      <div className={classnames('container', 'column', 'center')}>
        <Head>
          <title>{ title }</title>
          <meta name="robots" content="index,follow"></meta>
          <meta name="description" content={ description } />
          <meta name="keywords" content="автоматизация, автоматизация процессов, системы автоматизации, средства автоматизации, автоматизация работы, автоматизация технологических процессов, автоматизация предприятия, автоматизация деятельности, использование средств автоматизации, автоматизация систем управления, автоматизация производственных, автоматизация данных, автоматизация бизнеса, автоматизация учета, автоматизация информационных, автоматизация обработки, автоматизация обработки данных, программная автоматизация, автоматизация информационных систем" />
          <meta property="og:url" content="https://automatic.uyem.ru"/>
          <meta property="og:type" content="article" />
          <meta property="og:title" content={ title } />
          <meta property="og:description" content={ description } />
          <meta property="og:site_name" content="Automaticuyem" />
          <meta property="og:image" content="https://automatic.uyem.ru/img/home/header_background_700.webp" />
          <meta property="article:published_time" content="2020-11-3T13:16:59+01:00" />
          <meta property="article:author" content="Сергей Кольмиллер" />
          <meta name="google-site-verification" content="GOOGLEWM" />
          <meta name="yandex-verification" content="YANDEXWM" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header id="header" className={classnames(h.header)}>
          <div className={classnames(h.shadow, 'column', 'center', 'fullScreen')}>
            <div className={classnames(h.headerText, 'centerText')}><h1>Автоматизация процессов обработки данных</h1></div>
            <div className={classnames(h.headerDescription, 'centerText')}>Создание простых и сложных скриптов выполняющих повторяющиеся действия при работе с данными на вашем ПК или веб сервисе</div>
          </div>
        </header>
        <main className={classnames(s.main, 'column', 'start')}>
          <div className={classnames(n.notice, 'column', 'center', 'fullScreen')}>
            <div className={classnames(n.noticeBlock, 'column', 'center')}>
              <div className={n.line}></div>
              <div className={classnames(n.textNotice, 'centerText')}><h1>Хотите сократить время на частых повторяющихся действиях при работе с данными, но не знаете с чего начать?</h1></div>
              <div className={n.line}></div>
            </div>
            <div className={n.firstButton}>
              <MyButton disabled={false} title='Перейти к форме заказа' onClick={() => { toAnchor('task') }} text="Консультация" />
            </div>
          </div>
          <div id='stages' className={classnames(s.stages, 'column')}>
            <div className={classnames('column', 'center')}>
              <div className={'boldHeader'}><h4>Как проходит процесс создания скрипта автоматизации?</h4></div>
              <div className={classnames('boldDesc', 'big')}><p><u>Создание компьютерных программ состоит из нескольких этапов:</u></p></div>
            </div>
            <div className={classnames('column', 'center')}>
              <div className={classnames(s.stageCards, 'paddingSmall')}>
                <div className={classnames(s.stageCard)}>
                  <ReportProblemIcon style={stageIcon} color="error" />
                  <div className={classnames('boldHeader')}><h6>Определение проблемы</h6></div>
                  <div className={classnames('boldDesc', 'paddingSmall')}><span>Вначале, нужно сформулировать проблему и поискать готовые решения. Если существующие средства не подходят, переходим ко второму этапу...</span></div>
                </div>
                <div className={classnames(s.stageCard)}>
                  <FaceIcon style={stageIcon} color="error" />
                  <div className={classnames('boldHeader')}><h6>Выбор специалиста</h6></div>
                  <div className={classnames('boldDesc', 'paddingSmall')}><span>На этом этапе делаются заявки на выполнение задачи. Ведутся переговоры с потенциальными исполнителями. Заключается договор с подходящим специалистом.</span></div>
                </div>
                <div className={classnames(s.stageCard)}>
                  <ContactSupportIcon style={stageIcon} color="error" />
                  <div className={classnames('boldHeader')}><h6>Уточнение деталей</h6></div>
                  <div className={classnames('boldDesc', 'paddingSmall')}><span>Перед началом разработки, описать исполнителю все значимые детали будущей программы. В процессе обсуждения, формируется и утверждается Техническое задание (ТЗ), оно будет главным документом в оценке готовности проекта.</span></div>
                </div>
                <div className={classnames(s.stageCard)}>
                  <StorageIcon style={stageIcon} color="error" />
                  <div className={classnames('boldHeader')}><h6>Представление данных</h6></div>
                  <div className={classnames('boldDesc', 'paddingSmall')}><span>Специалисту могут потребоваться образцы целевых данных для тестирования программы. Обычно, их предоставление оговаривается ещё на этапе создания ТЗ.</span></div>
                </div>
                <div className={classnames(s.stageCard)}>
                  <DoneOutLineIcon style={stageIcon} color="error" />
                  <div className={classnames('boldHeader')}><h6>Приёмка работы</h6></div>
                  <div className={classnames('boldDesc', 'paddingSmall')}><span>Тестирование готовой программы. В случае, если утвержденная в ТЗ функция, или другая производная работает неправильно, исполнитель обязан её устранить.</span></div>
                </div>
                <div className={classnames(s.stageCard)}>
                  <DevicesOtherIcon style={stageIcon} color="error" />
                  <div className={classnames('boldHeader')}><h6>Внедрение в процесс</h6></div>
                  <div className={classnames('boldDesc', 'paddingSmall')}><span>После окончания разработки и тестирования, программа встраивается в то место где она решает свою задачу.</span></div>
                </div>
              </div>
              <MyButton disabled={false} title='Перейти к форме заказа' onClick={() => { toAnchor('task') }} text="Отправить заявку" />
            </div>
          </div>
          <div className={p.delimiter}></div>
          <div id='person' className={classnames(p.person, 'center')}>
            <div className={p.personDesc}>
              <div className={p.personName}><h4>Сергей Кольмиллер</h4></div>
              <div className={p.personSpec}><span><i>Программист</i></span></div>
              <div className={p.personList}>
                <li className={p.personLi}>Более 10-ти лет опыта в IT;</li>
                <li className={p.personLi}>Более 3-х лет в программировании;</li>
                <li className={p.personLi}>Более 20-ти успешно завершенных проектов;</li>
                <li className={p.personLi}>Полный список навыков на ЯП Javascript...</li>
              </div>
              <div className={p.personText}>
                <p>Зарегистрирован плательщиком налога на профессиональный доход в соответствии с Законом Республики Хакасия от 28.05.2020 № 16-ЗРХ «О введении в действие на территории Республики Хакасия специального налогового режима «Налог на профессиональный доход».</p>
              </div>
            </div>
            <div className={p.personImage}></div>
          </div>
          <div id='advantages' className={classnames(a.advantages, 'fullScreen')}>
            <div className={'boldHeader'}>
              <h3>Почему меня выбирают исполнителем?</h3>
            </div>
            <div className={classnames(a.advList, 'column')}>
              <div className={classnames(a.advItem, 'column')}>
                <div className={classnames(a.advText, 'row')}>
                  <DoneIcon style={advIcon} color="error" />
                  <div className={classnames('boldHeader', 'start')}><h5>Ответственное отношение к взятым на себя обязательствам</h5></div>
                </div>
                <div className={'boldDesc'}>Если берусь за дело, значит результат гарантирован. Потому что, перед принятием условий, всегда проверяю техническую возможность их исполнения</div>
              </div>
              <div className={classnames(a.advItem, 'column')}>
                <div className={classnames(a.advText, 'row')}>
                  <DoneIcon style={advIcon} color="error" />
                  <div className={classnames('boldHeader', 'start')}><h5>Высокий уровень самодисциплины</h5></div>
                </div>
                <div className={'boldDesc'}>Всё рабочее время посвящаю работе над проектом заказчика. Одновременно держу в разработке не более одного проекта</div>
              </div>
              <div className={classnames(a.advItem, 'column')}>
                <div className={classnames(a.advText, 'row')}>
                  <DoneIcon style={advIcon} color="error" />
                  <div className={classnames('boldHeader', 'start')}><h5>Наличие всех необходимых знаний и навыков</h5></div>
                </div>
                <div className={'boldDesc'}>Так как всему привык обучаться самостоятельно. Новые знания в своей профессиональной сфере приобретаю легко и быстро</div>
              </div>
              <div className={classnames(a.advItem, 'column')}>
                <div className={classnames(a.advText, 'row')}>
                  <DoneIcon style={advIcon} color="error" />
                  <div className={classnames('boldHeader', 'start')}><h5>Всегда на cвязи</h5></div>
                </div>
                <div className={'boldDesc'}>Даже после завершения проекта, в течении дня, нахожу время, чтобы ответить на все вопросы клиента</div>
              </div>
            </div>
          </div>
          <div className={e.sendNow}>
            <div className={e.wrapper}>
              <div className={e.header}><b>Закажите сегодня</b></div>
            </div>
          </div>
        </main>
        <div id='task' className={classnames(t.form, 'center', 'column')}>
          <div className="boldHeader">
            <h3>Форма заказа</h3>
          </div>
          <div className="boldDesc">
            <p>Пожалуйста опишите проблему, тогда я смогу предложить решение.</p>
          </div>
          <label className={t.label}>Ваше имя:</label>
          <input value={name} maxLength={64} onChange={(e) => {setName(e.target.value)}} placeholder="Иван Иванович" className='textField'></input>
          <label className={t.label}>Ваша почта:</label>
          <input value={email} maxLength={64} onChange={(e) => {setEmail(e.target.value)}} placeholder='example@mail.com' type='email' className='textField'></input>
          <label className={t.label}>Описание:</label>
          <span className={t.span}>Максимальное количество символов: { maxDesc }</span>
          <textarea value={desc} style={{height: `${tAHeight}em`}} maxLength={maxDesc} onChange={(e) => {
            const tAHeight = parseInt((e.target.value.length / 64).toFixed(0));
            if (tAHeight > 5) {
              setTAHeight(tAHeight);
            }
            setDesc(e.target.value);
          }} placeholder='Нужно автоматизировать процесс. Описание в файле.' className="textarea"></textarea>
          <span className={t.span}>Максимольный размер { maxSize }Mб. Максимальный объем { allSize }Mб.</span>
          <div className={classnames('row', 'center', t.addFile)}
            title='Добавить файлы'
            onClick={() => {
              file.current.click();
            }}
          >
            <label className={t.label} style={{cursor: 'pointer' }}>Файлы:</label>
            <AttachFileIcon style={{ fontSize: '2vh' }} color="error" />
            <input
              onChange={addFilesHandle} 
              ref={file} 
              hidden 
              multiple={true} 
              type="file"
            ></input>
          </div>
          <div className={classnames(t.files, 'column', 'center')}>{ files.map((f, i) => {
              return (
                <li className={classnames(t.liItem, 'row', 'center')} key={i}>{ f.name } <DeleteForeverIcon 
                  style={{ fontSize: '2.5vh',cursor: 'pointer' }}
                  color='error'
                  titleAccess='Удалить файл из списка'
                  onClick={(e) => {
                    const el: any = e.target;
                    const li = (el.tagName === 'path')? el.parentElement.parentElement : el.parentElement;
                    const newFiles = [];
                    for (let i = 0; files[i]; i ++) {
                      if (files[i].name !== li.innerText.trim()) {
                        newFiles.push(files[i]);
                      }
                      else {
                        setAlert({
                          result: 'info',
                          message: `Файл ${files[i].name} удален из списка.`,
                          open: true,
                          handleClose: () => { setAlert(initialAlert) }
                        });
                      }
                    }
                    setFiles([...newFiles]);
                  }} 
                /> </li>
              )
            }) }</div>
            <div className={classnames('row', 'center', 'text')}>
              <input 
                ref={checkbox}
                className='checkbox'
                type="checkbox"
                onChange={ (e) => {
                  setButtonDisabled(!e.target.checked);
                } }
              />
              <p>Ознакомился и принимаю <Link href="/rules"><a target='_blank' className='textLink'>пользовательское соглашение</a></Link> и <Link href="/policy"><a target='_blank' className='textLink'>политику конфиденциальности</a></Link></p>
            </div>
            <div className={t.sendButton}>
              <MyButton title="Отправить заявку" disabled={buttonDisabled} onClick={() => {
                setAlert({
                  open: true,
                  message: 'Антиспам проверка...',
                  button: null,
                  result: 'info',
                  handleClose: () => { setAlert(initialAlert) }
                });
                setTimeout(() => {
                  setButtonDisabled(true);
                  setProgress(true);
                }, 250)
                setChackCaptcha(true);
              }} text="Заказать" />
              {checkCaptcha? <GoogleReCaptchaProvider reCaptchaKey={props.apiKey}>
                <GoogleReCaptcha onVerify={(token) => {
                  setAlert({
                    open: true,
                    message: 'Отправка данных на сервер...',
                    button: null,
                    result: 'info',
                    handleClose: () => { setAlert(initialAlert) }
                  });
                  sendTask(token);
                  setChackCaptcha(false);
                }} />
              </GoogleReCaptchaProvider> : ''}
            </div>
            <div className='alert'>
              <MyAlert message={alert.message} handleClose={alert.handleClose} result={alert.result} open={alert.open} button={alert.button} />
            </div>
        </div>
        {showPopup? <div className={classnames('popup', 'row', 'center')}>
            <p>Сайт использует файлы cookies. Пожалуйста ознакомьтесь с <Link href="/policy"><a className='textLink'>Политикой конфиденциальности</a></Link></p>
            <button
              className="yellowButton"
              onClick={() => {
                setCookie('a', true, { path: '/', maxAge: 3 * 30 * 24 * 3600 });
                setShowPopup(false);
              }}
            >Хорошо</button>
          </div> : ''}
        <footer className={f.footer}>
          <div className={classnames(f.links, 'row', 'center')}>
            <a onClick={() => { toAnchor('header') }} className={f.link}>О сайте</a>
            <a onClick={() => { toAnchor('stages') }} className={f.link}>Процесс</a>
            <a onClick={() => { toAnchor('person') }} className={f.link}>Об авторе</a>
            <a onClick={() => { toAnchor('advantages') }} className={f.link}>Преимущества</a>
            <a onClick={() => { toAnchor('task') }} className={f.link}>Форма заказа</a>
          </div>
          <div className={classnames(f.links, 'column', 'start')}>
            <Link href='/rules'><a className='nextLink'>Правила использования</a></Link>
            <Link href='/policy'><a className='nextLink'>Политика конфиденциальности</a></Link>
          </div>
          <div className={f.copyright}>&copy; Все права защищены: {(() => { 
            const currentYear = new Date().getFullYear();
            return (firstYear === currentYear)? firstYear : `${firstYear} - ${currentYear}`;
          })()}</div>
        </footer>
      </div>
    </ ThemeProvider>
  )
}
