import classnames from 'classnames'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'

export function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.statusCode = 404;
  return {
    props: {
      someProp: 'some_value'
    }
  };
}

export default function Page404() {
  return (
    <div className={classnames('vcenter', 'center', 'column')}>
      <Head>
          <title>404</title>
          <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='gray'>Страница не найдена ¯\_(ツ)_/¯</h1>
    </div>
  );
}
