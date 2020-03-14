<template>
    <a-cascader style="width:300px" :fieldNames="{ label: 'name', value: 'value', children: 'children' }"
                :value="selectedValue" :options="options" @change="onChange" :loadData="loadData" :placeholder="placeholder"/>
</template>

<script>
export default {
  name: 'DictCascader',
  props: {
    dictKey: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {
      type: String
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  created () {
    if (this.value) {
      this.selectedValue = this.value.split(',')
    }
    this.onFetch()
  },
  data () {
    return {
      options: [],
      selectedValue: []
    }
  },
  watch: {
    value (val) {
      if (!val) {
        this.selectedValue = []
        return
      }
      this.selectedValue = val.split(',')
    }
  },
  methods: {
    loadData (selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      const that = this
      that.$http.get('/api/1/dict/cache/items.json?key=' + this.dictKey + '&id=' + targetOption.id).then(function (response) {
        targetOption.loading = false
        targetOption.children = [...response.result]

        that.options = [...that.options]
      })
    },
    onChange (value, selectedOptions) {
      this.selectedValue = value
      this.$emit('change', value.join(','))
    },
    onFetch () {
      const that = this
      that.$http.get('/api/1/dict/cache/items.json?key=' + this.dictKey).then(function (response) {
        that.options = [...response.result]
      })
    }
  }
}
</script>

<style scoped>

</style>
