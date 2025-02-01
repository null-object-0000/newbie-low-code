<template>
    <div class="demo">
        <button @click="count++">
            Vue 3.0 Remote Count is: {{ count }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
    inheritAttrs: false
})

const props = defineProps<{
    count: number
}>()

const count = ref(props.count)

</script>

<style scoped lang="less">
.demo {
    padding: 22px 24px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);
    transition: background-color .5s ease;

    button {
        background-color: #f1f1f1;
        transition: background-color .5s;
        padding: 5px 12px;
        border: 1px solid rgba(60, 60, 60, .29);
        border-radius: 8px;
        font-size: .9em;
        font-weight: 600;
        cursor: pointer;

        height: 36px;
    }
}
</style>