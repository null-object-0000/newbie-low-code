<template>
  <div class="render-view">
    <div class="show-modes">
      <span class="mode" :class="{ active: showMode === 'json' }" @click="changeMode('json')">JSON</span>
      <span class="mode" :class="{ active: showMode === 'mobile' }" @click="changeMode('mobile')">Mobile</span>
      <span class="mode" :class="{ active: showMode === 'pc' }" @click="changeMode('pc')">PC</span>

      <div v-if="showMode === 'json'" style="font-weight: 400; color: #666;">
        <span>Ctrl + S 保存</span>
      </div>
      <div v-else-if="showMode === 'mobile'" style="font-weight: 400; color: #666;">
        <span>375px x 667px</span>
      </div>
      <div v-else-if="showMode === 'pc'" style="font-weight: 400; color: #666;">
        <span>100% x 100vh</span>
      </div>
    </div>

    <template v-for="mode in showModes">
      <component :is="mode.component" v-if="showMode === mode.key" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, nextTick, onMounted, ref } from 'vue';

import { useEditorStore } from '@/stores/editor';
import { EmitSource, type LayerNode } from '@/types/layer';

const showModes = [
  {
    key: 'json',
    label: 'JSON',
    component: defineAsyncComponent(() => import('@/components/simulator/JsonSimulator.vue'))
  },
  {
    key: 'mobile',
    label: 'Mobile',
    component: defineAsyncComponent(() => import('@/components/simulator/MobileSimulator.vue'))
  },
  {
    key: 'pc',
    label: 'PC',
    component: defineAsyncComponent(() => import('@/components/simulator/PcSimulator.vue'))
  },
]

const showMode = ref<'json' | 'mobile' | 'pc'>('mobile')

const editorStore = useEditorStore()

onMounted(() => {
  changeMode('mobile');
})

const changeMode = async (mode: 'json' | 'mobile' | 'pc') => {
  showMode.value = mode;
}

/**
 * 如果不是因为编辑器 - 模拟器自身的操作导致的节点选中，那么滚动到对应的节点
 */
editorStore.onSelectedNode(async (payload: { source: EmitSource; isSameNode: Boolean; node: LayerNode }) => {
  if (payload.source === EmitSource.EditorSimulator) {
    return;
  }

  await nextTick();
  document.getElementById('render-' + payload.node.key)?.scrollIntoView({ behavior: 'smooth' });
})
</script>

<style scoped lang="less">
.render-view {
  flex: 1;
  height: calc(100vh - var(--layout-header-height));
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA11JREFUWEftll9IWmEYxl83z0pTl4Kl0QhbEGRgw4GB3oQgJCyKWF3YIGgUo4sxhCJozIidEq2GBGPsYsYggmBQXQRFu2p6MRzObXIEw7AxUsHNkytNp9sXKUeLlaJrF303/uHT5/l+3/s+56XBBS/aBetDtgHq5+S/MEcVvBqPx18DwE2SJLUmk8mi0+kSxTaRMoBemYlEwqfVasuGhoai5eXlxpWVlcmurq6fAFA0GikDVwCAHY/HP8lkshvRaBTGx8ehra3N4ff77wuFwg8A8KsYNKgGOJFI5G1HR8ctm812pNXe3g5jY2NRHo9nWFpa0heDBtUAKxwOvxkcHFSurq6mD1tRUZGmEQwG+/h8PqJRsNpI1wCfzy9zuVzPJyYmeubm5k7QRjT0en2UyWQaCIKYlEgk+4WojbSBqqoqht1ux81m80Oj0XjqdQuFQjAYDKBUKh2FokHtglKv1/tofX396cjIyF/rrbu7G11LhMFgGC0Wi76lpSXvTqHmQKnT6ezZ2tp62dfXd2bBIxomkwkUCoUjEAhoBALBl3yuhGqgxGq1qjAMW1ar1WcaQBvodDrgOA4ajeY9hmEKADg81w8pm9IGGhoaruE4flssFr+Ty+Un/geJ1dXVgUQigaamJhCLxeg9ygbv7u7uC5FIZAKASK4UqATovb291bOzs57a2toMA/39/TA6OgqJROIrSZJOv9/vIgji88zMjN1qtQZZLFZIIBCQbrcbEcgpNTOeBQDARSI1NTUlKA3RkslkMD8//wPH8Xt/WtQNALFj1DE2mx3DMCzG4XAOt7e3kXjO+ZBt4HosFvvY3NxcvbOzAzweD9bW1oAgiAcqlWoZAPYrKytjPp8vfiyGBFOiOZ08hZhqAD0PMuLYbDZDY2Pjq/r6+sdcLve7XC6PLi4uIsG8xE4r0GwDR3E8MDCgFIlEMDw87FAqlXc9Hs+3QCCAki9nxGd1BdUALRXHGxsbPa2trXvT09N3pqamHKFQaA8AEPaCrwwDKI4XFhbUUqn0yebm5rPOzs7lcDgcyqe/z+s0YySTSqWYzWZjMxgM5sHBAapqEgBQOxTszrONZRhIJpM0Go1GRyGHBhCdThcv9lh22lSc+q5op6ZS+O/G8vPWTsH2XRK4JHBJ4DcmA08wF4tx2gAAAABJRU5ErkJggg==) 4 4, auto;
  background: #efefef;

  .show-modes {
    display: flex;
    align-items: center;
    padding: 0 12px;
    height: var(--render-view-show-modes-height);
    background: #fafafa;
    box-shadow: inset 0 -1px 0 #efefef;
    font-size: 12px;

    span {
      padding-right: 12px;
    }

    span.active {
      color: rgba(0, 0, 0, 0.93);
      font-weight: 600;
    }

    span.mode {
      cursor: pointer;
    }
  }
}
</style>

<style lang="less">
.render-view {
  .arco-tabs-pane {
    padding: 12px;
  }
}
</style>