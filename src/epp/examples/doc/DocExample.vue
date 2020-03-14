<!--
 Created by Xuz on 2019/04/07.
 xuz[at]live[dot]cn
 数据字典示例
-->
<template>
    <page-view title="WORD控件示例">
        <a-card>
            <table class="fx-form">
                <tr>
                    <td>
                        <a-form-item>
                            <ntko-office-button/>
                            <ntko-pdf-button/>
                        </a-form-item>
                    </td>
                </tr>
            </table>
        </a-card>
    </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import WebOfficeButton from '@/components/DocEditor/iWebOffice/iWebOfficeButton'
import NtkoOfficeButton from '@/components/DocEditor/ntko/NtkoOfficeButton'
import NtkoPdfButton from '@/components/DocEditor/ntko/NtkoPdfButton'

export default {
  name: 'DocExample',
  components: {
    PageView,
    WebOfficeButton,
    NtkoOfficeButton,
    NtkoPdfButton
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
