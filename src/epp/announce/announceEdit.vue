<template>
    <page-view title="编辑公告">
        <a-card>
          <a-form :form="queryTripForm">
              <table class="fx-form">
                    <tr>
                        <th class="not-null">标题</th>
                        <td>
                          <a-form-item>
                             <a-input v-decorator="['title',{initialValue:announceEdit.title,rules: [{ required: true, message: '请输入标题'}]}]"></a-input>
                          </a-form-item>
                        </td>
                        <th class="not-null">类型</th>
                        <td>
                            <a-form-item>
                                <dict-cascader dictKey="ANNOUNCE.ANN_TYPES"
                                    v-decorator="['annTypes', {initialValue:announceEdit.annTypes,rules: [{ required: true, message: '请选择类型'}]}]" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                        <th class="not-null">有效日期</th>
                        <td>
                            <a-form-item>
                                    <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['effectDate',{ initialValue:announceEdit.effectDate,rules: [{ required: true, message: '请输入日期' }]}]" />
                              </a-form-item>
                        </td>
                        <th class="not-null">紧急程度</th>
                        <td>
                            <a-form-item>
                                 <dict-cascader  dictKey="ANNOUNCE.URGENCY"  v-decorator="['urgency', {initialValue:announceEdit.urgency,rules: [{ required: true, message: '请选择紧急程度'}]}]" />
                            </a-form-item>
                        </td>
                    </tr>
                    <tr>
                      <th class="not-null">发布范围</th>
                      <td>
                        <a-form-item>
                           <a-checkbox-group :options="plainOptions" @change="onDate" :value="defalt"/>
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
                            <upload-selector :referId='announceEdit.id' configKey='NOTICE.FILE'/>
                        </a-form-item>
                      </td>
                    </tr>
                     <tr>
                      <th>备注</th>
                      <td>
                          <a-form-item>
                             <a-input v-decorator="['memo',{ initialValue:announceEdit.memo}]"></a-input>
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
import qs from 'qs'
import moment from 'moment'
import OrgSelector from '@/components/selector/OrgSelector'
import DeptSelector from '@/components/selector/DeptSelector'
import UserSelector from '@/components/selector/UserSelector'
import UploadSelector from '@/components/selector/UploadSelector'
import TinyMCE from '@/components/Editor/TinyMCE'
import DictCascader from '../../components/dict/DictCascader'
const plainOptions = ['指定机构', '指定部门', '指定岗位', '指定个人']
export default {
  name: 'BookIndex',
  components: {
    PageView,
    OrgSelector,
    DeptSelector,
    UserSelector,
    DictCascader,
    TinyMCE,
    UploadSelector
  },
  data () {
    return {
      uuid: '',
      defalt: [],
      announceEdit: {
        effectDate: null,
        title: '',
        annTypes: null,
        urgency: null
      },
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
      orgId2: '',
      deptId2: '',
      gangId2: '',
      userId2: '',
      org: false,
      dept: false,
      user: false,
      gang: false,
      submitParam: {
      },
      type: '',
      urgency: '',
      check2: [],
      procId: '',
      queryId: this.$route.query.id,
      scoRelea: [],
      user1: ''
    }
  },
  created () {
    this.loadData()
    this.user1 = this.$ls.get('user')
    this.announce.orgId = this.user1.orgId
    this.announce.deptId = this.user1.deptId
    this.announce.gangId = this.user1.posId
    this.announce.userId = this.user1.id
  },
  methods: {
    loadData () {
      this.$http.get('/api/1/announce/edit_announce_jump.json?id=' + this.queryId).then(
        (res) => {
          this.announceEdit = res.result
          this.book.userId = res.result.reviewerUserId
          this.announceEdit.effectDate = moment(res.result.effectDate)
          this.content = res.result.content
          this.scoRelea = res.result.scopeList
          this.check2 = res.result.scopeTypes.split(',')
          for (var i = 0; i < res.result.scopeList.length; i++) {
            if (res.result.scopeList[i].type === 'O') {
              this.org = true
              var orang = '指定机构'
              this.defalt.push(orang)
              this.orgId2 = res.result.scopeList[i].values
              this.orgId1 = res.result.scopeList[i].values
              this.announce.orgId = this.orgId2
            }
            if (res.result.scopeList[i].type === 'B') {
              this.dept = true
              var division = '指定部门'
              this.defalt.push(division)
              this.deptId2 = res.result.scopeList[i].values
              this.deptId1 = res.result.scopeList[i].values
              this.announce.deptId = this.deptId2
            }
            if (res.result.scopeList[i].type === 'G') {
              this.gang = true
              var station = '指定岗位'
              this.defalt.push(station)
              this.gangId2 = res.result.scopeList[i].values
              this.gangId1 = res.result.scopeList[i].values
              this.announce.gangId = this.gangId2
            }
            if (res.result.scopeList[i].type === 'P') {
              this.user = true
              var my = '指定个人'
              this.defalt.push(my)
              this.announce.userId = res.result.scopeList[i].values
              this.userId2 = res.result.scopeList[i].values
              this.userId1 = res.result.scopeList[i].values
              this.announce.userId = this.userId2
            }
          }
        }
      )
    },
    onChangeProcess (id) {
      this.procId = id
    },
    onChangeUser (selectedIds) {
      this.book.userId = selectedIds
    },
    onDate (checkedValues) {
      var check = checkedValues.join(',')
      var defalt = Array.from(new Set(this.defalt))
      if (check.indexOf('指定机构') !== -1) {
        if (this.announce.orgId !== this.user1.orgId) {
          this.announce.orgId = this.orgId1
        }
        this.org = true
        for (var i = 0; i <= defalt.length; i++) {
          if (this.org === true && defalt[i] !== '指定机构') {
            this.defalt.push('指定机构')
            break
          }
        }
      } else if (check.indexOf('指定机构') === -1) {
        this.orgId1 = ''
        this.org = false
        for (var i = 0; i < this.defalt.length; i++) {
          if (this.defalt[i] === '指定机构') {
            this.defalt.splice(i, 1)
          }
        }
      }
      if (check.indexOf('指定部门') !== -1) {
        if (this.announce.deptId !== this.user1.deptId) {
          this.announce.deptId = this.deptId1
        }
        this.dept = true
        for (var i = 0; i <= defalt.length; i++) {
          if (this.dept === true && defalt[i] !== '指定部门') {
            this.defalt.push('指定部门')
            break
          }
        }
      } else if (check.indexOf('指定部门') === -1) {
        this.deptId1 = ''
        this.dept = false
        for (var i = 0; i < this.defalt.length; i++) {
          if (this.defalt[i] === '指定部门') {
            this.defalt.splice(i, 1)
          }
        }
      }
      if (check.indexOf('指定岗位') !== -1) {
        if (this.announce.gangId !== this.user1.posId) {
          this.announce.gangId = this.gangId1
        }
        this.gang = true
        for (var i = 0; i <= defalt.length; i++) {
          if (this.gang === true && defalt[i] !== '指定岗位') {
            this.defalt.push('指定岗位')
            break
          }
        }
      } else if (check.indexOf('指定岗位') === -1) {
        this.gangId1 = ''
        this.gang = false
        for (var i = 0; i < this.defalt.length; i++) {
          if (this.defalt[i] === '指定岗位') {
            this.defalt.splice(i, 1)
          }
        }
      }
      if (check.indexOf('指定个人') !== -1) {
        if (this.announce.userId !== this.user1.id) {
          this.announce.userId = this.userId1
        }
        this.user = true
        for (var i = 0; i <= defalt.length; i++) {
          if (this.user === true && defalt[i] !== '指定个人') {
            this.defalt.push('指定个人')
            break
          }
        }
      } else if (check.indexOf('指定个人') === -1) {
        this.userId1 = ''
        this.user = false
        for (var i = 0; i < this.defalt.length; i++) {
          if (this.defalt[i] === '指定个人') {
            this.defalt.splice(i, 1)
          }
        }
      }
      var defalt = Array.from(new Set(this.defalt))
      this.defalt = defalt
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
          rs = this.scoRelea
        }
        data.effectDate = data.effectDate.format('YYYY-MM-DD HH:mm:ss')
        data.reviewerUserId = this.book.userId
        data.id = this.queryId
        data.content = this.$refs.editor.getContent()
        data.scopeList = rs
        this.$http.post('/api/1/announce/edit_announce.json', qs.stringify(data, { allowDots: true })).then(
          (response) => {
            if (response.code === 200) {
              this.$message.success('编辑成功')
              this.$router.push({ path: '/announce/view?id=' + this.queryId })
            } else {
              this.$message.error('编辑失败!')
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
