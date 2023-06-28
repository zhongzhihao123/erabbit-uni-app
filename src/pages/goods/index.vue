<script setup lang="ts">
import clause from './components/clause/index.vue'
import helps from './components/helps/index.vue'
import shipment from './components/shipment/index.vue'
import sku from './components/sku/index.vue'
import skeleton from './components/skeleton/index.vue'
import { toRef, ref } from 'vue'
import useAppStore from '@/store'
import { onLoad } from '@dcloudio/uni-app'
import { getGoods, GoodsResult } from '@/apis/goods'
import type {
  GoodsSKU,
  SkuEvent,
} from '@/components/vk-data-goods-sku-popup/types'
import { postMemberCart } from '@/apis/cart'
import { useAddressStore } from '@/store/address'

const appStore = useAppStore()
const safeArea = toRef(appStore, 'safeArea')

// 返回上一页
const goBack = () => {
  uni.navigateBack({})
}

// 跳转到购物车页面
const goCart = () => {
  uni.navigateTo({ url: '/pages/cart/default' })
}

// 弹窗
const popup = ref<{
  open(): void
  close(): void
}>()

type Layer = 'helps' | 'sku' | 'shipment' | 'clause'
const layer = ref<Layer>('helps')

// 显示弹层
const showHalfDialog = (layerName: Layer) => {
  layer.value = layerName
  popup.value!.open()
}
// 关闭弹层
const hideHalfDialog = () => {
  popup.value!.close()
}
// -------------自己写的代码-------------
// 打开页面时得到商品 id, 根据 id 发送请求到服务器得到商品详情
// 定义一个变量：保存商品详情
const detail = ref({} as GoodsResult)
onLoad(async ({ id }) => {
  // 判断 id 是否存在
  if (id) {
    // 发送请求到服务器得到商品详情
    detail.value = await getGoods(id)
    // 生成 SKU 的数据源
    goodsSku.value = {
      _id: detail.value.id,
      name: detail.value.name,
      goods_thumb: detail.value.mainPictures[0],
      sku_list: detail.value.skus.map((item) => {
        return {
          _id: item.id,
          goods_id: detail.value.id,
          goods_name: detail.value.name,
          image: detail.value.mainPictures[0],
          price: 100 * +item.price,
          sku_name_arr: item.specs.map((v) => v.valueName),
          stock: item.inventory,
        }
      }),
      spec_list: detail.value.specs.map((item) => {
        return {
          list: item.values.map((v) => ({ name: v.name })),
          name: item.name,
        }
      }),
    }
  }
})
// 返回按钮的事件
const myBack = () => {
  // 原则：如果有上一个页面，回退到上一个页面
  //       如果没有上个页面，直接跳转到首页
  // 得到当前页面栈中的页面
  const pages = getCurrentPages()
  // 判断
  if (pages.length >= 2) {
    // 有上一个页面
    return uni.navigateBack({})
  }
  // 没有上一个页面：直接跳转到首页
  uni.switchTab({ url: '/pages/index/index' })
}
// 轮播图结构切换时会触发
// 定义一个变量用来保存当前轮播图显示图片的下标
const currentIndex = ref(0)
const onChange = (res: WechatMiniprogram.SwiperChange) => {
  // 保存显示图片的下标
  currentIndex.value = res.detail.current
}
// ---------------SKU 功能----------------
// 控制组件的显示与隐藏
const skuShow = ref(false)
// 定义SKU组件的模式的枚举
enum SkuMode {
  All = 1,
  Add = 2,
  Buy = 3,
}
// 控制组件的模式
const skuMode = ref<SkuMode>(SkuMode.All)
// SKU组件的数据源
const goodsSku = ref({} as GoodsSKU)
// 打开SKU组件
const openGoodsSKU = (bool: SkuMode) => {
  // 设置组件模式
  skuMode.value = bool
  // 打开组件
  skuShow.value = true
}
// 定义 SKU 组件的 ref 属性
const skuRef = ref()
// 定义选中规格的变量
const selectSpec = ref('')
// 关闭 SKU 组件时会触发
const onSkuClose = () => {
  // 获取 sku 组件的实例对象，保存选择规格的值
  selectSpec.value = (skuRef.value.selectArr as string[]).join(' ')
}
// 点击加入购物车按钮时会触发
const onAddCart = async (res: SkuEvent) => {
  // 调用方法加入到购物车
  await postMemberCart({
    skuId: res._id,
    count: res.buy_num,
  })
  // 提示添加成功
  uni.showToast({
    title: '添加成功',
    icon: 'success',
    mask: true,
  })
  // 关闭面板
  skuShow.value = false
  // 获取 sku 组件的实例对象，保存选择规格的值
  selectSpec.value = (skuRef.value.selectArr as string[]).join(' ')
}
// 点击立即购买时会触发
// 获取地址 store 实例
const addressStore = useAddressStore()
const onBuyNow = (res: SkuEvent) => {
  const skuId = res._id
  const count = res.buy_num
  const addressId = addressStore.selectedAddress.id
  // 跳转到创建订单页面
  uni.navigateTo({
    url: `/pages/order/create/index?skuId=${skuId}&count=${count}&addressId=${addressId}`,
  })
}
</script>

