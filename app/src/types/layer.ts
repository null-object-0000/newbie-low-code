import type { h } from "vue";

export enum EmitSource {
  /**
   * 编辑器 - 图层树
   */
  EditorLayerTree = "editor-layer-tree",
  /**
   * 编辑器 - 模拟器
   */
  EditorSimulator = "editor-simulator",
}

export interface PageRoute {
  title: string;
  key: string;
}

export interface LayerNode {
  title: string;
  key: string;

  icon: () => ReturnType<typeof h>;
  draggable: boolean;

  element: string;
  props: Record<string, any>;

  children: LayerNode[];
}
