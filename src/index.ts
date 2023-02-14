import '@/style/index.scss'
import $app from '@/App'

const $root = document.querySelector('#root')

if ($root) {
  $root.appendChild($app)
  $root.innerHTML = `
  <div>
    <h2>heelo</h2>
  </div>
`
}
