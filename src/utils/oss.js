/**
* 阿里oss服务单例
* Date: 2020/6/7
* Time: 10:03 下午
*/
import Client from 'ali-oss'
const isProd = process.env.NODE_ENV === 'production'

export default class OSS {
  constructor () {
    if (!OSS.prototype.client) {
      if (isProd) {
        OSS.prototype.client.signatureUrl = (url) => url
      } else {
        OSS.prototype.client = new Client({
          region: 'oss-cn-beijing',
          accessKeyId: 'LTAI24mt9O4jnmuP',
          accessKeySecret: 'FwZonU9t2PoW1RJ4tx2EkkDU2BITZw',
          bucket: 'image-labeling-huabei2'
        })
      }
    }
    return OSS.prototype.client
  }

  static get instance () {
    if (!this.client) {
      this.client = new OSS()
    }
    return this.client
  }
}
