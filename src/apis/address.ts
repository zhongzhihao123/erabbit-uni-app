// 管理所有与地址相关的接口
import { http } from '@/utils/http'

/**
 * 添加收货地址：请求参数类型
 */
export interface PostMemberAddressData {
  /**
   * 详细地址
   */
  address: string
  /**
   * 所在城市编码
   */
  cityCode: string
  /**
   * 联系方式
   */
  contact: string
  /**
   * 所在区/县编码
   */
  countyCode: string
  /**
   * 是否为默认，1为是，0为否
   */
  isDefault: number
  /**
   * 所在省份编码
   */
  provinceCode: string
  /**
   * 收货人姓名
   */
  receiver: string
}

/**
 * 添加收货地址
 * @param data
 * @returns
 */
export const postMemberAddress = (data: PostMemberAddressData) =>
  http({
    url: '/member/address',
    method: 'POST',
    data,
  })

/**
 * 获取收货地址列表：返回数据类型
 */
export interface MemberAddressItem {
  /**
   * 详细地址
   */
  address: string
  /**
   * 所在城市编码
   */
  cityCode: string
  /**
   * 联系方式
   */
  contact: string
  /**
   * 所在区/县编码
   */
  countyCode: string
  /**
   * 省市区(县)
   */
  fullLocation: string
  /**
   * 收货地址id
   */
  id: string
  /**
   * 是否为默认，1为是，0为否
   */
  isDefault: number
  /**
   * 所在省份编码
   */
  provinceCode: string
  /**
   * 收货人姓名
   */
  receiver: string
}

/**
 * 获取收货地址列表
 * @returns
 */
export const getMemberAddress = () =>
  http<MemberAddressItem[]>({ url: '/member/address' })

/**
 * 获取收货地址详情
 * @param id
 * @returns
 */
export const getMemberAddressById = (id: string) =>
  http<MemberAddressItem>({ url: `/member/address/${id}` })

/**
 * 修改收货地址
 * @param id 地址的 id
 * @param data 要修改的数据
 * @returns
 */
export const putMemberAddressById = (id: string, data: PostMemberAddressData) =>
  http({ url: `/member/address/${id}`, method: 'PUT', data })

/**
 * 删除地址
 * @param id
 * @returns
 */
export const deleteMemberAddressById = (id: string) =>
  http({ url: `/member/address/${id}`, method: 'DELETE' })
