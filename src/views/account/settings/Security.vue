<template>
  <div>
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
        <a-list-item-meta>
          <a slot="title">{{ item.title }}</a>
          <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
        </span>
        </a-list-item-meta>
        <template v-if="item.actions">
          <a slot="actions" @click="item.actions.callback">{{ item.actions.title }}</a>
        </template>
      </a-list-item>
    </a-list>
    <password-edit ref="passwordEdit" :visible="visible.passwordEdit" @success="visible.passwordEdit = false" @cancel="visible.passwordEdit = false"/>
  </div>
</template>

<script>
import PasswordEdit from './PasswordEdit'

export default {
  components: {
    PasswordEdit
  },
  data () {
    return {
      visible: {
        passwordEdit: false
      },
      data: [
        { title: '帐户密码', description: '当前密码强度', value: '中', actions: { title: '修改', callback: () => { this.visible.passwordEdit = true } } }
        // { title: '密保手机', description: '已绑定手机', value: '139****9999', actions: { title: '修改', callback: () => { this.$message.warning('暂未开放') } } }
      ]
    }
  }
}
</script>

<style scoped>

</style>
