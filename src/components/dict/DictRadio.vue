<!--
 Created by Xuz on 2019/04/06.
 xuz[at]live[dot]cn
 数据字典单选框
-->
<template>
    <a-radio-group @change="onChange" v-model="currentValue">
        <a-radio v-for="item in options" :key="item.id" :value="item.value">{{item.name}}</a-radio>
    </a-radio-group>
</template>

<script>
export default {
  name: 'DictRadio',
  props: {
    dictKey: {
      type: String,
      required: true
    },
    value: {
      type: String
    }
  },
  created () {
    this.onFetch()
    this.currentValue = this.value
  },
  data () {
    return {
      currentValue: null,
      options: []
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    }
  },
  methods: {
    onChange (e) {
      this.$emit('change', this.currentValue)
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
