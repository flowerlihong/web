<template>
    <page-view title="添加公告">
        <a-card>
          <a-form :form="queryTripForm">
              <a-form-item>
                  <process-selector @change="onChangeProcess" />
              </a-form-item>
              <table class="fx-form">
                    <tr>
                        <th class="not-null">标题</th>
                        <td>
                          <a-form-item>
                             <a-input v-decorator="['title',{rules: [{ required: true, message: '请输入标题'}]}]"></a-input>
                          </a-form-item>
                        </td>
                        <th class="not-null">类型</th>
                        <td>
                            <a-form-item>
                                <dict-cascader dictKey="ANNOUNCE.ANN_TYPES"
                                    v-decorator="['annTypes', {rules: [{ required: true, message: '请选择类型'}]}]" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">有效日期</th>
                        <td>
                            <a-form-item>
                                    <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['effectDate',{rules: [{ required: true, message: '请输入日期' }]}]" />
                              </a-form-item>
                        </td>
                        <th class="not-null">紧急程度</th>
                        <td>
                            <a-form-item>
                                     <dict-cascader dictKey="ANNOUNCE.URGENCY"  v-decorator="['urgency', {rules: [{ required: true, message: '请选择紧急程度'}]}]" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                      <th class="not-null">发布范围</th>
                      <td>
                        <a-form-item>
                           <a-checkbox-group :options="plainOptions" @change="onDate" />
                           <div v-if="this.org===true" class="select">
                               <div>机构：</div>
                               <org-selector @change="onOrgChange" v-model="announce.orgId" multiple/>
                           </div>
                           <div v-if="this.dept===true" class="select">
                               <div>部门：</div>
                              <dept-selector @change="onDeptChange" v-model="announce.deptId" multiple/>
                           </div>
                           <div v-if="this.gang===true" class="select">
                               <div>岗位：</div>
                               <user-selector @change="onGangChange" v-model="announce.gangId" multiple/>
                           </div>
                           <div v-if="this.user===true" class="select">
                               <div> 人员：</div>
                               <user-selector @change="onUserChange" v-model="announce.userId" multiple/>
                           </div>
                        </a-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th>审核人</th>
                      <td>
                        <a-form-item>
                             <user-selector v-model="book.userId"
                                    @change="onChangeUser"/>
                        </a-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th class="not-null">内容</th>
                      <td colspan="3">
                          <a-form-item>
                            <TinyMCE ref="editor" height="420px" :value="content"/>
                          </a-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th>公告文件</th>
                      <td>
                        <a-form-item>
                            <upload-selector :referId='uuid' configKey='NOTICE.FILE'/>
                        </a-form-item>
                      </td>
                    </tr>
                     <tr>
                      <th>备注</th>
                      <td>
                          <a-form-item>
                             <a-input v-decorator="['memo']"></a-input>
                          </a-form-item>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="4" align="center">
                         <a-button type="primary" :loading="loading" @click="onSearch">保存</a-button>
                      </td>
                    </tr>
              </table>
          </a-form>
        </a-card>
    </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import moment from 'moment'
