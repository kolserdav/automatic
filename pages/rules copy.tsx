import s from '../styles/rules/Rules.module.scss'
import classnames from 'classnames'

export default function Rules() {
  return (
    <div className={classnames(s.rules, 'column')}>правила сервиса</div>
  );
}