import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView
}

export const staticRouterMap = [
  // dashboard
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/workplace',
    component: RouteView,
    meta: { title: '仪表盘', icon: 'dashboard' },
    hidden: true,
    children: [
      {
        path: '/dashboard/workplace',
        name: 'Workplace',
        component: () => import('../views/dashboard/Workplace'),
        meta: { title: '工作台' }
      }
    ]
  },
  // account
  {
    path: '/account',
    component: RouteView,
    hidden: true,
    meta: { title: '个人中心', keepAlive: true },
    children: [
      {
        path: '/account/settings',
        name: 'settings',
        component: () => import('@/views/account/settings/Index'),
        meta: { title: '个人设置', hideHeader: true, keepAlive: true },
        redirect: '/account/settings/base',
        alwaysShow: true,
        children: [
          {
            path: '/account/settings/base',
            name: 'BaseSettings',
            component: () => import('@/views/account/settings/BaseSetting'),
            meta: { title: '基本设置', hidden: true, keepAlive: true }
          },
          {
            path: '/account/settings/security',
            name: 'SecuritySettings',
            component: () => import('@/views/account/settings/Security'),
            meta: { title: '安全设置', hidden: true, keepAlive: true }
          },
          {
            path: '/account/settings/custom',
            name: 'CustomSettings',
            component: () => import('@/views/account/settings/Custom'),
            meta: { title: '个性化设置', hidden: true, keepAlive: true }
          },
          {
            path: '/account/settings/binding',
            name: 'BindingSettings',
            component: () => import('@/views/account/settings/Binding'),
            meta: { title: '账户绑定', hidden: true, keepAlive: true }
          },
          {
            path: '/account/settings/notification',
            name: 'NotificationSettings',
            component: () => import('@/views/account/settings/Notification'),
            meta: { title: '新消息通知', hidden: true, keepAlive: true }
          }
        ]
      }
    ]
  },
  // workflow
  {
    path: '/workflow',
    component: RouteView,
    name: 'Workflow',
    hidden: true,
    meta: { title: '工作流', icon: 'dashboard' },
    redirect: '/workflow/task',
    children: [
      {
        path: '/workflow/task',
        name: 'WorkflowTask',
        hidden: true,
        component: () => import('../views/workflow/WorkflowTask'),
        meta: { title: '我的待办' }
      },
      {
        path: '/workflow/pass',
        name: 'WorkflowPass',
        hidden: true,
        component: () => import('../views/workflow/WorkflowPass'),
        meta: { title: '我的经办' }
      }
    ]
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/Login')
  },
  {
    path: '/404',
    component: () => import('../views/exception/404')
  },
  {
    path: '/',
    redirect: '/login',
    name: '首页',
    hidden: true
  }
]

// 递归构建子菜单
function builderChildrenRouter (routerMap, parentRouter) {
  const accessedRouters = routerMap.map(item => {
    const currentRouter = {
      // 路由地址结果 eg: /dashboard/analysis
      path: item.path,
      name: item.id,
      // 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || null },
      hidden: item.hidden
    }
    if (item.query) {
      currentRouter.query = item.query
    }
    if (item.children && item.children.length > 0) {
      currentRouter.component = constantRouterComponents[item.component] || (() => import(item.view))
      currentRouter.children = builderChildrenRouter(item.children, item)
    } else {
      if (item.view.indexOf('@/views/') === 0) {
        currentRouter.component = () => import('@/views/' + item.view.substring(8))
      } else if (item.view.indexOf('@/epp/') === 0) {
        currentRouter.component = () => import('@/epp/' + item.view.substring(6))
      }
    }
    return currentRouter
  })
  return accessedRouters
}

function mapFxModules (modules) {
  const mappedModules = modules.map(item => {
    const menu = {
      id: item.id,
      path: item.path,
      title: item.name,
      icon: item.icon ? item.icon : null,
      view: item.viewTemplate,
      hidden: item.state !== '1'
    }
    if (item.caseTypeId) {
      menu.query = { caseTypeId: item.caseTypeId }
    }
    if (item.hasChildren) {
      menu.component = 'RouteView'
      menu.children = mapFxModules(item.children)
    }
    return menu
  })

  return mappedModules
}

export function generateModuleRoute (modules) {
  let result = mapFxModules(modules)
  /*
  result = [{
    'id': '1',
    'title': '组织机构',
    'path': '/system',
    'component': 'RouteView',
    'icon': 'dashboard',
    'children': [
      {
        'id': '2',
        'title': '模块配置',
        'path': '/org/index',
        'view': '',
        'component': 'RouteView',
        'icon': 'dashboard',
        'children': [
          {
            'id': '3',
            'title': '二级模块配置',
            'path': '/org/index/detail',
            'view': '@/views/module/ModuleIndex',
            'icon': 'none',
            'children': []
          }
        ]
      }
    ]
  }]
  */
  let asyncRouters = result.map(item => {
    // 一级菜单
    const currentRouter = {
      path: `${item.path}`,
      name: item.id,
      // 获取页面 layout
      component: constantRouterComponents[item.component] || (() => import(item.view)),
      meta: { title: item.title, icon: item.icon || null },
      query: item.query,
      hidden: item.hidden
    }
    // 有子菜单
    if (item.children && item.children.length > 0) {
      currentRouter.children = builderChildrenRouter(item.children, item)
    }
    return currentRouter
  })

  const finalRouter = [
    {
      path: '/',
      component: BasicLayout,
      name: 'index',
      meta: { title: '首页' },
      redirect: '/dashboard/workplace',
      children: staticRouterMap.concat(asyncRouters)
    },
    {
      path: '*', redirect: '/404', hidden: true
    }
  ]

  return finalRouter
}

