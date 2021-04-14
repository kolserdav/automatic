import { useEffect } from 'react';
import * as lib from './api/lib';
import s from '../styles/rules/Rules.module.scss'
import Head from 'next/head'
import classnames from 'classnames'
import axios from 'axios';
//import CloudIpsp from 'cloudipsp-node-js-sdk';

export default function Pay(props) {
  const { url } = props;
  const order_id = `order_id-${Math.random()}`;
  const signature = lib.getHash(32);
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
        signature,
        response_url: 'https://automatic.uyem.ru/success',
        email: 'serega12101983@gmail.com',
        lang: 'en'
      },
    }
    console.log(order_id, signature);
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
  const order_id = 'order_id-0.06122492768106935';
  const data = {
    request: {
      order_id,
      merchant_id: 1474758,
      signature: "250ceec5ea86bc606cee4354c0d7126d0a2ab045"
    }
  };
  axios.post('https://pay.fondy.eu/api/status/order_id', {
    headers: {
      'Content-Type': 'application/json'
    },
    data,
  })
    .then((d) => {
      console.log(1, d.data);
    })
    .catch((e) => {
      console.error(2, e);
    });
  return {
    props: {
      url: 'result',
    },
  };
}