// 管理所有与个人信息相关的接口
import { http } from '@/utils/http'

/**
 * 获取个人信息：返回数据的类型
 */
export interface ProfileResult {
  /**
   * 账号名称
   */
  account: string
  /**
   * 头像
   */
  avatar: string
  /**
   * 生日
   */
  birthday: null | string
  /**
   * 省市区的名称：如山东省济南市里历下区
   */
  fullLocation: string
  /**
   * 性别，男、女、未知
   */
  gender: Gender
  /**
   * 用户Id
   */
  id: string
  /**
   * 昵称
   */
  nickname: null | string
  /**
   * 职业
   */
  profession: null | string
}

/**
 * 性别，男、女、未知
 */
export enum Gender {
  女 = '女',
  未知 = '未知',
  男 = '男',
}
/**
 * 获取个人信息
 * @returns
 */
export const getMemberProfile = () =>
  http<ProfileResult>({ url: '/member/profile' })

/**
 * 修改个人信息：请求参数类型
 */
export interface PutMemberProfileData {
  /**
   * 生日 YYYY-MM-DD
   */
  birthday?: null | string
  /**
   * 城市编码
   */
  cityCode?: null | string
  /**
   * 区/县编码
   */
  countyCode?: null | string
  /**
   * 性别，男、女、未知
   */
  gender?: Gender
  /**
   * 昵称
   */
  nickname?: null | string
  /**
   * 职业
   */
  profession?: null | string
  /**
   * 省份编码
   */
  provinceCode?: null | string
}

/**
 * 修改个人信息
 */
export const putMemberProfile = (data: PutMemberProfileData) =>
  http({
    url: '/member/profile',
    method: 'PUT',
    data,
  })
