// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView } from '@/layouts'

export const asyncRouterMap = [
  {
    path: '/',
    name: 'Index',
    component: BasicLayout,
    meta: { title: '工作区', permission: [ 'common' ] },
    redirect: '/workspace/diagnose',
    children: [

      // Workspace
      {
        path: '/workspace',
        name: 'Workspace',
        component: RouteView,
        redirect: '/workspace/diagnose',
        meta: { title: '列表', icon: 'table', permission: [ 'common' ] },
        children: [
          {
            path: '/workspace/diagnose',
            name: 'Diagnose',
            component: () => import('@/views/workspace/diagnose'),
            meta: { title: '待诊断', icon: 'customer-service', keepAlive: false, permission: [ 'common' ] }
          },
          {
            path: '/workspace/print',
            name: 'Print',
            component: () => import('@/views/workspace/print'),
            meta: { title: '待打印', icon: 'printer', keepAlive: false, permission: [ 'common' ] }
          },
          {
            path: '/workspace/scan',
            name: 'Scan',
            component: () => import('@/views/workspace/scan'),
            meta: { title: '待扫描', icon: 'scan', keepAlive: false, permission: [ 'common' ] }
          },
          {
            path: '/workspace/task',
            name: 'Task',
            component: () => import('@/views/workspace/task'),
            meta: { title: '未完成任务', icon: 'calendar', keepAlive: false, permission: [ 'common' ] }
          }
        ]
      },

      // Report
      {
        path: '/report/:id',
        name: 'Report',
        component: () => import('@/views/report'),
        meta: { title: '打印报告', icon: 'report', permission: [ 'common' ] }
      },

      // Setting
      {
        path: '/setting',
        name: 'Setting',
        component: RouteView,
        redirect: '/setting/password-change',
        meta: { title: '设置', icon: 'setting', permission: [ 'common' ] },
        children: [
          {
            path: '/setting/password-change',
            name: 'PasswordChange',
            component: () => import('@/views/setting/passwordChange'),
            meta: { title: '密码修改', icon: 'key', permission: [ 'common' ] }
          },
          {
            path: '/setting/hospital-info',
            name: 'HospitalInfo',
            component: () => import('@/views/setting/hospitalInfo'),
            meta: { title: '医院信息', icon: 'bank', permission: [ 'admin' ] }
          },
          {
            path: '/setting/user-management',
            name: 'UserManagement',
            component: () => import('@/views/setting/userManagement'),
            meta: { title: '用户管理', icon: 'team', permission: [ 'admin' ] }
          },
          {
            path: '/setting/report-template',
            name: 'ReportTemplate',
            component: () => import('@/views/setting/reportTemplate'),
            meta: { title: '报告模板', icon: 'audit', permission: [ 'admin' ] }
          },
          {
            path: '/setting/read-film',
            name: 'ReadFilm',
            component: () => import('@/views/setting/readFilm'),
            meta: { title: '阅片平台管理', icon: 'file-done', permission: [ 'admin' ] }
          },
          {
            path: '/setting/data-management',
            name: 'DataManagement',
            component: () => import('@/views/setting/dataManagement'),
            meta: { title: '数据管理', icon: 'save', permission: [ 'admin' ] }
          },
        ]
      },

      // Case
      {
        path: '/case',
        name: 'Case',
        component: () => import('@/views/case'),
        meta: { title: '所有病例统计', icon: 'setting', permission: [ 'common' ] }
      },

      // Debug
      {
        path: '/debug',
        name: 'Debug',
        component: RouteView,
        redirect: '/debug/parameter',
        meta: { title: '调试', icon: 'control', permission: [ 'admin' ] },
        children: [
          {
            path: '/debug/parameter',
            name: 'Parameter',
            component: () => import('@/views/debug/parameter'),
            meta: { title: '运动控制&参数调整', icon: 'control', keepAlive: false, permission: [ 'admin' ] }
          }
        ]
      },

      // LIS
      {
        path: '/lis',
        name: 'LIS',
        component: RouteView,
        redirect: '/lis/patient',
        meta: { title: 'LIS管理', icon: 'setting', permission: [ 'common' ] },
        children: [
          {
            path: '/lis/patient',
            name: 'Patient',
            component: () => import('@/views/lis/patient'),
            meta: { title: '病人信息录入', icon: 'usergroup-add', keepAlive: false, permission: [ 'common' ] }
          },
          {
            path: '/lis/doctor',
            name: 'Doctor',
            component: () => import('@/views/lis/doctor'),
            meta: { title: '医生信息录入', icon: 'user-add', keepAlive: false, permission: [ 'admin' ] }
          },
          {
            path: '/lis/department',
            name: 'Department',
            component: () => import('@/views/lis/department'),
            meta: { title: '部门信息录入', icon: 'apartment', keepAlive: false, permission: [ 'admin' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'Exception',
        hidden: true,
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning', permission: [ 'common' ] },
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403', permission: [ 'common' ] }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404', permission: [ 'common' ] }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500', permission: [ 'common' ] }
          }
        ]
      }
    ]
  },
  // QuickReview
  {
    path: '/quick-review/:specimen_id',
    name: 'QuickReview',
    component: () => import('@/views/quickReview'),
    meta: { title: '快速预览', icon: 'preview', permission: [ 'common' ] }
  },
  // Review
  {
    path: '/review/:specimen_id',
    name: 'Review',
    component: () => import('@/views/review'),
    meta: { title: '审阅', icon: 'preview', permission: [ 'common' ] }
  },
  // PreReview
  {
    path: '/pre-review/:id',
    name: 'PreReview',
    component: () => import('@/views/preReview'),
    meta: { title: '预审', icon: 'preReview', permission: [ 'common' ] }
  },
  {
    path: '*', redirect: '/404', hidden: true, meta: { permission: ['common'] }
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
