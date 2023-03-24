import _ from 'lodash'

export function convertRoutes (nodes) {
  if (!nodes) return null

  nodes = _.cloneDeep(nodes)

  let queue = Array.isArray(nodes) ? nodes.concat() : [nodes]

  while (queue.length) {
    const levelSize = queue.length

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()

      if (!node.children || !node.children.length) continue

      node.children.forEach(child => {
        // 转化相对路径
        if (child.path[0] !== '/' && !child.path.startsWith('http')) {
          child.path = node.path.replace(/(\w*)[/]*$/, `$1/${child.path}`)
        }
      })

      queue = queue.concat(node.children)
    }
  }

  return nodes
}

/**
 * 获取子路由
 * @param routes
 * @param list
 * @param target
 * @returns {*[]}
 */
export function siblingRoutes (routes, list = [], target) {
  routes.children.forEach(route => {
    if (route.name === target.name && routes.name !== 'Index') {
      list = routes.children
    }
    if (route.children) {
     list = siblingRoutes(route, list, target)
    }
  })
  return list
}
