import { useEffect } from 'react';
import * as lib from './api/lib';
import s from '../styles/rules/Rules.module.scss'
import Head from 'next/head'
import classnames from 'classnames'
import axios from 'axios';
import CloudIpsp from 'cloudipsp-node-js-sdk';
import { on } from 'process';

export default function Pay(props) {
  const { payUrl } = props;
  const order_id = `order_id-${Math.random()}`;
  const signature = lib.getHash(32);
  useEffect(() => {
    document.cookie = "lang=ru";
    var Options = {
      options: {
        methods: ['card'],
        cardIcons: ['mastercard', 'visa'],
        fields: false,
        title: 'Тест',
        link: payUrl,
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
        lang: 'ru'
      },
    }
    console.log(order_id, signature);
    // @ts-ignore
    fondy("#app", Options)
      .$on('success', (da) => {
        console.log(22, da.data.order.order_data.order_status)
      })
      .$on('end', (da) => {
        console.log(232, da)
      })
      .$on('error', (er) => {
        console.error(23, er)
      });
  }, []);
  return (
    <div className={classnames(s.rules, 'column')} >
      <Head>
          <title>Оплата</title>
          <meta name="robots" content="noindex,nofollow"></meta>
          <link rel="icon" href="/favicon.ico" />
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
  const order_id = 'order_id-0.3013041752126092';
  const fondy = new CloudIpsp(
    {
      merchantId: 1474758,
      secretKey: '18N8ebRmZAayOYsa5MMh3AXNYz9cUBWE'
    }
  )
  const data = {
    order_id: 'Your Order Id',
    order_desc: 'test order',
    currency: 'USD',
    amount: '1000'
  }
  const payUrl = await new Promise((resolve) => {
    fondy.Checkout(data).then(data => {
      resolve(data.checkout_url)
    }).catch((error) => {
      resolve(error)
    })
  });
  return {
    payUrl,
  };
}