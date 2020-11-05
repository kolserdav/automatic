import Link from 'next/link'
import s from '../styles/rules/Rules.module.scss'
import Head from 'next/head'
import classnames from 'classnames'

export default function Rules() {
  return (
    <div className={classnames(s.rules, 'column')} >
      <Head>
          <title>Соглашение</title>
          <meta name="robots" content="index,follow"></meta>
          <meta name="description" content="Пользовательское соглашение сайта https://automatic.uyem.ru" />
          <meta property="article:published_time" content="2020-11-6T00:12:52+01:00" />
          <meta property="article:author" content="Сергей Кольмиллер" />
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>
        Пользовательское соглашение.<br />
        <br />
        Данное соглашение прописывает отношения пользователя, отправляющего заявку на оказание услуги и владельца сайта, предлагающего свои услуги по созданию программного обеспечения. Информация о персональных данных пользователей содержится в <Link href="/policy"><a className={s.link}>Политике конфиденциальности</a></Link>.<br />
        Соглашение действует с момента отправки пользователем заявки через сайт и до завершения сотрудничества по его проекту.<br />
        Владелец сайта и разработчик ПО: Кольмиллер Сергей Давыдович (более подробная информация на <Link href="/#person"><a className={s.link}>главной странице</a></Link>).<br />
        <br />
        Термины и обозначения:<br />
        Задача по решению определенной проблемы ("Задача");<br />
        Программное обеспечение, решающее Задачу ("Программа");<br />
        Услуга по созданию Программы ("Услуга");<br />
        Исполнитель, оказывающий Услугу ("Исполнитель");<br />
        Заказчик, приобретающий результат оказания Услуги ("Заказчик");<br />
        Заказчик и Исполнитель совместно ("Стороны");<br />
        Сайт https://automatic.uyem.ru, являющийся платформой для обмена контактами Заказчика с Исполнителем ("Сайт");<br />
        Цена и сроки выполнения Задачи ("Условия");<br />
        Часть разработки программы, по временному отрезку: 1 - 2 недели ("Спринт");<br />
        Детальное описание проблемы, а также техническое задание, при необходимости с образцами, являющееся основным документом в оценке готовности Программы целиком или Спринта в отдельности  ("ТЗ");<br />
        Настоящее соглашение, устанавливающее правила и порядок деловых отношений Заказчика и Исполнителя, целью которых является: решение Задачи Заказчика, путём оказания Услуги Исполнителем за договорную оплату ("Соглашение").<br />
        <br />
        Условия Соглашения.<br />
        2.1. Выполнение условий Соглашения является обязательным для получения Услуги.<br />
        2.2. В общении, при обсуждении проекта, Стороны придерживаются делового этикета и взаимоуважения.<br />
        2.3. При возникновении вопросов по проекту от другой Стороны, стараются оперативно на них отвечать.<br />
        2.4. Спорные ситуации между Сторонами решаются в соответствии с действующим законодательством РФ.<br />
        <br />
        Порядок оказания Услуги.<br />
        3.1. Для получения Услуги Заказчик заполняет форму на Сайте.<br />
        3.1.1. Без детального описания Задачи заявки не рассматриваются. <br />
        3.2. Исполнитель в течение 3-х рабочих дней рассматривает заявку и присылает ответ на почту Заказчика.<br />
        3.2.1. В ответе Исполнителя могут содержаться:<br />
        "Условия" по выполнению Задачи.<br />
        Вопросы, уточняющие ТЗ, для определения Условий по Услуге.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.2.1.1. Если объём Задачи превышает по времени 10 рабочих дней, Задача разбивается на Спринты. Если нет, то считается, что Задача решается за один Спринт.<br />
        &nbsp;&nbsp;3.3. После получения ответа от Исполнителя, Заказчик  в течение 3-х рабочих дней направляет ответ о принятии Условий, либо уточнение деталей по вопросам Исполнителя.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;3.3.1. Отсутствие ответа от Заказчика по истечении 3-х рабочих дней расценивается как непринятие Условий, предложенных Исполнителем, или нежелание продолжать сотрудничество.<br />
        &nbsp;&nbsp;3.4. После принятия условий Заказчик вносит предоплату в размере 30% от стоимости первого Спринта.<br />
        3.4.1. Если по какой-то причине Исполнитель не справится с Задачей, сумма предоплаты будет возвращена, в полном объеме, на счет Заказчика.<br />
        &nbsp;&nbsp;3.5. После начала работы Исполнитель, при необходимости, запрашивает у Заказчика тестовые данные для работы Программы.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;3.5.1. Заказчик может предоставить данные либо оплатить отдельным переводом их создание Исполнителем.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.5.1.1. Структуру тестовых данных следует оговаривать в ТЗ до принятия Условий.<br />
        &nbsp;&nbsp;3.6. По завершению Спринта разработки, Исполнитель представляет тестовую копию текущей версии Программы.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;3.6.1. Представление тестовой копии может быть в следующих видах:<br />
        &nbsp;&nbsp;&nbsp;&nbsp;- Подробный видео-отчет с демонстрацией и комментариями всех функций Программы целиком или текущего Спринта;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;- Развертывание Программы на сервере Исполнителя, при условии, что в Программе предусмотрено удаленное управление, сроком на 1 рабочий день, свыше 1-го дня оплата работы сервера за счёт Заказчика.<br />
          &nbsp;&nbsp;&nbsp;&nbsp;- Развертывание на сервере Заказчика, при условии, что ключи от сервера, до оплаты Спринта будут только у Исполнителя. По времени не ограничено.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;- Предоставление пробной 2-х дневной версии, при условии оплаты не менее 2-х предыдущих Спринтов.<br />
        <br />
        4. Тестирование и приемка работы.<br />
        4.1. Тестирование или ознакомление с обзором Программы проводится Заказчиком в течение 2-х рабочих дней.<br />
        4.2. В случае обнаружения ошибок (неверной логики Программы) или багов (неверной реакции Программы), Заказчик предупреждает об этом Исполнителя. Исполнитель, в течение 2-х рабочих дней, устраняет неполадки за свой счет, при условии, что требования Заказчика не выходят за рамки утвержденного ТЗ.<br />
        4.3. Пока Заказчик тестирует Спринт, Исполнитель, в течение времени тестирования отвечает на вопросы Заказчика и устраняет замечания согласно пункта 4.2.<br />
        4.4. По истечении времени тестирования, в случае отсутствия замечаний Заказчика, Исполнитель ожидает оплаты за завершенный Спринт.<br />
        <br />
        &nbsp;&nbsp;5. Порядок оплаты и передачи исходного кода.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;5.1. После устранения замечаний Исполнителем Заказчик оплачивает или доплачивает до 90% стоимости Спринта.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;5.2. При получении оплаты Исполнитель передаёт код Заказчику и сопровождает внедрение Программы в рабочую среду Заказчика.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;5.2.1. Необходимость внедрения Программы в рабочую среду Заказчика, непосредственно Исполнителем, должна оговариваться на этапе обсуждения ТЗ.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;5.3. После внедрения и тестирования Программы в среде Заказчика, в случае отсутствия замечаний, Заказчик оплачивает остальные 10% от стоимости Спринта, не позднее 2-х рабочих дней от последнего устранения замечания Исполнителем.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;5.4. Исполнитель, в момент тестирования в среде Заказчика, отвечает на вопросы и устраняет замечания не позднее 2-х рабочих дней от последнего запроса Заказчика.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;5.5. После полной оплаты стороны переходят к следующему Спринту.<br />
        <br />
        &nbsp;&nbsp;6. Права и обязанности Сторон.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;6.1. Заказчик вправе:<br />
        - прекратить сотрудничество, по своему желанию, на любом из этапов разработки;<br />
        - в случае выхода за временные рамки Спринта, оговоренные в ТЗ, требовать от Исполнителя отчета о проделанной работе, по форме п. 3.6.;<br />
        - предлагать Исполнителю вносить изменения в текущее, утвержденное ТЗ.<br />
        6.2. Заказчик обязуется:<br />
        - не скрывать от Исполнителя, если он является посредником или представителем Заказчика и не сам принимает решения по Задаче;<br />
        - заранее уведомлять Исполнителя о невозможности соблюдения ограничения времени, указанного в Соглашении, по тестированию и приемке с указанием причины;<br />
        - в случае принятия решения прекратить сотрудничество с Исполнителем немедленно сообщить об этом непосредственно Исполнителю.<br />
        &nbsp;&nbsp;&nbsp;&nbsp;6.3. Исполнитель вправе: <br />
        - осуществлять работу над проектом в любое, удобное для себя, время суток;<br />
        - отказать предложению Заказчика о внесении изменений в ТЗ, если они затрагивают текущий Спринт;<br />
        - трактовать неполноту, неточности и неясности, утвержденного ТЗ по своему усмотрению, опираясь на свой опыт разработки программ.<br />
        6.4. Исполнитель обязуется:<br />
        - не изменять условия настоящего Соглашения до окончания решения Задачи Заказчика указанной при оформлении заявки; <br />
        - не изменять Условия Спринта до его завершения, за исключением случаев совместного с Заказчиком внесения правок в ТЗ;<br />
        - в процессе работы над проектом, быть на связи с Заказчиком, с понедельника по пятницу ежедневно.<br />
        <br />
        Редакция от 06.11.2020г.<br />
      </p>
    </div>
  );
}