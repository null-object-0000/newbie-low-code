<template>
    <div horizontal class="layer-view-container">
        <div class="page-list">
            <div class="page-list-top-bar">
                <div class="page-name">
                    <div class="page-name-title">页面 </div>
                </div>
            </div>

            <a-tree size="small" class="page-list-tree" v-if="editorStore.routes && editorStore.routes.length"
                blockNode :data="editorStore.routes" default-expand-all />
        </div>
        <div class="layer-list">
            <a-input class="layer-search-input" size="mini" placeholder="搜索图层..." allow-clear>
                <template #prepend><icon-search /></template>
            </a-input>

            <a-tree size="small" class="layer-list-tree" v-if="editorStore.layerTree && editorStore.layerTree.length"
                draggable blockNode :data="editorStore.layerTree" checked-strategy="child"
                v-model:selected-keys="selectedNodeKes" :default-expanded-keys="['root']" @select="onSelectedNode"
                @drop="onDropNode">
            </a-tree>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IconSearch } from '@arco-design/web-vue/es/icon';
import { useEditorStore } from '@/stores/editor';
import type { TreeNodeData } from '@arco-design/web-vue';
import { nextTick, ref } from 'vue';
import { EmitSource, type LayerNode } from '@/types/layer';
import { useCloned } from '@vueuse/core';

const editorStore = useEditorStore()

const selectedNodeKes = ref<string[]>([])

/**
 * 通过图层树选择节点
 */
const onSelectedNode = (selectedKeys: Array<string | number>, data: { selected?: boolean; selectedNodes: TreeNodeData[]; node?: TreeNodeData; e?: Event; }) => {
    if (!data.node || !data.node.key) return

    editorStore.emitSelectNode(EmitSource.EditorLayerTree, data.node.key.toString())
}

const onDropNode = (info: { e: DragEvent; dragNode: TreeNodeData; dropNode: TreeNodeData; dropPosition: number; }) => {
    const layerTree = useCloned(editorStore.layerTree).cloned.value
    if (!layerTree) return
    if (!info.dragNode.key || !info.dropNode.key) return

    const dragNodeInfo = editorStore.findNodeByKey(info.dragNode.key.toString())
    const dropNodeInfo = editorStore.findNodeByKey(info.dropNode.key.toString())

    if (!dragNodeInfo || !dropNodeInfo) return

    const loop = (data: LayerNode[], key: String | Number, callback?: any) => {
        data.some((item, index, arr) => {
            if (item.key === key) {
                callback(item, index, arr);
                return true;
            }
            if (item.children) {
                return loop(item.children, key, callback);
            }
            return false;
        });
    };

    loop(layerTree, dragNodeInfo.key, (_: LayerNode, index: number, arr: LayerNode[]) => {
        arr.splice(index, 1);
    });

    if (info.dropPosition === 0) {
        loop(layerTree, dropNodeInfo.key, (item: LayerNode) => {
            item.children = item.children || [];
            item.children.push(dragNodeInfo);
        });
    } else {
        loop(layerTree, dropNodeInfo.key, (_: LayerNode, index: number, arr: LayerNode[]) => {
            arr.splice(info.dropPosition < 0 ? index : index + 1, 0, dragNodeInfo);
        });
    }

    editorStore.updateLayerTree(layerTree);
    // 重新触发下选中事件
    editorStore.emitSelectNode(EmitSource.EditorLayerTree, dragNodeInfo.key);
}

/**
 * 监听编辑器选中节点的变化，同步更新到图层树中
 */
editorStore.onSelectedNode(async (payload: { source: EmitSource; isSameNode: Boolean; node: LayerNode }) => {
    selectedNodeKes.value = [payload.node.key]
    if (payload.source === EmitSource.EditorLayerTree) {
        return;
    }

    await nextTick();

    // 找到 .layer-list-tree 下 data-key 为 payload.node.key 的节点，滚动到可视区域
    document.querySelector('.layer-list-tree [data-key="' + payload.node.key + '"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
</script>

<style lang="less" scoped>
.layer-view-container {
    height: calc(100vh - var(--layout-header-height) - 42px);
    display: flex;
    // 竖向布局
    flex-direction: column;
}

.page-list,
.layer-list {
    background: #fafafa;
    padding: 6px;
}

.page-list {
    padding-top: 0;
    flex: 0 0 117px;
}

.layer-list {
    flex: 1 1 auto;
    overflow: auto;
}

.layer-list-tree {
    overflow-y: auto;
    height: calc(100% - 36px);

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

.page-list .page-list-top-bar {
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px 0 6px;
    font-size: 12px;

    .page-name {
        display: flex;
        flex-grow: 1;
        align-items: center;
        width: 0;

        .page-name-title {
            user-select: none;
            white-space: nowrap;
            text-overflow: ellipsis;

            overflow: hidden;
        }
    }
}


.layer-list .layer-search-input {
    height: 30px;
    margin-bottom: 6px;
}
</style>

<style lang="less">
.layer-list .layer-search-input .arco-input-prepend,
.layer-list .layer-search-input .arco-input-wrapper {
    background-color: #ebebeb;
}

.edit-view .arco-tree-node {
    height: 30px;

    .arco-tree-node-title {
        user-select: none;
        white-space: nowrap;
        text-overflow: ellipsis;

        .arco-tree-node-title-text {
            font-size: 12px;
        }
    }
}

.edit-view {
    .arco-tree-node:hover {
        background: rgba(0, 0, 0, 0.08);

        .arco-tree-node-title:hover {
            background: transparent;
        }
    }

    .arco-tree-node.arco-tree-node-selected {
        background: rgba(54, 98, 236, 0.3);
    }

    .arco-tree-node-selected .arco-tree-node-title:hover {
        background: transparent;
    }

    .arco-tree-node-title:hover .arco-tree-node-drag-icon {
        display: none;
    }

    .arco-tree-node-selected .arco-tree-node-title,
    .arco-tree-node-selected .arco-tree-node-title:hover {
        color: var(--color-text-1);
    }
}
</style>