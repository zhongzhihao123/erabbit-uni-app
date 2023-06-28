// 管理所有与登录相关的接口
import { http } from '@/utils/http'

/**
 * 小程序登录：接收参数的类型
 */
export interface LoginWxMinData {
  code: string
  encryptedData: string
  iv: string
}

/**
 * 小程序登录：返回数据的类型
 */
export interface LoginWxMinResult {
  /**
   * 用户名
   */
  account: string
  /**
   * 用户头像
   */
  avatar: string
  /**
   * 用户id
   */
  id: number
  /**
   * 用户手机号
   */
  mobile: string
  /**
   * 用户昵称
   */
  nickname: null | string
  /**
   * 用于后续接口调用的token，有效期三天
   */
  token: string
}

/**
 * 小程序登录
 * @param data 接收参数的类型
 * @returns
 */
export const postLoginWxMin = (data: LoginWxMinData) =>
  http<LoginWxMinResult>({ url: '/login/wxMin', method: 'POST', data })

/**
 * 小程序登录 - 内测版
 * @param phoneNumber 登录的手机号
 * @returns
 */
export const postLoginWxMinSimple = (phoneNumber: string) =>
  http<LoginWxMinResult>({
    url: '/login/wxMin/simple',
    method: 'POST',
    data: { phoneNumber },
  })
