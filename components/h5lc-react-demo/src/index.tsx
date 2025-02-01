import r2wc from "@r2wc/react-to-web-component"
import App from "./App"

const IndexComponent = r2wc(App, {
  props: { count: "number" },
  shadow: 'open'
})

customElements.define("h5lc-react-demo", IndexComponent)
