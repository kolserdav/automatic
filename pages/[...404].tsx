import classnames from 'classnames'
import { GetServerSidePropsContext } from 'next'

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
      <h1 className='gray'>Страница не найдена ¯\_(ツ)_/¯</h1>
    </div>
  );
}
