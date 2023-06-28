// 管理所有与 category 相关的网络请求
import { http } from '@/utils/http'

/**
 * 一级分类项
 */
export interface CategoryTopItem {
  /**
   * 二级分类集合
   */
  children: SubCategory[]
  /**
   * 一级分类id
   */
  id: string
  /**
   * 一级分类图片集
   */
  imageBanners: string[]
  /**
   * 一级分类名称
   */
  name: string
  /**
   * 一级分类图片
   */
  picture: string
}

/**
 * 二级分类项
 */
export interface SubCategory {
  brands: null
  categories: null
  /**
   * 商品集合
   */
  goods: Good[]
  /**
   * 二级分类id
   */
  id: string
  /**
   * 二级分类名称
   */
  name: string
  parentId: null
  parentName: null
  /**
   * 二级分类图片
   */
  picture: string
  saleProperties: null
}

/**
 * 商品项
 */
export interface Good {
  /**
   * 商品描述
   */
  desc: string
  discount: null
  /**
   * 商品id
   */
  id: string
  /**
   * 商品名称
   */
  name: string
  orderNum: number
  /**
   * 商品图片
   */
  picture: string
  /**
   * 商品价格
   */
  price: string
}

/**
 * 获取分类数据
 * @returns
 */
export const getCategoryTop = () =>
  http<CategoryTopItem[]>({ url: '/category/top' })
