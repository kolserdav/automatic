import { useEffect } from 'react'
import queryString from 'query-string'

export default function Unsubscribe() {

  useEffect(() => {
    const parsed = queryString.parse(window.location.search);
    console.log(parsed)
  }, [])

  return (
    <div>s</div>
  );
}