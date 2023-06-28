// 专门用来封装首页的请求 api

// 导入网络请求的方法
import { http } from '@/utils/http'

/**
 * 广告区域：返回数据的类型
 */
export interface BannerItem {
  /**
   * 跳转链接
   */
  hrefUrl: string
  /**
   * id
   */
  id: string
  /**
   * banner链接
   */
  imgUrl: string
  /**
   * 跳转类型1、页面2、H5 3、小程序（小程序使用）
   */
  type: number
}

/**
 * 广告区域：获取广告区域的数据源
 * @param distributionSite 广告区域展示位置 1 为首页（默认值）2 为商品分类页
 * @returns
 */
export const getHomeBanner = (distributionSite = 1) => {
  return http<BannerItem[]>({
    url: '/home/banner',
    method: 'GET',
    data: {
      distributionSite,
    },
  })
}

/**
 * 前台分类：返回数据的类型
 */
export interface CategoryItem {
  // 分类的图标
  icon: string
  // 唯一标识
  id: string
  // 分类的名称
  name: string
}

/**
 * 前台分类：获取前台分类的数据源
 * @returns
 */
export const getHomeCategoryMutli = () => {
  return http<CategoryItem[]>({
    url: '/home/category/mutli',
    method: 'GET',
  })
}

/**
 * 热门推荐：返回数据类型
 */
export interface HotMutliItem {
  /**
   * 推荐说明
   */
  alt: string
  /**
   * id
   */
  id: string
  /**
   * 图片集合
   */
  pictures: string[]
  /**
   * 跳转地址
   */
  target: string
  /**
   * 推荐标题
   */
  title: string
  /**
   * 推荐类型
   */
  type: number
}

/**
 * 热门推荐：获取热门推荐的数据源
 * @returns
 */
export const getHomeHotMutli = () => {
  return http<HotMutliItem[]>({
    url: '/home/hot/mutli',
    method: 'GET',
  })
}

/**
 * 新鲜好物：返回数据的类型
 */
export interface NewItem {
  /**
   * 备注
   */
  desc: string
  /**
   * id
   */
  id: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品图片链接
   */
  picture: string
  /**
   * 价格
   */
  price: number
}

/**
 * 新鲜好物：获取新鲜好物的数据源
 * @param limit 默认值为 4，指定响应数据中商品的数量
 * @returns
 */
export const getHomeNew = (limit = 4) => {
  return http<NewItem[]>({
    url: '/home/new',
    method: 'GET',
  })
}

/**
 * 猜你喜欢：接口参数的类型
 */
export interface GuessData {
  page?: number
  pageSize?: number
}

/**
 * 猜你喜欢：返回数据的类型
 */
export interface GuessResult {
  /**
   * 总条数
   */
  counts: number
  /**
   * 当前页数据
   */
  items: GuessItem[]
  /**
   * 当前页数
   */
  page: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 每页条数
   */
  pageSize: number
}

/**
 * 猜你喜欢：商品信息的类型
 */
export interface GuessItem {
  /**
   * 商品描述
   */
  desc: string
  /**
   * 商品折扣
   */
  discount: number
  /**
   * id
   */
  id: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品已下单数量
   */
  orderNum: number
  /**
   * 商品图片
   */
  picture: string
  /**
   * 商品价格
   */
  price: number
}

/**
 * 猜你喜欢：获取猜你喜欢数据
 * @param data 接口参数
 * @returns
 */
export const getHomeGoodsGuessLike = (data: GuessData) => {
  return http<GuessResult>({
    url: '/home/goods/guessLike',
    method: 'GET',
    data,
  })
}

/**
 * 特惠推荐：接收参数类型
 */
export interface RecommendData {
  // Tab 项的 id，默认查询全部 Tab 项的第 1 页数据
  subType?: string
  // 示例值：10 分页数据每页条数
  pageSize?: number
  // 示例值：1 分页页码
  page?: number
}

// 热门推荐：接口返回数据的类型
export interface Result {
  /**
   * 活动图片
   */
  bannerPicture: string
  /**
   * id信息
   */
  id: string
  /**
   * 子类选项集合
   */
  subTypes: SubType[]
  /**
   * 活动标题
   */
  title: string
}

// 热门推荐： tab项的数据源
export interface SubType {
  goodsItems: GoodsItem
  /**
   * 子类选项id
   */
  id: string
  /**
   * 子类选项名称
   */
  title: string
}

// 热门推荐： tab项下的数据源分页信息
export interface GoodsItem {
  /**
   * 总数量
   */
  counts: number
  /**
   * 商品集合
   */
  items: Item[]
  /**
   * 页码
   */
  page: number
  /**
   * 总页数
   */
  pages: number
  /**
   * 页容量
   */
  pageSize: number
}

// 热门推荐：tab项下的商品信息
export interface Item {
  /**
   * 商品描述
   */
  desc: string
  /**
   * 商品id
   */
  id: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品图片
   */
  picture: string
  /**
   * 商品价格
   */
  price: number
}

/**
 * 特惠推荐：获取 特惠推荐 的数据
 * @param data 参数
 * @returns
 */
export const getHotPreference = (data: RecommendData) => {
  return http<Result>({
    url: '/hot/preference',
    method: 'GET',
    data,
  })
}

/**
 * 爆款推荐：获取 特惠推荐 的数据
 * @param data 参数
 * @returns
 */
export const getHotInVogue = (data: RecommendData) => {
  return http<Result>({
    url: '/hot/inVogue',
    method: 'GET',
    data,
  })
}

/**
 * 热门推荐统一处理接口
 * @param url
 * @param data
 * @returns
 */
export const getHotRecommend = (url: string, data: RecommendData) => {
  return http<Result>({
    url,
    method: 'GET',
    data,
  })
}
