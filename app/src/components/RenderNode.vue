<template>
    <!-- @ts-ignore -->
    <component class="node" :is="node.element" :id="'render-' + node.key" v-bind="node.props" @click="onSelectedNode"
        :key="node.key + '-' + forceRenderKey" @mouseover="(ev: MouseEvent) => onHoverNode(node, ev)"
        @mouseleave="(ev: MouseEvent) => onLeaveNode(node, ev)">
        <template v-if="node.children && node.children.length" v-for="child in node.children" :key="child.key">
            <RenderNode :node="child" @hover-node="(node: LayerNode, ev: MouseEvent) => emit('hoverNode', node, ev)"
                @leave-node="(node: LayerNode, ev: MouseEvent) => emit('leaveNode', node, ev)" />
        </template>
    </component>
</template>

<script setup lang="ts">
import { EmitSource, type LayerNode } from '@/types/layer';
import RenderNode from '@/components/RenderNode.vue';
import { useEditorStore } from '@/stores/editor';
import { ref } from 'vue';

const editorStore = useEditorStore()

const { node } = defineProps<{
    node: LayerNode
}>()

const emit = defineEmits(['hoverNode', 'leaveNode'])

const onSelectedNode = (ev: MouseEvent) => {
    editorStore.emitSelectNode(EmitSource.EditorSimulator, node);
    ev.stopPropagation();
}

const onHoverNode = (node: LayerNode, ev: MouseEvent) => {
    emit('hoverNode', node, ev);
    ev.stopPropagation();
}

const onLeaveNode = (node: LayerNode, ev: MouseEvent) => {
    emit('leaveNode', node, ev);
    ev.stopPropagation();
}

const forceRenderKey = ref(0); // 用于强制重新渲染的 key

editorStore.onLayerTreeChanged(async (payload: { tree: LayerNode[]; key?: string }) => {
    if (payload.key && payload.key !== node.key) return;
    forceRenderKey.value++; // 增加 key 值，触发重新渲染
})
</script>

<style scoped lang="less">
.node {
    display: block;
    width: 100%;
    height: 100%;
    user-select: none;
}
</style>