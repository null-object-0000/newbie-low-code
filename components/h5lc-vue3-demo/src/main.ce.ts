import { defineCustomElement } from 'vue';
import IndexComponent from './Index.ce.vue'
import { name as packageName } from "../package.json";

const componentModule = defineCustomElement(IndexComponent)

customElements.define(packageName, componentModule)

export default IndexComponent