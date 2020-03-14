<!--
 Created by Xuz on 2019/04/06.
 xuz[at]live[dot]cn
 数据字典复选框
-->
<template>
    <a-checkbox-group @change="onChange" v-model="currentValues">
        <a-checkbox v-for="item in options" :key="item.id" :value="item.value">{{item.name}}</a-checkbox>
    </a-checkbox-group>
</template>

<script>
export default {
  name: 'DictCheckbox',
  props: {
    dictKey: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  created () {
    this.onFetch()
    this.currentValues = this.value
  },
  data () {
    return {
      currentValues: [],
      options: []
    }
  },
  watch: {
    value (val) {
      this.currentValues = val
    }
  },
  methods: {
    onChange (e) {
      this.$emit('change', this.currentValues)
    },
    onFetch () {
      const that = this
      that.$http.get('/api/1/dict/cache/items.json?key=' + this.dictKey).then(function (response) {
        that.options = response.result
      })
    }
  }
}
</script>

<style scoped>

</style>