export const asyncRouterMapBak = [
  {
    path: '/',
    component: BasicLayout,
    name: 'index',
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', icon: 'dashboard' },
        children: [
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('../views/dashboard/Workplace'),
            meta: { title: '工作台' }
          }
        ]
      },
      // claim
      {
        path: '/claim',
        component: RouteView,
        name: 'Claim',
        redirect: '/claim/index',
        meta: { title: '报销管理', icon: 'dashboard' },
        children: [
          {
            path: '/claim/add',
            name: 'ClaimAdd',
            component: () => import('../epp/claim/ClaimAdd'),
            meta: { title: '报销申请' },
            query: { caseTypeId: '048bd49a-7925-4e53-ab70-326382c8f630' }
          },
          {
            path: '/claim/index',
            name: 'ClaimIndex',
            component: () => import('../epp/claim/ClaimIndex'),
            meta: { title: '我的报销' }
          },
          {
            path: '/claim/stat',
            name: 'ClaimStat',
            component: () => import('../epp/claim/ClaimStat'),
            meta: { title: '报销统计', permission: ['claim.stats'] }
          },
          {
            path: '/claim/view',
            name: 'ClaimView',
            hidden: true,
            component: () => import('../epp/claim/ClaimView'),
            meta: { title: '报销详情' }
          },
          {
            path: '/claim/edit',
            name: 'ClaimEdit',
            hidden: true,
            component: () => import('../epp/claim/ClaimEdit'),
            meta: { title: '修改报销申请' }
          }
        ]
      },
      // sms
      {
        path: '/sms',
        component: RouteView,
        name: 'sms',
        redirect: '/sms/index',
        meta: { title: '短信管理', icon: 'dashboard', permission: ['sms.manager'] },
        children: [
          {
            path: '/sms/index',
            name: 'SmsIndex',
            component: () => import('../epp/sms/SmsIndex'),
            meta: { title: '短信发送记录' }
          }
        ]
      },
      // system
      {
        path: '/system',
        component: RouteView,
        name: 'system',
        redirect: '/attachment/list',
        meta: { title: '系统管理', icon: 'table', permission: ['system.manage'] },
        children: [
          {
            path: '/org/index',
            name: 'OrgList',
            component: () => import('@/views/org/OrgIndex'),
            meta: { title: '组织机构' }
          },
          {
            path: '/module/index',
            name: 'ModuleIndex',
            component: () => import('@/views/module/ModuleIndex'),
            meta: { title: '模块配置' }
          },
          {
            path: '/workflow/design/list',
            name: 'WorkflowPanel',
            component: () => import('@/views/workflow/design/WorkflowPanel'),
            meta: { title: '流程管理' }
          },
          {
            path: '/schedule/index',
            name: 'ScheduleList',
            component: () => import('@/views/schedule/ScheduleIndex'),
            meta: { title: '定时任务' }
          },
          {
            path: '/dict/index',
            name: 'DictList',
            component: () => import('@/views/dict/DictIndex'),
            meta: { title: '数据字典' }
          },
          {
            path: '/dict/panel',
            name: 'DictPanel',
            component: () => import('@/views/dict/DictPanel'),
            hidden: true,
            meta: { title: '编辑字典' }
          },
          {
            path: '/attachment/list',
            name: 'AttachmentList',
            component: () => import('@/views/attachment/AttachmentList'),
            meta: { title: '附件上传' }
          },
          {
            path: '/log/index',
            name: 'LogIndex',
            component: () => import('@/views/log/LogIndex'),
            meta: { title: '系统日志' }
          }
        ]
      },
      // account
      {
        path: '/account',
        component: RouteView,
        hidden: true,
        meta: { title: '个人中心', keepAlive: true },
        children: [
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, keepAlive: true },
            redirect: '/account/settings/base',
            alwaysShow: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true }
              }
            ]
          }
        ]
      },
      // workflow
      {
        path: '/workflow',
        component: RouteView,
        name: 'Workflow',
        hidden: true,
        meta: { title: '工作流', icon: 'dashboard' },
        redirect: '/workflow/task',
        children: [
          {
            path: '/workflow/task',
            name: 'WorkflowTask',
            hidden: true,
            component: () => import('../views/workflow/WorkflowTask'),
            meta: { title: '我的待办' }
          },
          {
            path: '/workflow/pass',
            name: 'WorkflowPass',
            hidden: true,
            component: () => import('../views/workflow/WorkflowPass'),
            meta: { title: '我的经办' }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]
