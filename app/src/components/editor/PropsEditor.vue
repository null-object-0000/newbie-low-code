<template>
    <a-form class="props-editor" :model="form" layout="vertical" size="mini" :disabled="form.key === 'root'">
        <a-form-item field="element" label="元素" required disabled>
            <a-input v-model="form.element"
                @input="(value, ev) => updateForm({ key: 'element' } as PropOptions, value, ev)" />
        </a-form-item>
        <a-form-item field="key" label="标识" required disabled>
            <a-input v-model="form.key" @input="(value, ev) => updateForm({ key: 'key' } as PropOptions, value, ev)" />
        </a-form-item>
        <a-form-item field="title" label="标题" required>
            <a-input v-model="form.title"
                @input="(value, ev) => updateForm({ key: 'title' } as PropOptions, value, ev)" />
        </a-form-item>
        <template v-for="prop in props">
            <a-form-item :field="prop.key" :label="prop.key" :required="prop.key === 'element'">
                <a-input v-if="prop.type === 'string'" v-model="prop.value"
                    @input="(value, ev) => updateForm(prop, value, ev)" />
                <a-input-number v-else-if="prop.type === 'number'" v-model="prop.value"
                    @input="(value, _inputValue, ev) => updateForm(prop, value, ev)" />
                <a-switch v-else-if="prop.type === 'boolean'" v-model="prop.value"
                    @change="(value, ev) => updateForm(prop, value, ev)" />
            </a-form-item>
        </template>
    </a-form>
</template>

<script setup lang="ts">
import { useEditorStore } from '@/stores/editor';
import { EmitSource, type LayerNode } from '@/types/layer';
import { useCloned } from '@vueuse/core';
import { onBeforeMount, ref, type Ref } from 'vue';

const editorStore = useEditorStore()

const form = ref({}) as Ref<LayerNode>
const props = ref([]) as Ref<PropOptions[]>

const updateForm = async (prop: PropOptions, value: any, event: Event) => {
    form.value.props[prop.key] = value
    editorStore.updateLayerNode(form.value.key, form.value)
}

onBeforeMount(() => {
    refreshForm(editorStore.selectedNode as LayerNode)
})

editorStore.onSelectedNode(async (payload: { source: EmitSource; isSameNode: Boolean; node: LayerNode }) => {
    refreshForm(payload.node)
})

const refreshForm = (node: LayerNode) => {
    const clonedNode = useCloned(node).cloned.value;
    form.value = clonedNode; // 确保 form 是响应式的
    props.value = Object.keys(clonedNode.props || {}).map(key => ({
        key,
        value: clonedNode.props[key],
        type: typeof clonedNode.props[key]
    }));
}

interface PropOptions {
    key: string
    value: any
    type: string
}
</script>

<style scoped lang="less">
.props-editor {
    padding: 12px;
    width: 90%;
}
</style>