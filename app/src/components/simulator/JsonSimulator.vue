<template>
    <div class="json-editor-container" ref="jsonEditorContainer"></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import * as monaco from 'monaco-editor';

import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { useEditorStore } from '@/stores/editor';
import { Message } from '@arco-design/web-vue';
import { useCloned } from '@vueuse/core';

window.MonacoEnvironment = {
    getWorker: function (workerId: string, label: string) {
        console.log('MonacoEnvironment.getWorker', label)
        if (label === 'json') {
            return new jsonWorker()
        }
        return new editorWorker()
    },
}

const editorStore = useEditorStore()

const jsonEditorContainer = ref<HTMLElement>();
let jsonEditor: monaco.editor.IStandaloneCodeEditor;

const formatJSON = () => {
    return JSON.stringify(useCloned(editorStore.layerTree).cloned.value, null, 4)
}

onMounted(() => {
    if (jsonEditorContainer.value) {
        jsonEditor = monaco.editor.create(jsonEditorContainer.value, {
            value: formatJSON(),
            language: 'json',
            automaticLayout: false,
        });

        jsonEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function () {
            const json = jsonEditor.getValue();
            // 检查是否是合法的 JSON
            try {
                const obj = JSON.parse(json);

                editorStore.updateLayerTree(obj);
                jsonEditor.setValue(formatJSON());

                Message.info('保存成功');
            } catch (e) {
                console.error(e);
                Message.error('保存失败，JSON 格式错误');
                return;
            }
        });

    }
})

editorStore.onLayerTreeChanged(() => {
    jsonEditor?.setValue(formatJSON());
})

onBeforeUnmount(() => {
    jsonEditor?.dispose();
})
</script>

<style scoped lang="less">
.json-editor-container {
    width: calc(100% - 1px);
    height: calc(100% - var(--layout-header-height));
}
</style>