import Head from 'next/head'
import { useState, useRef } from 'react'
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
import { ThemeProvider, createMuiTheme } from '@material-ui/core'
import MyApp from './_app'
import { loadGetInitialProps } from 'next/dist/next-server/lib/utils'

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
  fontSize: '80px',
  marginTop: '40px'
};

const advIcon = {
  fontSize: '80px',
  margin: 'auto 30px auto 12px',
};

const sendMail = () => {
  fetch('api/mailer')
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.error(e))
}

const MyButton = (props) => {
  return <button className={classnames(n.askButton, 'button')}>{props.text}</button>
};


export default function Home(props) {

  const file: any = useRef();

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      const html = document.querySelector('html')
      console.log(document.body.clientWidth)
      console.log('scrollBar', html.offsetWidth)
    }); 
  }

  return (
    <ThemeProvider theme={theme}>
    <div className={classnames('container', 'column', 'center')}>
      <Head>
        <title>Dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={classnames(h.header)}>
        <div className={classnames(h.shadow, 'column', 'center', 'fullScreen')}>
          <div className={classnames(h.headerText, 'centerText')}><h1>Автоматизация процессов обработки данных</h1></div>
          <div className={classnames(h.headerDescription, 'centerText')}>Создание простых и сложных скриптов выполняющих повторяющиеся действия при работе с данными на вашем ПК или веб сервисе</div>
        </div>
      </header>
      <main className={classnames(s.main, 'column', 'start')}>
        <div className={classnames(n.notice, 'column', 'center', 'fullScreen')}>
          <div className={n.line}></div>
          <div className={classnames(n.textNotice, 'centerText')}><h1>Хотите сократить время на частых повторяющихся действиях при работе с данными, но не знаете с чего начать?</h1></div>
          <div className={n.line}></div>
          <div className={n.firstButton}>
            <MyButton text="Консультация" />
          </div>
        </div>
        <div className={classnames(s.stages, 'column')}>
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
            <MyButton text="Отправить заявку" />
          </div>
        </div>
        <div className={p.delimiter}></div>
        <div className={classnames(p.person, 'center')}>
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
        <div className={classnames(a.advantages, 'fullScreen')}>
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
            <h1 style={{position: 'relative', top: '20vh'}}>Закажите сегодня</h1>
          </div>
        </div>
      </main>
      <div className={classnames(t.form, 'center', 'column')}>
        <div className="boldHeader">
          <h3>Форма заказа</h3>
        </div>
        <div className="boldDesc">
          <p>Пожалуйста опишите проблему, тогда я смогу предложить решение.</p>
        </div>
        <label>Ваше имя:</label>
        <input placeholder="Иван Иванович" className='textField'></input>
        <label>Ваша почта</label>
        <input placeholder='example@mail.com' type='email' className='textField'></input>
        <label>Описание:</label>
        <textarea placeholder='Нужно автоматизировать процесс. Описание в файле.' className="textarea"></textarea>
        <div className={classnames('row', 'center', t.addFile)}
          onClick={() => {
            file.current.addEventListener('change', () => {
              console.log(file.current)
            })
            file.current.click();
          }}
        >
          <label style={{ cursor: 'pointer' }}>Файл:</label>
          <AttachFileIcon style={{ fontSize: '40px' }} color="error" />
          <input ref={file} hidden type="file"></input>
        </div>
      </div>
      <footer className={f.footer}>
        footer
      </footer>
    </div>
    </ ThemeProvider>
  )
}
