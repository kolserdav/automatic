import Head from 'next/head'
import classnames from 'classnames'
import s from '../styles/Home.module.scss'

const sendMail = () => {
  fetch('api/mailer')
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.error(e))
}

export default function Home() {

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', () => {
      console.log(document.body.clientWidth)
    }); 
  }

  return (
    <div className={classnames(s.container, s.column, s.center)}>
      <Head>
        <title>Dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={classnames(s.header, s.fullScreen)}>
        <div className={classnames(s.shadow, s.column, s.center, s.fullScreen)}>
          <div className={classnames(s.headerText, s.centerText)}><h1>Автоматизация процессов обработки данных</h1></div>
          <div className={classnames(s.headerDescription, s.centerText)}>Создание простых и сложных скриптов выполняющих повторяющиеся действия при работе с данными на вашем ПК или веб сервисе</div>
        </div>
      </header>
      <div className={classnames(s.notice, s.column, s.center, s.fullScreen)}>
        <div className={s.line}></div>
        <div className={classnames(s.textNotice, s.centerText)}><h1>Хотите сократить время на частых повторяющихся действиях при работе с данными, но не знаете с чего начать?</h1></div>
        <div className={s.line}></div>
        <button className={classnames(s.askButton, s.button)}>Консультация</button>
      </div>
      <main className={classnames(s.main, s.column, s.start)}>
        <div className={classnames(s.stages, s.column)}>
          <div className={classnames(s.column, s.center)}>
            <div className={s.boldHeader}><h5>Как происходит процесс создания скрипта автоматизации?</h5></div>
            <div className={classnames(s.boldDesc, s.paddingSmall)}><p>Создание компьютерных программ состоит из нескольких этапов:</p></div>
          </div>
          <div className={classnames(s.column, s.center)}>
            <div className={classnames(s.stageCards, s.paddingSmall)}>
              <div className={classnames(s.stageCard, s.column, s.center)}>
                <img className={s.stageIcon} src="img/stages/1.svg"></img>
                <div className={classnames(s.boldHeader)}><h6>Определение проблемы</h6></div>
                <div className={classnames(s.boldDesc, s.paddingSmall)}><span>Вначале, нужно сформулировать проблему и поискать готовые решения. Если существующие средства не подходят, переходим ко второму этапу...</span></div>
              </div>
              <div className={classnames(s.stageCard, s.column, s.center)}>
                <img className={s.stageIcon} src="img/stages/2.svg"></img>
                <div className={classnames(s.boldHeader)}><h6>Выбор специалиста</h6></div>
                <div className={classnames(s.boldDesc, s.paddingSmall)}><span>На этом этапе делаются заявки на выполнение задачи. Ведутся переговоры с потенциальными исполнителями. Заключается договор с подходящим специалистом.</span></div>
              </div>
              <div className={classnames(s.stageCard, s.column, s.center)}>
                <img className={s.stageIcon} src="img/stages/3.svg"></img>
                <div className={classnames(s.boldHeader)}><h6>Уточнение деталей</h6></div>
                <div className={classnames(s.boldDesc, s.paddingSmall)}><span>Перед началом разработки, описать исполнителю все значимые детали будущей программы. В процессе обсуждения, формируется и утверждается Техническое задание (ТЗ), оно будет главным документом в оценке выполнения проекта.</span></div>
              </div>
              <div className={classnames(s.stageCard, s.column, s.center)}>
                <img className={s.stageIcon} src="img/stages/4.svg"></img>
                <div className={classnames(s.boldHeader)}><h6>Представление данных</h6></div>
                <div className={classnames(s.boldDesc, s.paddingSmall)}><span>Специалисту могут потребоваться образцы целевых данных. Обычно, их предоставление оговаривается ещё на этапе создания ТЗ.</span></div>
              </div>
              <div className={classnames(s.stageCard, s.column, s.center)}>
                <img className={s.stageIcon} src="img/stages/5.svg"></img>
                <div className={classnames(s.boldHeader)}><h6>Приёмка работы</h6></div>
                <div className={classnames(s.boldDesc, s.paddingSmall)}><span>Тестирование готовой программы. В случае, если утвержденная в ТЗ функция неправильно работает, исполнитель обязан её устранить.</span></div>
              </div>
              <div className={classnames(s.stageCard, s.column, s.center)}>
                <img className={s.stageIcon} src="img/stages/6.svg"></img>
                <div className={classnames(s.boldHeader)}><h6>Внедрение в процесс</h6></div>
                <div className={classnames(s.boldDesc, s.paddingSmall)}><span>После окончания разработки и тестировании при приёмке программа встраивается в то место где она решает определённую проблему.</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
