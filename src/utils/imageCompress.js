/**
* 图片压缩
* Date: 2020/6/22
* Time: 11:19 上午
*/

/**
 * 图片压缩
 * @param source 图片资源
 * @param option 配置项
 * @returns {Promise<string>}
 */
export default async function imageCompress (source, option) {
  // 默认配置
  const defaultOptions = { width: 400, height: 400, quality: 1 }
  const { width, height, quality } = Object.assign(defaultOptions, option)
  const image = new Image(width, height)
  image.src = source
  await new Promise(resolve => {
    image.onload = resolve
  })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.height = height
  canvas.width = width
  context.clearRect(0, 0, width, height)
  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}
