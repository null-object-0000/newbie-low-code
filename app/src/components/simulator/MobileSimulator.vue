<template>
  <div class="mobile-container">
    <div class="mobile">
      <template v-for="node in editorStore.layerTree" :key="node.key">
        <Node :node="node" />
      </template>
      <div class="node-selected-border"></div>
      <div class="node-hover-border"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Node from '@/components/RenderNode.vue';
import { useEditorStore } from '@/stores/editor';
const editorStore = useEditorStore()
</script>

<style scoped lang="less">
.mobile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - var(--layout-header-height) - var(--render-view-show-modes-height));
  background-image: radial-gradient(circle, #dcdcdc 1px, transparent 0);
  background-size: 16px 16px;

  .mobile {
    width: 375px;
    height: calc(100vh - var(--layout-header-height) - var(--render-view-show-modes-height) - 80px);
    max-height: 667px;
    border-radius: 10px 10px 0 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .1);
    background: rgb(245, 246, 247);

    overflow: auto;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;

      &-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 3px;
      }
    }
  }
}
</style>