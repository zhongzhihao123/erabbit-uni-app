// 定义SKU中的 localdata 类型
/**
 * 商品SKU集合中的 sku_list 类型
 */
export interface SkuItem {
  /**
   * sku id
   */
  _id: string
  /**
   * 商品 id
   */
  goods_id: string
  /**
   * 商品 name
   */
  goods_name: string
  /**
   * 商品图片
   */
  image: string
  /**
   * sku价格（需要 * 100）
   */
  price: number
  /**
   * sku规格的值
   */
  sku_name_arr: string[]
  /**
   * sku 库存
   */
  stock: number
}

/**
 * 点击 SKU 组件后返回的数据对象类型
 */
export interface SkuEvent extends SkuItem {
  /**
   * 购买的数量
   */
  buy_num: number
}

/**
 * 商品规格的类型
 */
export interface SpecItem {
  /**
   * 商品规格值的数组
   */
  list: SpecObj[]
  /**
   * 商品规格键的名称
   */
  name: string
}
/**
 * 规格值的对象
 */
export interface SpecObj {
  name: string
}

/**
 * 商品 SKU 类型
 */
export interface GoodsSKU {
  /**
   * 商品 ID
   */
  _id: string
  /**
   * 商品名称
   */
  name: string
  /**
   * 商品图片
   */
  goods_thumb: string
  /**
   * 商品 SKU集合
   */
  sku_list: SkuItem[]
  /**
   * 商品规格集合
   */
  spec_list: SpecItem[]
}
