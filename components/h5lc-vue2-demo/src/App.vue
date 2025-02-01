<template>
  <div class="demo">
    <button @click="curr++">
      Vue 2.0 Remote Count is: {{ curr }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'IndexComponent',
  props: {
    count: Number
  },
  data() {
    return {
      curr: this.count
    }
  },
  watch: {
    count(val) {
      this.curr = val
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo {
  padding: 22px 24px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, .07), 0 1px 4px rgba(0, 0, 0, .07);
  transition: background-color .5s ease;
}

.demo button {
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
</style>
