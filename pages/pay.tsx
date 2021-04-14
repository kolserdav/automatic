import { useEffect } from 'react';
import s from '../styles/rules/Rules.module.scss'
import Head from 'next/head'
import classnames from 'classnames'
//import CloudIpsp from 'cloudipsp-node-js-sdk';

export default function Pay(props) {
  const { url } = props;
  const order_id = `order_id-${Math.random()}`;
  useEffect(() => {
    var Options = {
      options: {
        methods: ['card'],
        cardIcons: ['mastercard', 'visa'],
        fields: false,
        title: 'Тест',
        link: 'https://automatic.uyem.ru/pay',
        fullScreen: true,
        button: true,
        locales: ['ru', 'en', 'uk'],
        email: true,
        tooltip: true,
        fee: true,
      },
      params: {
        merchant_id: 1474758,
        required_rectoken: 'y',
        currency: 'RUB',
        amount: 100,
        order_desc: 'Тестовый платеж',
        order_id,
        response_url: 'https://automatic.uyem.ru/success',
        email: 'serega12101983@gmail.com',
        lang: 'en'
      },
    }
    console.log(order_id);
    // @ts-ignore
    fondy("#app", Options);
  }, []);
  return (
    <div className={classnames(s.rules, 'column')} >
      <Head>
          <title>Оплата</title>
          <meta name="robots" content="noindex,nofollow"></meta>
          <link rel="icon" href="/favicon.ico" />
          <script src="https://pay.fondy.eu/static_common/v1/checkout/ipsp.js"></script>
          <script src="https://pay.fondy.eu/latest/checkout.js"></script>
          <script src="https://pay.fondy.eu/latest/i18n/ru.js"></script>
          <script src="https://pay.fondy.eu/latest/i18n/uk.js"></script>
          <link rel="stylesheet" href="https://pay.fondy.eu/latest/checkout.css"></link>
      </Head>
      <div className="pay" id="app"/>
    </div>
  );
}

Pay.getInitialProps = async () => {
  /*const fondy = new CloudIpsp(
    {
      merchantId: 1396424,
      secretKey: 'test'
    }
  )
  const requestData = {
    order_id: `order_id-${Math.random()}`,
    order_desc: 'test order',
    currency: 'USD',
    amount: '1000'
  }
  const result = await new Promise((resolve) => {
    fondy.Checkout(requestData).then(data => {
      resolve(data.checkout_url);
    }).catch((error) => {
      resolve(error)
    })
  });*/
  return {
    props: {
      url: 'result',
    },
  };
}