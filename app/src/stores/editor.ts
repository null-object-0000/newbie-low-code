import { h, nextTick, readonly, ref } from "vue";
import { defineStore } from "pinia";
import type { EmitSource, LayerNode, PageRoute } from "@/types/layer";
import { useEventBus } from "@vueuse/core";
import { v4 as uuidv4 } from "uuid";

/**
 * 编辑器 -> 页面（路由） -> 图层（组件）
 */
export const useEditorStore = defineStore("editor", () => {
  const bus = useEventBus<string>("editor");

  const routes = ref<PageRoute[]>([]);
  const layerTree = ref<LayerNode[]>();
  const selectedNode = ref<LayerNode>();

  function emitSelectNode(source: EmitSource, node: String | LayerNode) {
    let doNode: LayerNode;
    if (typeof node === "string") {
      doNode = findNodeByKey(node) as LayerNode;
    } else {
      doNode = node as LayerNode;
    }

    if (!doNode) {
      return;
    }

    const isSameNode = selectedNode.value?.key === doNode.key;
    selectedNode.value = doNode;
    bus.emit("selected-node", {
      source,
      isSameNode,
      node: doNode,
    });
  }

  function onSelectedNode(
    listener: (payload: {
      source: EmitSource;
      isSameNode: Boolean;
      node: LayerNode;
    }) => void
  ) {
    return bus.on((event, payload) => {
      if (event === "selected-node") {
        listener(payload);
      }
    });
  }

  function findNodeByKey(key: string, nodes?: LayerNode[]) {
    if (!nodes) {
      nodes = layerTree.value;
    }

    if (!nodes) {
      return;
    }

    for (const node of nodes) {
      if (node.key === key) {
        return node;
      }
      if (node.children) {
        const found = findNodeByKey(key, node.children) as LayerNode;
        if (found) {
          return found;
        }
      }
    }
  }

  function updateLayerTree(tree: LayerNode[]) {
    const processTree = (nodes: LayerNode[]) => {
      for (const node of nodes) {
        // 判断 node.key 是不是空，是的话就生成一个 key
        if (!node.key) {
          node.key = uuidv4();
        }

        // 先判断是不是 root
        if (node.key === "root") {
          node.icon = () => h("iconpark-icon", { name: "page" });
          node.draggable = false;
        } else {
          node.icon = () => h("iconpark-icon", { name: "container" });
          node.draggable = true;
        }

        if (node.children) {
          node.children = processTree(node.children);
        }
      }

      return nodes;
    };

    layerTree.value = processTree(tree);
    bus.emit("layer-tree", { tree: layerTree.value });
    return layerTree.value;
  }

  function updateLayerNode(key: string, node: LayerNode) {
    const processTree = (nodes: LayerNode[] | undefined) => {
      if (!nodes) {
        return nodes;
      }

      for (const item of nodes) {
        if (item.key === key) {
          // 只有部分属性可以更新
          item.title = node.title;
          item.props = node.props;
          return nodes;
        }

        if (item.children) {
          item.children = processTree(item.children) || [];
        }
      }

      return nodes;
    };

    layerTree.value = processTree(layerTree.value);
    bus.emit("layer-tree", { tree: layerTree.value, key });
    return layerTree.value;
  }

  function onLayerTreeChanged(
    listener: (payload: { tree: LayerNode[], key?: string }) => void
  ) {
    return bus.on((event, payload) => {
      if (event === "layer-tree") {
        listener(payload);
      }
    });
  }

  return {
    /**
     * 当前编辑器的所有页面
     */
    routes,
    /**
     * 当前编辑器选中页面的所有图层
     */
    layerTree,
    /**
     * 当前编辑器选中的图层
     */
    selectedNode: readonly(selectedNode),
    emitSelectNode,
    onSelectedNode,

    updateLayerTree,
    updateLayerNode,
    onLayerTreeChanged,

    /**
     * 根据 key 在 layerTree 中查找图层
     */
    findNodeByKey,
  };
});
