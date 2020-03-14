<template>
  <div class="footer">
    <div class="links">
      Ant Design Vue {{version}}
    </div>
    <div class="copyright">
      <span>Xuz</span>
    </div>
  </div>
</template>

<script>
import { version } from 'ant-design-vue'

export default {
  name: 'LayoutFooter',
  data () {
    return {
      version
    }
  }
}
</script>

<style lang="less" scoped>
  .footer {
    padding: 0 16px;
    margin: 24px 0 24px;
    text-align: center;
    display: none;

    .links {
      margin-bottom: 8px;

      a {
        color: rgba(0, 0, 0, .45);

        &:hover {
          color: rgba(0, 0, 0, .65);
        }

        &:not(:last-child) {
          margin-right: 40px;
        }
      }
    }
    .copyright {
      color: #f0f2f5;
      font-size: 14px;
    }
  }
</style>
