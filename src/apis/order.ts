// 管理所有与订单相关的接口
import { http } from '@/utils/http'

/**
 * 获取预会订单（填写订单）：返回数据类型
 */
export interface OrderResult {
  /**
   * 商品集合
   */
  goods: Good[]
  /**
   * 结算信息
   */
  summary: Summary
  /**
   * 用户地址列表
   */
  userAddresses: UserAddress[]
}

/**
 * 商品信息
 */
export interface Good {
  /**
   * 属性文字，例如“颜色:瓷白色 尺寸：8寸”
   */
  attrsText: string
  /**
   * 数量
   */
  count: number
  /**
   * id
   */
  id: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 实付单价
   */
  payPrice: number
  /**
   * 图片
   */
  picture: string
  /**
   * 原单价
   */
  price: number
  /**
   * SKUID
   */
  skuId: string
  /**
   * 实付价格小计
   */
  totalPayPrice: number
  /**
   * 小计总价
   */
  totalPrice: number
}

/**
 * 结算信息
 */
export interface Summary {
  /**
   * 折扣总计
   */
  discountPrice: number
  /**
   * 商品件数
   */
  goodsCount: number
  /**
   * 邮费
   */
  postFee: number
  /**
   * 应付总计
   */
  totalPayPrice: number
  /**
   * 价格总计
   */
  totalPrice: number
}

/**
 * 地址信息
 */
export interface UserAddress {
  /**
   * 详细地址
   */
  address: string
  /**
   * 城市编码
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
   * 完整行政区
   */
  fullLocation: string
  /**
   * id
   */
  id: string
  /**
   * 是否为默认，1为是，0为否
   */
  isDefault: number
  /**
   * 邮编
   */
  postalCode: string
  /**
   * 省份编码
   */
  provinceCode: string
  /**
   * 收货人
   */
  receiver: string
}

/**
 * 获取预会订单（填写订单）
 * @returns
 */
export const getMemberOrderPre = () =>
  http<OrderResult>({ url: '/member/order/pre' })

/**
 * 提交订单：请求参数的类型
 */
export interface PostMemberOrderData {
  /**
   * 所选地址Id
   */
  addressId: string
  /**
   * 买家留言
   */
  buyerMessage: string
  /**
   * 配送时间类型，1为不限，2为工作日，3为双休或假日
   */
  deliveryTimeType: number
  /**
   * 商品集合
   */
  goods: MyGood[]
  /**
   * 支付渠道：支付渠道，1支付宝、2微信--支付方式为在线支付时，传值，为货到付款时，不传值
   */
  payChannel: number
  /**
   * 支付方式，1为在线支付，2为货到付款
   */
  payType: number
}

/**
 * 商品信息
 */
export interface MyGood {
  /**
   * 数量
   */
  count: number
  /**
   * skuId
   */
  skuId: string
}

/**
 * 提交订单：返回数据类型
 */
export interface PostMemberOrderResult {
  /**
   * 订单Id
   */
  id: string
  /**
   * 支付渠道，1支付宝、2微信
   */
  payChannel: string
  /**
   * 支付方式，1为在线支付，2为货到付款
   */
  payType: string
}
/**
 * 提交订单
 * @param data
 * @returns
 */
export const postMemberOrder = (data: PostMemberOrderData) =>
  http<PostMemberOrderResult>({ url: '/member/order', method: 'POST', data })

/**
 * 立即购买：请求参数类型
 */
export interface GetMemberOrderPreNowData {
  skuId: string
  count: number
  addressId: string
}

/**
 * 立即购买
 * @param data
 * @returns
 */
export const getMemberOrderPreNow = (data: GetMemberOrderPreNowData) =>
  http<OrderResult>({ url: '/member/order/pre/now', data })

/**
 * 获取订单详情：返回数据类型
 */
export interface MemberOrderResult {
  /**
   * 预计到货时间
   */
  arrivalEstimatedTime: string
  /**
   * 交易关闭时间
   */
  closeTime: string
  /**
   * 发货时间
   */
  consignTime: string
  /**
   * 倒计时--剩余的秒数 -1 表示已经超时，正数表示倒计时未结束
   */
  countdown: number
  /**
   * 下单时间
   */
  createTime: string
  /**
   * 配送时间类型，1为不限，2为工作日，3为双休或假日
   */
  deliveryTimeType: number
  /**
   * 交易完成时间
   */
  endTime: string
  /**
   * 完成评价时间
   */
  evaluationTime: string
  /**
   * 订单编号
   */
  id: string
  /**
   * 订单状态，1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消
   */
  orderState: OrderState
  /**
   * 支付渠道，1支付宝、2微信
   */
  payChannel: number
  /**
   * 付款截止时间：剩余的秒数，前台转换成分钟：秒数
   */
  payLatestTime: number
  /**
   * 实付金额
   */
  payMoney: string
  /**
   * 付款时间
   */
  payTime: string
  /**
   * 支付方式，1为在线支付，2为货到付款
   */
  payType: number
  /**
   * 邮费
   */
  postFee: string
  /**
   * 收货人地址
   */
  receiverAddress: string
  /**
   * 收货人
   */
  receiverContact: string
  /**
   * 收货人手机
   */
  receiverMobile: string
  /**
   * 商品集合
   */
  skus: Skus[]
  /**
   * 金额合计
   */
  totalMoney: string
  /**
   * 数量合计
   */
  totalNum: string
}

/**
 * 商品状态的枚举
 */
export enum OrderState {
  '待付款' = 1,
  '待发货' = 2,
  '待收货' = 3,
  '待评价' = 4,
  '已完成' = 5,
  '已取消' = 6,
}

/**
 * 商品信息
 */
export interface Skus {
  /**
   * 属性说明
   */
  attrsText: string
  /**
   * 单价
   */
  curPrice: number
  /**
   * sku id
   */
  id: string
  /**
   * 图片地址
   */
  image: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 属性集合
   */
  properties: Property[]
  /**
   * 数量
   */
  quantity: string
  /**
   * 实付金额
   */
  realPay: number
  /**
   * spu id
   */
  spuId: string
  /**
   * 小计
   */
  totalMoney: number
}

/**
 * 属性信息
 */
export interface Property {
  /**
   * 属性名称，如 颜色
   */
  propertyMainName: string
  /**
   * 属性值名称，如 黑色
   */
  propertyValueName: string
}

/**
 * 获取订单详情
 * @param id
 * @returns
 */
export const getMemberOrderById = (id: string) =>
  http<MemberOrderResult>({ url: `/member/order/${id}` })

/**
 * 支付-微信-小程序：返回数据类型
 */
export interface PayWxPayMiniPayResult {
  /**
   * appId
   */
  appId?: string
  /**
   * 随机字符串，长度为32个字符以下
   */
  nonceStr: string
  /**
   * 统一下单接口返回的 prepay_id 参数值
   */
  package: string
  /**
   * 微信支付签名
   */
  paySign: string
  /**
   * 签名算法
   */
  signType: 'MD5' | 'HMAC-SHA256' | 'RSA'
  /**
   * 时间戳，即当前的时间
   */
  timeStamp: string
}

/**
 * 支付 - 微信 - 小程序
 * @param orderId
 * @returns
 */
export const getPayWxPayMiniPay = (orderId: string) =>
  http<PayWxPayMiniPayResult>({ url: '/pay/wxPay/miniPay', data: { orderId } })