<template>
  <!-- 返回按钮结构 -->
  <view class="back" @tap="myBack">
    <uni-icons type="back" size="24" color="#fff" />
  </view>
  <!-- 骨架与页面是互斥 -->
  <skeleton v-if="!detail.id"></skeleton>

  <template v-else>
    <scroll-view
      scroll-y
      enhanced
      :bounces="false"
      :show-scrollbar="false"
      scroll-with-animation
      class="viewport"
      id="scrollView"
    >
      <!-- 商品信息 -->
      <view class="goods anchor" data-anchor-index="0">
        <view class="preview">
          <swiper @change="onChange" circular>
            <swiper-item
              v-for="(item, index) in detail.mainPictures"
              :key="index"
            >
              <image :src="item" />
            </swiper-item>
          </swiper>
          <view class="indicator">
            <text class="current">{{ currentIndex + 1 }}</text>
            <text class="split">/</text>
            <text class="total">{{ detail.mainPictures?.length }}</text>
          </view>
        </view>

        <view class="meta">
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ detail.price?.split('.')[0] }}</text>
            <text class="decimal">.{{ detail.price?.split('.')[1] }}</text>
          </view>
          <view class="brand">
            <image :src="detail.brand?.picture" />
          </view>
          <view class="name ellipsis">
            {{ detail.name }}
          </view>
          <view class="remarks"> {{ detail.desc }} </view>
        </view>
        <view class="related">
          <view @tap="openGoodsSKU(SkuMode.All)" class="item arrow">
            <text class="label">选择</text>
            <text class="text ellipsis">{{ selectSpec || '请选择规格' }}</text>
          </view>
          <view @tap="showHalfDialog('shipment')" class="item arrow">
            <text class="label">送至</text>
            <text class="text ellipsis">北京市顺义区京顺路9号黑马程序员</text>
          </view>
          <view @tap="showHalfDialog('clause')" class="item arrow">
            <text class="label">服务</text>
            <text class="text ellipsis">无忧退 快速退款 免费包邮</text>
          </view>
        </view>
      </view>
      <!-- 商品评价 -->
      <view class="comments panel anchor" data-anchor-index="1">
        <view class="title arrow">
          <text>评价</text>
          <navigator url="/pages/comments/index" hover-class="none" class="more"
            >好评度 70%</navigator
          >
        </view>
        <view class="comment">
          <view class="caption">
            <view class="user">
              <image
                class="avatar"
                src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/avatar_2.jpg"
              />
              <text>白月初</text>
            </view>
            <view class="rating">
              <view class="rank" style="width: 80%"></view>
            </view>
          </view>
          <view class="content">
            <view class="text"> 质量不错，灵敏度高，结构巧妙，款式也好看 </view>
            <view class="pictures">
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_1.jpg"
                />
              </view>
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_2.jpg"
                />
              </view>
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_2.jpg"
                />
              </view>
            </view>
            <view class="extra">
              <text class="date">购买时间: 2020-11-11</text>
              <text class="type">黑色 公开版 128G</text>
            </view>
          </view>
        </view>
        <view class="comment">
          <view class="caption">
            <view class="user">
              <image
                class="avatar"
                src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/avatar_3.jpg"
              />
              <text>白月初</text>
            </view>
            <view class="rating">
              <view class="rank" style="width: 60%"></view>
            </view>
          </view>
          <view class="content">
            <view class="text"> 质量不错，灵敏度高，结构巧妙，款式也好看 </view>
            <view class="pictures">
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_1.jpg"
                />
              </view>
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_2.jpg"
                />
              </view>
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_2.jpg"
                />
              </view>
              <view class="picture">
                <image
                  src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/comment_1.jpg"
                />
              </view>
            </view>
            <view class="extra">
              <text class="date">购买时间: 2020-11-11</text>
              <text class="type">黑色 公开版 128G</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 商品详情 -->
      <view class="detail panel anchor" data-anchor-index="2">
        <view class="title">
          <text>详情</text>
        </view>
        <view class="content">
          <view class="properties">
            <view
              class="item"
              v-for="item in detail.details.properties"
              :key="item.name"
            >
              <text class="label">{{ item.name }}</text>
              <text class="value">{{ item.value }}</text>
            </view>
          </view>

          <image
            v-for="(item, index) in detail.details.pictures"
            :key="index"
            mode="widthFix"
            :src="item"
          ></image>
        </view>
      </view>
      <!-- 常见问题 -->
      <view class="help arrow" @tap="showHalfDialog('helps')">
        <text class="icon-help"></text>
        <navigator hover-class="none">常见问题</navigator>
      </view>
      <!-- 推荐 -->
      <view class="recommend panel anchor" data-anchor-index="3">
        <view class="title">
          <text>推荐</text>
        </view>
        <view class="content">
          <navigator
            v-for="item in detail.similarProducts"
            :key="item.id"
            :url="`/pages/goods/index?id=${item.id}`"
            hover-class="none"
          >
            <image class="image" mode="aspectFit" :src="item.picture"></image>
            <view class="name ellipsis">{{ item.name }}</view>
            <view class="price">
              <text class="symbol">¥</text>
              <text class="number">{{ item.price.split('.')[0] }}</text>
              <text class="decimal">.{{ item.price.split('.')[1] }}</text>
            </view>
          </navigator>
        </view>
      </view>
    </scroll-view>

    <!-- 用户操作 -->
    <view class="toolbar">
      <view class="icons">
        <button class="collect"><text class="icon-heart"></text>收藏</button>
        <button class="contact" open-type="contact">
          <text class="icon-handset"></text>客服
        </button>
        <button class="cart" @tap="goCart">
          <text class="icon-cart"></text>购物车
        </button>
      </view>
      <view class="buttons">
        <view
          @tap="openGoodsSKU(SkuMode.Add)"
          data-button-type="cart"
          class="addcart"
        >
          加入购物车
        </view>
        <view
          @tap="openGoodsSKU(SkuMode.Buy)"
          data-button-type="payment"
          class="payment"
        >
          立即购买
        </view>
      </view>
    </view>

    <uni-popup type="bottom" ref="popup" background-color="#fff">
      <view class="popup-root">
        <text @tap="hideHalfDialog" class="close icon-close"></text>
        <sku button-type="" v-if="layer === 'sku'"></sku>
        <shipment v-if="layer === 'shipment'"></shipment>
        <clause v-if="layer === 'clause'"></clause>
        <helps v-if="layer === 'helps'"></helps>
      </view>
    </uni-popup>

    <!-- SKU 组件 -->
    <vk-data-goods-sku-popup
      ref="skuRef"
      v-model="skuShow"
      :mode="skuMode"
      :localdata="goodsSku"
      @close="onSkuClose"
      @add-cart="onAddCart"
      @buy-now="onBuyNow"
    ></vk-data-goods-sku-popup>
  </template>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 返回结构的样式 */
