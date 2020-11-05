import { useEffect, useState } from 'react'
import queryString from 'query-string'
import classnames from 'classnames'
import Head from 'next/head'
import {
  Button
} from '@material-ui/core'

export default function Unsubscribe() {

  const [ message, setMessage ] = useState('');
  const [ _unsub, _setUnsub ] = useState(false);

  const unsub = () => {
    _setUnsub(true)
    const parsed = queryString.parse(window.location.search);
    fetch('api/unsub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: parsed.e,
        key: parsed.k
      })
    })
      .then(r => r.json())
      .then(data => {
        setMessage(data.message);
      })
  };

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    setMessage(`Добавить почту ${parsed.e} в стоп лист? После добавления, указанную почту больше не смогут указывать на нашем сайте, как контакт.`);
  }, [])

  return (
    <div className={classnames('column', 'center', 'text')}>
      <Head>
          <title>Отписаться</title>
          <meta name="robots" content="noindex,nofollow"></meta>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <p>{message}</p>
      {!_unsub? <Button color="primary" onClick={unsub}>Отписаться</Button> : ''}
    </div> 
  );
}