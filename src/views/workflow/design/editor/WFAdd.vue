<!--
 Created by Xuz on 2019/07/16.
 xuz[at]live[dot]cn
 流程编辑器 - 新建流程
-->
<template>
    <a-modal title="新建流程"
             :width="1280"
             :visible="visible"
             :maskClosable="false"
             @ok="onSubmit"
             @cancel="$emit('cancel')"
             :confirmLoading="modalLoading"
             class="wf-editor"
             destroyOnClose>
        <a-alert message="试验功能中，请勿用做正式使用……" banner/>
        <div style="width:100%;height:600px">
        <svg id="WFDesigner" zoomAndPan="magnify" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" version="1.1">
            <defs>
                <marker preserveAspectRatio="xMidYMid meet" orient="auto" markerHeight="15" markerWidth="4"
                        markerUnits="strokeWidth" refY="5" refX="0" viewBox="0 0 10 10" id="arrow">
                    <path stroke="black" fill="black" d="M 0 0 L 10 5 L 0 10 z"/>
                </marker>
            </defs>

            <rect style="stroke:none;fill:rgb(255,255,255)" height="100%" width="100%" y="0" x="0" id="WFBACKGROUND"/>

            <g id="ToolBarContainer"/>
        </svg>
        </div>
    </a-modal>
</template>

<script>
import Workflow from './js/WorkFlow'

export default {
  name: 'WFAdd',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modalLoading: false,
      wf: null,
      formData: {
        svg: null,
        activity: null,
        comment: null
      }
    }
  },
  mounted: function () {
  },
  methods: {
    preWFAdd () {
      this.$nextTick(function () {
        this.initWorkFlow()
      })
    },
    onSubmit () {
    },
    initWorkFlow () {
      this.wf = new Workflow('WFDesigner')
    }
  }
}
</script>

<style lang="less">
    .wf-editor .ant-modal-body {
        padding: 0 !important;
    }
</style>