.back {
  position: absolute;
  left: 50rpx;
  top: 50rpx;
  z-index: 9;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  font-size: 23px;
  color: #191919;
  background-color: rgba(0, 0, 0, 0.5);
}

/* 自定义导航栏 */
.navbar {
  width: 750rpx;
  background-color: #fff;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
}

.navbar .search {
  height: 40px;
  padding: 1px 110px 0 50px;
}

.navbar .search .input {
  height: 62rpx;
  border-radius: 60rpx;
  font-size: 26rpx;
  color: #8b8b8b;
  background-color: #f3f4f4;
  position: relative;
}

.navbar .search .input::before {
  position: absolute;
  left: 24rpx;
  top: 50%;

  color: #b7b7b7;
  font-size: 28rpx;
  transform: translateY(-50%);
}

.navbar .wrap {
  position: relative;
}

.navbar .back {
  position: absolute;
  left: 10px;
  top: 2px;
  z-index: 9;

  display: flex;
  justify-content: center;
  align-items: center;
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  font-size: 23px;
  color: #191919;
  /* color: #fff; */
  /* background-color: rgba(0, 0, 0, 0.4); */
}

.navbar .tabs {
  display: flex;
  justify-content: space-evenly;
  border-bottom: 1rpx solid #eaeaea;
}

