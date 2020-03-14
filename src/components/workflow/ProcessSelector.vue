<!--
 Created by Xuz on 2019/01/21.
 xuz[at]live.cn
 启动流程选择组件
-->
<template>
    <div class="process-list">
        <span class="title"><a-icon type="deployment-unit"/>启动流程</span>
        <span>
            <a-select :value="selectedValue" placeholder="请选择流程" :options="options" @change="onChange"/>
        </span>
    </div>
</template>

<script>
export default {
  name: 'ProcessSelector',
  props: {
    value: {
      type: String
    }
  },
  created () {
    this.preGetProcessList()
  },
  data () {
    return {
      caseTypeId: null,
      selectedValue: null,
      options: []
    }
  },
  methods: {
    preGetProcessList () {
      this.caseTypeId = this.$route.query.caseTypeId
      if (!this.caseTypeId) {
        const that = this
        that.$http.get('/api/1/module/get_module_by_path.json?path=' + this.$route.path).then(function (resp) {
          if (resp.code !== 200) {
            return
          }
          that.caseTypeId = resp.result.caseTypeId
          that.getProcessList(that.caseTypeId)
        })
      } else {
        this.getProcessList(this.caseTypeId)
      }
    },
    getProcessList (caseTypeId) {
      const that = this
      that.$http.get('/api/1/workflow/processes.json?caseTypeId=' + caseTypeId).then(function (resp) {
        that.options = that.mapCompData(resp.result)
        if (that.options.length === 1) {
          that.onChange(that.options[0].value)
        }
      })
    },
    onChange (value) {
      this.selectedValue = value
      this.$emit('change', value, this.caseTypeId)
    },
    mapCompData (list) {
      return list.map(item => {
        return {
          value: item.id,
          label: item.name
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .process-list {
        padding-bottom: 24px;
        border-bottom: 1px dashed #dcdcdc;
    }

    .process-list span {
        display: inline-block;
        font-size: 16px;
    }

    .process-list .title {
        color: #1890ff;
        text-align: right;
        width: 90px;

    }

    .process-list span i {
        margin-right: 8px;
    }
    .process-list span:nth-child(2) {
        padding-left: 20px;
    }

    .process-list span div {
        margin: 0;
    }

    .process-list.layout1 .title{
        width: 29.16666667%;
        padding-right: 13px;
    }

    .process-list.layout1 span:nth-child(2) {
        padding-left: 0;
    }
</style>
