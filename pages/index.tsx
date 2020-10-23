import Head from 'next/head'
import styles from '../styles/Home.module.css'

const sendMail = () => {
  fetch('api/mailer')
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.error(e))
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dev</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*<button onClick={sendMail}>Send</button>*/}
    </div>
  )
}