.navbar .tabs text {
  display: block;
  padding: 10rpx 10rpx 16rpx;
  font-size: 28rpx;
  position: relative;
}

.navbar .tabs .active {
  color: #27ba9b;
  font-weight: 500;
}

.navbar .tabs .active::after {
  content: '';
  position: absolute;
  left: 18rpx;
  right: 20rpx;
  bottom: 14rpx;
  height: 4rpx;
  background-color: #27ba9b;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;
}

.panel .title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 90rpx;
  line-height: 1;
  padding: 30rpx 60rpx 30rpx 6rpx;
  position: relative;
}

.panel .title text {
  padding-left: 10rpx;
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  border-left: 4rpx solid #27ba9b;
}

.panel .title navigator {
  font-size: 24rpx;
  color: #666;
}

.arrow::after {
  position: absolute;
  top: 50%;
  right: 30rpx;

  content: '\e6c2';
  color: #ccc;
  font-family: 'erabbit' !important;
  font-size: 32rpx;
  transform: translateY(-50%);
}

/* 商品信息 */
.goods {
  background-color: #fff;
}

.goods .preview {
  height: 750rpx;
  position: relative;
}

.goods .preview .indicator {
  height: 40rpx;
  padding: 0 24rpx;
  line-height: 40rpx;
  border-radius: 30rpx;
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  background-color: rgba(0, 0, 0, 0.3);

  position: absolute;
  bottom: 30rpx;
  right: 30rpx;
}

.goods .indicator .current {
  font-size: 26rpx;
}

.goods .indicator .split {
  font-size: 24rpx;
  margin: 0 1rpx 0 2rpx;
}

.goods .indicator .total {
  font-size: 24rpx;
}

.goods .meta {
  position: relative;
  border-bottom: 1rpx solid #eaeaea;
}

.goods .meta .price {
  height: 130rpx;
  padding: 25rpx 30rpx 0;
  color: #fff;
  font-size: 34rpx;
  box-sizing: border-box;
  background-color: #35c8a9;
}

.goods .meta .number {
  font-size: 56rpx;
}

.goods .meta .brand {
  width: 160rpx;
  height: 80rpx;
  overflow: hidden;

  position: absolute;
  top: 26rpx;
  right: 30rpx;
}

.goods .meta .name {
  max-height: 88rpx;
  line-height: 1.4;
  margin: 20rpx;
  font-size: 32rpx;
  color: #333;
}

.goods .meta .remarks {
  line-height: 1;
  padding: 0 20rpx 30rpx;
  font-size: 24rpx;
  color: #cf4444;
}

.goods .related {
  padding-left: 20rpx;
}

.goods .related .item {
  height: 90rpx;
  padding-right: 60rpx;
  border-bottom: 1rpx solid #eaeaea;
  font-size: 26rpx;
  color: #333;
  position: relative;
  display: flex;
  align-items: center;
}

.goods .related .item:last-child {
  border-bottom: 0 none;
}

.goods .related .label {
  width: 60rpx;
  color: #898b94;
  margin: 0 16rpx 0 10rpx;
}

.goods .related .text {
  flex: 1;
  -webkit-line-clamp: 1;
}

/* 商品评论 */
.comments {
  padding-left: 20rpx;
}

.comments .comment {
  padding: 24rpx 40rpx 24rpx 10rpx;
  border-top: 1rpx solid #eaeaea;
}

.comments .caption {
  height: 60rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comments .user {
  font-size: 26rpx;
  color: #333;
  display: flex;
  align-items: center;
}

.comments .caption .avatar {
  width: 60rpx;
  height: 60rpx;
  margin-right: 20rpx;
  border-radius: 50%;
}

.comments .rating {
  width: 144rpx;
  height: 24rpx;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/rating_off.png);
  background-size: contain;
}

.comments .rating .rank {
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/rating_on.png);
  background-size: 144rpx 24rpx;
}

