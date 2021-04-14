import s from '../styles/rules/Rules.module.scss'
import classnames from 'classnames'
import Link from 'next/link'
import Head from 'next/head'

export default function Error() {
  
  return (
    <div className={classnames(s.rules, 'column')}>
      <Head>
          <title>Успешная оплата</title>
      </Head>
      К сожалению, мы не смогли принять ваш платеж.
      <Link href="/">На главную</Link>
    </div>
  );
}