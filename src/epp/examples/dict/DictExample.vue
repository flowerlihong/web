<!--
 Created by Xuz on 2019/04/07.
 xuz[at]live[dot]cn
 数据字典示例
-->
<template>
    <page-view title="数据字典组件示例">
        <a-card>
            <table class="fx-form">
                <tr>
                    <th>单选框</th>
                    <td>
                        <a-form-item>
                            <dict-radio dictKey="PEOPLE.SEX" @change="onRadioChange"/>
                        </a-form-item>
                    </td>
                    <th>单选框（默认值）</th>
                    <td>
                        <a-form-item>
                            <dict-radio dictKey="PEOPLE.SEX" value="F" @change="onRadioChange"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>多选框</th>
                    <td>
                        <a-form-item>
                            <dict-checkbox dictKey="PEOPLE.SEX" @change="onCheckboxChange"/>
                        </a-form-item>
                    </td>
                    <th>多选框（默认值）</th>
                    <td>
                        <a-form-item>
                            <dict-checkbox dictKey="PEOPLE.SEX" :value="['M', 'U']" @change="onCheckboxChange"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>下拉选项</th>
                    <td>
                        <a-form-item>
                            <dict-cascader dictKey="PEOPLE.SEX" @change="onCascaderChange"/>
                        </a-form-item>
                    </td>
                    <th>下拉选项（默认值）</th>
                    <td>
                        <a-form-item>
                            <dict-cascader dictKey="PEOPLE.SEX" value="F" @change="onCascaderChange"/>
                        </a-form-item>
                    </td>
                </tr>
                <tr>
                    <th>多级选择</th>
                    <td>
                        <a-form-item>
                            <dict-cascader dictKey="CLAIM.CATEGORY" @change="onCascaderChange"/>
                        </a-form-item>
                    </td>
                    <th>多级选择（默认值）</th>
                    <td>
                        <a-form-item>
                            <dict-cascader dictKey="CLAIM.CATEGORY" value="6,6-2" @change="onCascaderChange"/>
                        </a-form-item>
                    </td>
                </tr>
            </table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import DictRadio from '@/components/dict/DictRadio'
import DictCheckbox from '@/components/dict/DictCheckbox'
import DictCascader from '@/components/dict/DictCascader'

export default {
  name: 'DictExample',
  components: {
    DictCascader,
    PageView,
    DictRadio,
    DictCheckbox
  },
  methods: {
    onRadioChange: function (value) {
      this.$message.success('已选择：' + value)
    },
    onCheckboxChange: function (values) {
      this.$message.success('已选择：' + values.join(', '))
    },
    onCascaderChange: function (values) {
      this.$message.success('已选择：' + values.join(', '))
    }
  }
}
</script>

<style scoped>
    .fx-form th {
        width: 150px !important;
    }
</style>
