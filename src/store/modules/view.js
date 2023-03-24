/**
* 视图部分
* Date: 2020/6/25
* Time: 11:38 下午
*/

export const ViewMutations = {
  SET_SCAN_INFO: 'SET_SCAN_INFO[设置扫描详情]',
  SET_SECTIONS: 'SET_SECTIONS[设置切片对象及资源]'
}

const view = {
  namespaced: true,
  state: {
    // 扫描详情
    scanInfo: null,
    // 切片资源对象
    sectionSource: {
      // 切片图片数据
      image: {
        LSILList: [],
        HSILList: [],
        microList: [],
        AGCList: []
      },
      // 切片资源数据
      source: {
        LSILList: [],
        HSILList: [],
        microList: [],
        AGCList: []
      }
    }
  },
  mutations: {
    [ViewMutations.SET_SCAN_INFO] (state, payload) {
      state.scanInfo = payload
    },
    [ViewMutations.SET_SECTIONS] (state, payload) {
      state.sectionSource = payload
    }
  },
  actions: {}
}

export default view
