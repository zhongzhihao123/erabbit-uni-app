// 封装网络请求
import { useMemberStore } from '@/store/member'
// 接口服务器基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 给 uploadFile 添加拦截器
uni.addInterceptor('uploadFile', {
  // 拦截前会执行
  invoke(arg) {
    // 判断请求的路径中是否携带基地址
    if (!(arg.url as string).startsWith('https:'))
      // 将请求的路径拼接上基地址
      arg.url = baseURL + arg.url
    // 得到 token
    const memberStore = useMemberStore()
    const token = memberStore.profile.token
    // 判断是否存在 token：存在将 token 添加到请求头中
    if (token) {
      arg.header = {
        Authorization: `Bearer ${token}`,
      }
    }
  },
})

// 给 requst 添加拦截器
uni.addInterceptor('request', {
  // 拦截前会执行
  invoke(arg) {
    // 判断请求的路径中是否携带基地址
    if (!(arg.url as string).startsWith('https:'))
      // 将请求的路径拼接上基地址
      arg.url = baseURL + arg.url
    // 得到 token
    const memberStore = useMemberStore()
    const token = memberStore.profile.token
    // 判断是否存在 token：存在将 token 添加到请求头中
    if (token) {
      arg.header = {
        Authorization: `Bearer ${token}`,
      }
    }
  },
})

// 定义返回数据的类型
type ApiRes = {
  code: string
  msg: string
  result: any
}
/**
 * 作用：用来发送网络请求
 */
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      ...options,
      // 请求成功的回调
      // uni.request 与 axios 不同
      // uni.request 不管服务器返回的信息是啥（2xx, 3xx, 4xx, 5xx）
      success: (res) => {
        // 判断状态码
        // 成功后的逻辑
        if (res.statusCode >= 200 && res.statusCode < 300) {
          return resolve((res.data as ApiRes).result)
        }
        // 添加错误提示
        uni.showToast({ title: (res.data as any).msg, icon: 'none' })
        // 失败后的逻辑
        reject(res)
      },
      // 请求失败的回调
      fail: (err) => {
        console.log('请求失败的回调: fail')
        reject(err)
      },
    })
  })
}
