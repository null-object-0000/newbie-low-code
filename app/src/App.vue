<template>
  <a-layout class="app-layout">
    <a-layout-header>
      <a-typography-title class="app-title" :heading="5">
        Newbie Low Code
      </a-typography-title>
    </a-layout-header>
    <a-layout>
      <a-layout-content class="app-layout-content">
        <RouterView />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<style scoped lang="less">
.arco-layout-header {
  padding: 0 16px 0 12px;
  width: 100%;
  height: var(--layout-header-height);
  background: #fafafa;
  box-shadow: inset 0 -1px 0 #efefef;

  .app-title {
    margin: 12px 0 0 0;
    user-select: none;
  }
}
</style>
