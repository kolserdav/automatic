import s from '../styles/rules/Rules.module.scss'
import classnames from 'classnames'
import Link from 'next/link'
import Head from 'next/head'

export default function Success() {
  
  return (
    <div className={classnames(s.rules, 'column')}>
      <Head>
          <title>Успешная оплата</title>
      </Head>
      Спасибо, что воспользoвались платежной системой сайта!
      <Link href="/">На главную</Link>
    </div>
  );
}