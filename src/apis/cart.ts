// 管理所有与购物车相关的网络请求
import { http } from '@/utils/http'

/**
 * 加入购物：请求参数类型
 */
export interface postMemberCartData {
  /**
   * 商品的 SKUID
   */
  skuId: string
  /**
   * 商品的数量
   */
  count: number
}

/**
 * 加入购物车
 * @param data
 * @returns
 */
export const postMemberCart = (data: postMemberCartData) =>
  http({
    url: '/member/cart',
    method: 'POST',
    data,
  })

/**
 * 获取购物车列表：返回数据类型
 */
export interface MemeberCartItem {
  /**
   * 属性文字，例如“颜色:瓷白色 尺寸：8寸”
   */
  attrsText: string
  /**
   * 数量
   */
  count: number
  /**
   * 折扣信息
   */
  discount: number
  /**
   * SPUID
   */
  id: string
  /**
   * 是否收藏
   */
  isCollect: boolean
  /**
   * 是否为有效商品
   */
  isEffective: boolean
  /**
   * 商品名称
   */
  name: string
  /**
   * 当前的价格
   */
  nowPrice: number
  /**
   * 图片
   */
  picture: string
  /**
   * 加入时价格
   */
  price: number
  /**
   * 是否选中
   */
  selected: boolean
  /**
   * SKUID
   */
  skuId: string
  /**
   * 库存
   */
  stock: number
}

/**
 * 获取购物车列表
 * @returns
 */
export const getMemeberCart = () =>
  http<MemeberCartItem[]>({ url: '/member/cart' })

/**
 * 删除/清空购物车商品：请求参数的类型
 */
export interface DeleteMemberCartData {
  /**
   * 删除商品 id 的集合
   */
  ids: string[]
  /**
   * 是否是清除
   */
  clearAll?: boolean
  /**
   * 是否清空无效商品
   */
  clearInvalid?: boolean
}

/**
 * 删除/清空购物车商品
 * @param data
 * @returns
 */
export const deleteMemberCart = (data: DeleteMemberCartData) =>
  http({
    url: '/member/cart',
    method: 'DELETE',
    data,
  })

/**
 * 修改购物车商品：请求参数的类型
 */
export interface MebmerCartData {
  /**
   * 选中的状态
   */
  selected?: boolean
  /**
   * 商品的数量
   */
  count?: number
}

/**
 * 修改购物车商品
 * @param id
 * @param data
 * @returns
 */
export const putMemberCartById = (id: string, data: MebmerCartData) =>
  http({ url: `/member/cart/${id}`, method: 'PUT', data })

/**
 * 购物车全选/取消全选：请求参数的类型
 */
export interface PutMemberCartSelectedData {
  /**
   * skuId集合
   */
  ids?: string[]
  /**
   * 是否选中
   */
  selected: boolean
}

/**
 * 购物车全选/取消全选
 * @param data
 * @returns
 */
export const putMemberCartSelected = (data: PutMemberCartSelectedData) =>
  http({ url: '/member/cart/selected', method: 'PUT', data })
