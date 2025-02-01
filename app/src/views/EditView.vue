<template>
  <div class="edit-view">
    <div ref="leftLayoutSider" class="left-layout-sider">
      <a-tabs size="mini" default-active-key="layer">
        <a-tab-pane key="layer" title="图层">
          <LayerList />
        </a-tab-pane>
        <a-tab-pane key="component" title="组件" disabled>
          <div v-for="component in components" :key="component.registerName" draggable="true"
            @dragstart="dragStart(component)">
            <span>{{ component.liteDesc }}</span>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <RenderView ref="renderView"></RenderView>
    <div ref="rightLayoutSider" class="right-layout-sider">
      <!-- TODO: 需要一个分组能力，不管是属性、样式、事件应该都用的一套表单组件 -->
      <a-tabs size="mini" default-active-key="component">
        <a-tab-pane key="component" title="属性">
          <props-editor v-if="editorStore.selectedNode" />
          <a-empty v-else description="请在画布中选择组件"  style="margin-top: 50px;"/>
        </a-tab-pane>
        <a-tab-pane key="image" title="样式" disabled>
          {{ editorStore.selectedNode }}
        </a-tab-pane>
        <a-tab-pane key="icon" title="事件" disabled>
          {{ editorStore.selectedNode }}
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineCustomElement, h, onMounted, ref } from 'vue';
import type { LayerNode } from '@/types/layer';
import { useCloned, useScriptTag } from '@vueuse/core';
import { v4 as uuidv4 } from 'uuid';
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

import LayerList from '@/components/LayerView.vue';
import RenderView from '@/components/RenderView.vue';
import PropsEditor from '@/components/editor/PropsEditor.vue';

import { useEditorStore } from '@/stores/editor';

const editorStore = useEditorStore()

const defaultPageLayerData = [
  {
    title: '根节点',
    key: 'root',

    icon: () => h('iconpark-icon', { name: 'page' }),
    draggable: false,

    element: 'nblc-container',
    props: {},

    children: []
  }
] as LayerNode[]

interface Component {
  liteDesc: string
  registerName: string
  language: 'javascript' | 'vue' | 'react'
  remote: boolean,
  path?: string
}

const components = [
  {
    'liteDesc': '容器',
    'registerName': 'nblc-container',
    'language': 'javascript',
    'remote': false,
  },
  {
    'liteDesc': '图片',
    'registerName': 'nblc-image',
    'language': 'javascript',
    'remote': false,
  },
  {
    'liteDesc': '本地 Vue 3.0 示例',
    'registerName': 'nblc-vue3-demo-local',
    'language': 'vue',
    'remote': false,
    'path': 'Vue3Demo'
  },
  // {
  //   'liteDesc': '远程 Vue 2.0 示例',
  //   'registerName': 'nblc-vue2-demo',
  //   'language': 'vue',
  //   'remote': true,
  //   'path': 'http://localhost:3000/nblc-vue2-demo.js'
  // },
  // {
  //   'liteDesc': '远程 Vue 3.0 示例',
  //   'registerName': 'nblc-vue3-demo-remote',
  //   'language': 'vue',
  //   'remote': true,
  //   'path': 'http://localhost:4173/index.umd.cjs'
  // },
  // {
  //   'liteDesc': '远程 React 示例',
  //   'registerName': 'nblc-react-demo',
  //   'language': 'react',
  //   'remote': true,
  //   'path': 'http://localhost:55729/static/js/main.e19eb8b5.js'
  // }
] as Component[]

const utils = {
  buildNode: (registerName: string, props: Record<string, any>) => {
    const component = components.find(item => item.registerName === registerName)
    if (!component) {
      throw new Error('Component not found')
    }

    const key = uuidv4()

    return {
      title: component.liteDesc + '_' + key.replace('-', '').substring(0, 5),
      key,
      icon: () => h('iconpark-icon', { name: 'container' }),
      draggable: true,

      element: registerName,
      props,

      children: []
    } as LayerNode
  },

  loadCustomComponent: async (args: Component) => {
    // 先看看是不是 nblc- 开头的
    if (!args.registerName.startsWith('nblc-')) {
      console.warn('Component name must start with nblc-', args.registerName)
      return
    }

    const registerName = args.registerName

    // 然后看看是不是已经注册过了
    if (customElements.get(registerName)) {
      return
    }

    if (args.remote && args.path) {
      const { load, unload } = useScriptTag(args.path, () => {
        console.log('Remote component loaded:', args.path)
      })
      load()
    } else if (args.language === 'vue') {
      const vueComponent = await import(`@/components/nblc/${args.path || useChangeCase(args.registerName.slice(5), 'pascalCase').value}.ce.vue`)
      const componentModule = defineCustomElement(vueComponent.default)
      customElements.define(registerName, componentModule)
    } else {
      const componentModule = await import(`@/components/nblc/${args.path || useChangeCase(args.registerName.slice(5), 'pascalCase').value}.ts`)
      customElements.define(registerName, componentModule.default);
    }
  }
}

const dragStart = (component: Component) => (event: DragEvent) => {
  event.dataTransfer?.setData('component', JSON.stringify(component))
}

onMounted(async () => {
  // 创建一个 Promise 数组
  const loadPromises = components.map(component =>
    utils.loadCustomComponent(component)
  );

  // 使用 Promise.all 来并行执行所有异步加载操作
  await Promise.all(loadPromises);

  // 所有组件加载完成后的逻辑
  console.log('All components loaded');

  const mockPageLayerData = useCloned(defaultPageLayerData).cloned
  // mockPageLayerData.value[0].children.push(utils.buildNode('nblc-vue2-demo', { count: 2 }))
  // mockPageLayerData.value[0].children.push(utils.buildNode('nblc-vue3-demo-remote', { count: 999 }))
  mockPageLayerData.value[0].children.push(utils.buildNode('nblc-vue3-demo-local', { count: 2 }))
  // mockPageLayerData.value[0].children.push(utils.buildNode('nblc-react-demo', { count: 555 }))
  mockPageLayerData.value[0].children.push(utils.buildNode('nblc-image', { src: 'https://pic5.40017.cn/i/ori/1zu7UgN0Co8.png' }))
  mockPageLayerData.value[0].children.push(utils.buildNode('nblc-image', { src: 'https://pic5.40017.cn/i/ori/1wL6K0DgQUM.png' }))

  editorStore.routes = [
    {
      title: '页面 1',
      key: uuidv4(),
    }
  ]
  editorStore.updateLayerTree(mockPageLayerData.value)
})
</script>

<style scoped lang="less">
.edit-view {
  display: flex;
  flex-direction: row;

  .left-layout-sider,
  .right-layout-sider {
    min-width: 252px;
    max-width: 45%;
    height: calc(100vh - var(--layout-header-height));
    background: #fafafa;

    width: 252px;
  }

  .left-layout-sider{
    border-right: 1px solid #efefef;
  }

  .right-layout-sider {
    border-left: 1px solid #efefef;
  }
}
</style>

<style lang="less">
.edit-view {
  .arco-tabs-content {
    padding-top: 0
  }

  .arco-tabs-nav {
    height: 42px;

    .arco-tabs-tab-active,
    .arco-tabs-tab-active:hover {
      color: rgba(0, 0, 0, 0.93);
      font-weight: 600;
    }

    .arco-tabs-nav-ink {
      display: none;
    }
  }

  .arco-tabs-nav.arco-tabs-nav-type-line .arco-tabs-tab {
    margin: 0 12px;
  }
}
</style>