import qs from 'qs'
import UploadSelector from '@/components/selector/UploadSelector'
import OrgSelector from '@/components/selector/OrgSelector'
import DeptSelector from '@/components/selector/DeptSelector'
import UserSelector from '@/components/selector/UserSelector'
import TinyMCE from '@/components/Editor/TinyMCE'
import DictCascader from '../../components/dict/DictCascader'
import ProcessSelector from '@/components/workflow/ProcessSelector'
const plainOptions = ['指定机构', '指定部门', '指定岗位', '指定个人']
const uuidv4 = require('uuid/v4')
export default {
  name: 'BookIndex',
  components: {
    PageView,
    OrgSelector,
    DeptSelector,
    UserSelector,
    DictCascader,
    TinyMCE,
    ProcessSelector,
    UploadSelector
  },
  data () {
    return {
      uuid: uuidv4(),
      content: '',
      loading: false,
      modalVisible: {
        bookView: false
      },
      queryTripForm: this.$form.createForm(this),
      process: '通知公告发布流程',
      organsize: '',
      check1: false,
      plainOptions,
      book: {
        userId: ''
      },
      announce: {
        orgId: '',
        deptId: '',
        gangId: '',
        userId: ''
      },
      orgId1: '',
      deptId1: '',
      gangId1: '',
      userId1: '',
      org: false,
      dept: false,
      user: false,
      gang: false,
      submitParam: {
      },
      check2: [],
      procId: '',
      queryId: this.$route.query.caseTypeId
    }
  },
  created () {
    const user = this.$ls.get('user')
    this.announce.orgId = user.orgId
    this.announce.deptId = user.deptId
    this.announce.gangId = user.posId
    this.announce.userId = user.id
  },
  methods: {
    onChangeProcess (id) {
      this.procId = id
    },
    onChangeUser (selectedIds) {
      this.book.userId = selectedIds
    },
    onDate (checkedValues) {
      var check = checkedValues.join(',')
      if (check.indexOf('指定机构') !== -1) {
        this.org = true
      } else if (check.indexOf('指定机构') === -1) {
        this.orgId1 = ''
        this.org = false
      }
      if (check.indexOf('指定部门') !== -1) {
        this.dept = true
      } else if (check.indexOf('指定部门') === -1) {
        this.deptId1 = ''
        this.dept = false
      }
      if (check.indexOf('指定岗位') !== -1) {
        this.gang = true
      } else if (check.indexOf('指定岗位') === -1) {
        this.gangId1 = ''
        this.gang = false
      }
      if (check.indexOf('指定个人') !== -1) {
        this.user = true
      } else if (check.indexOf('指定个人') === -1) {
        this.userId1 = ''
        this.user = false
      }
      this.check2 = check.split(',')
    },
    onOrgChange (selectedIds) {
      this.announce.orgId = selectedIds
      this.orgId1 = selectedIds
    },
    onDeptChange (selectedIds) {
      this.announce.deptId = selectedIds
      this.deptId1 = selectedIds
    },
    onGangChange (selectedIds) {
      this.announce.gangId = selectedIds
      this.gangId1 = selectedIds
    },
    onUserChange (selectedIds) {
      this.announce.userId = selectedIds
      this.userId1 = selectedIds
    },
    onclose () {
      this.$router.push({ path: '/announce/list' })
    },
    onSearch () {
      this.queryTripForm.validateFields((err, values) => {
        if (err) {
          return
        }
        if (this.$refs.editor.getContent() === '') {
          this.$message.error('请输入内容')
          return
        }
        if (this.type === '') {
          this.$message.error('选择公告类型')
          return
        }
        if (this.urgency === '') {
          this.$message.error('选择紧急程度')
          return
        }
        let data = { ...this.queryTripForm.getFieldsValue() }
        if ((new Date()) > data.effectDate) {
          this.$message.error('有效时间不能小于当前时间')
          return
        }
        var check = this.check2
        var types = []
        var ids = []
        for (var i = 0; i < check.length; i++) {
          if (check[i] === '指定机构' && this.orgId1 === '') {
            types.push('O')
            ids.push(this.announce.orgId)
          }
          if (check[i] === '指定机构' && this.orgId1 !== '') {
            types.push('O')
            ids.push(this.orgId1)
          }
          if (check[i] === '指定部门' && this.deptId1 === '') {
            types.push('B')
            ids.push(this.announce.deptId)
          }
          if (check[i] === '指定部门' && this.deptId1 !== '') {
            types.push('B')
            ids.push(this.deptId1)
          }
          if (check[i] === '指定岗位' && this.gangId1 === '') {
            types.push('G')
            ids.push(this.announce.gangId)
          }
          if (check[i] === '指定岗位' && this.gangId1 !== '') {
            types.push('G')
            ids.push(this.gangId1)
          }
          if (check[i] === '指定个人' && this.userId1 === '') {
            types.push('P')
            ids.push(this.announce.userId)
          }
          if (check[i] === '指定个人' && this.userId1 !== '') {
            types.push('P')
            ids.push(this.userId1)
          }
        }
        var rs = []; var key = ['type', 'values']
        if (types !== [] && ids !== []) {
          rs = types.map(function (item, index) {
            var obj = {}
            obj[key[0]] = types[index]
            obj[key[1]] = ids[index]
            return obj
          })
        }
        if (rs.length === 0) {
          this.$message.error('输入发布范围')
          return
        }
        data.effectDate = data.effectDate.format('YYYY-MM-DD HH:mm:ss')
        data.procId = this.procId
        data.caseTypeId = this.queryId
        data.reviewerUserId = this.book.userId
        data.content = this.$refs.editor.getContent()
        data.scopeList = rs
        data.id = this.uuid
        this.$http.post('/api/1/announce/add_announce.json', qs.stringify(data, { allowDots: true })).then(
          (response) => {
            if (response.code === 200) {
              this.$message.success('添加成功')
              localStorage.setItem('caseId ', response.caseId)
              this.$router.push({ path: '/announce/view?id=' + response.caseId })
            } else {
              this.$message.error('添加失败')
            }
          }
        ).catch(function () {
        })
      })
    }
  }
}
</script>
<style scoped lang="less">
    .select{
      display: flex;
    }
    th{
      font-weight: 800;
    }
</style>