.comments .content .text {
  line-height: 1.4;
  margin-top: 24rpx;
  font-size: 24rpx;
  color: #333;
}

.comments .pictures {
  display: flex;
  flex-wrap: wrap;
  margin: 20rpx 0 0 1rpx;
}

.comments .picture {
  width: 150rpx;
  height: 150rpx;
  margin-right: 27rpx;
}

.comments .picture:last-child {
  margin-right: 0;
}

.comments .content .extra {
  display: flex;
  justify-content: space-between;
  margin: 20rpx 1rpx 0 0;
  font-size: 22rpx;
  color: #666;
}

/* 类似商品 */
.similar {
  margin-top: 20rpx;
}

.similar .bar {
  display: flex;
  align-items: center;
  height: 90rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
}

.similar .bar text {
  flex: 1;
  text-align: center;
  position: relative;
}

.similar .bar .active::after {
  content: '';
  display: block;
  width: 60rpx;
  height: 4rpx;
  background-color: #27ba9b;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;
  bottom: -5rpx;
}

.similar .content {
  padding-top: 20rpx;
  background-color: #f4f4f4;
  white-space: nowrap;
}

.similar .content navigator {
  display: inline-block;
  width: 200rpx;
  height: 270rpx;
  padding: 15rpx 15rpx 0;
  margin-right: 15rpx;
  background-color: #fff;
  border-radius: 6rpx;
}

.similar .content navigator:first-child {
  margin-left: 15rpx;
}

.similar .content image {
  height: 172rpx;
}

.similar .content .name {
  max-height: 64rpx;
  line-height: 1.2;
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #333;
  -webkit-line-clamp: 1;
}

.similar .content .price {
  font-size: 18rpx;
  color: #cf4444;
}

.similar .content .number {
  font-size: 24rpx;
  margin-left: 2rpx;
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;
}

.detail .content {
  margin-left: -20rpx;
}

.detail .properties {
  padding: 0 20rpx;
  margin-bottom: 30rpx;
}

.detail .properties .item {
  display: flex;
  line-height: 2;
  padding: 10rpx;
  font-size: 26rpx;
  color: #333;
  border-bottom: 1rpx dashed #ccc;
}

.detail .properties .label {
  width: 200rpx;
}

.detail .properties .value {
  flex: 1;
}

/* 常见问题 */
.help {
  display: flex;
  align-items: center;
  padding: 20rpx 0 20rpx 20rpx;
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #fff;
  position: relative;
}

.help .icon-help {
  font-size: 34rpx;
  margin-right: 6rpx;
  color: #ffa868;
}

/* 商品推荐 */
.recommend {
  padding-left: 20rpx;
}

.recommend .content {
  padding: 0 20rpx 20rpx;
  margin-left: -20rpx;
  background-color: #f4f4f4;
  overflow: hidden;
}

.recommend .content navigator {
  width: 345rpx;
  padding: 24rpx 20rpx 20rpx;
  margin: 20rpx 20rpx 0 0;
  border-radius: 10rpx;
  background-color: #fff;
  float: left;
}

.recommend navigator:nth-child(even) {
  margin-right: 0;
}

.recommend .content .image {
  height: 260rpx;
}

.recommend .content .name {
  height: 80rpx;
  margin: 10rpx 0;
  font-size: 26rpx;
  color: #262626;
}

.recommend .content .price {
  line-height: 1;
  font-size: 20rpx;
  color: #cf4444;
}

.recommend .content .number {
  font-size: 26rpx;
  margin-left: 2rpx;
}

/* 底部工具栏 */
.toolbar {
  height: 120rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar .buttons {
  display: flex;
}

.toolbar .buttons > view {
  width: 220rpx;
  text-align: center;
  line-height: 72rpx;
  font-size: 26rpx;
  color: #fff;
  border-radius: 72rpx;
}

.toolbar .buttons .addcart {
  background-color: #ffa868;
}

.toolbar .buttons .payment {
  background-color: #27ba9b;
  margin-left: 20rpx;
}

.toolbar .icons {
  padding-right: 10rpx;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex: 1;
}

.toolbar .icons button {
  text-align: center;
  line-height: 1.4;
  padding: 0;
  border-radius: 0;
  font-size: 20rpx;
  color: #333;
  background-color: #fff;
}

.toolbar .icons text {
  display: block;
  font-size: 34rpx;
}
</style>
