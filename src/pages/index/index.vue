<script setup lang="ts">
import { toRef, ref } from 'vue'
import useAppStore from '@/store/index'
import {
  getHomeBanner,
  BannerItem,
  getHomeCategoryMutli,
  CategoryItem,
  getHomeHotMutli,
  HotMutliItem,
  getHomeNew,
  NewItem,
  getHomeGoodsGuessLike,
  GuessItem,
} from '@/apis/home'

import carousel from '@/components/carousel/index.vue'
import guess from '@/components/guess/index.vue'
import entries from './components/entries/index.vue'

// pinia
const appStore = useAppStore()
const safeArea = toRef(appStore, 'safeArea')

// 初始数据
let hasMore = $ref(true)

// 跳转到搜索页面
const goSearch = () => {
  uni.navigateTo({ url: '/pages/search/index' })
}

// 扫描二维码
const scanCode = () => {
  uni.scanCode({ scanType: ['qrCode'] })
}

// 消息提示
const nextVersion = () => {
  uni.showToast({ title: '等待下一个版本哦~', icon: 'none' })
}

// --------------自己写的代码----------------
// 定义一个加载数据的方法
// 定义广告区域的数据源
const bannerList = ref<BannerItem[]>([])
// 定义前台分类的数据源
const categoryList = ref<CategoryItem[]>([])
// 定义热门推荐的数据源
const hotList = ref<HotMutliItem[]>([])
// 定义新鲜好物的数据源
const newList = ref<NewItem[]>([])
// 定义猜你喜欢的数据源
const guessList = ref<GuessItem[]>([])
const loadData = async () => {
  // // 获取广告区域的数据
  // bannerList.value = await getHomeBanner()
  // // 获取前台分类的数据
  // categoryList.value = await getHomeCategoryMutli()
  // // 获取热门推荐的数据
  // hotList.value = await getHomeHotMutli()
  // // 获取新鲜好物的数据
  // newList.value = await getHomeNew()
  // 优化网络请求
  const res = await Promise.all([
    getHomeBanner(),
    getHomeCategoryMutli(),
    getHomeHotMutli(),
    getHomeNew(),
  ])
  bannerList.value = res[0]
  categoryList.value = res[1]
  hotList.value = res[2]
  newList.value = res[3]
  // 获取猜你喜欢的数据
  getGuessList()
}
loadData()

// 定义一个跳转到推荐列表页面的方法
const toRecommend = (type: number) => {
  if (type === 4) return nextVersion()
  uni.navigateTo({ url: `/pages/recommend/index?type=${type}` })
}
// 定义一个获取猜你喜欢数据源的方法
// 定义当前页
let page = 1
// 定义页容量
let pageSize = 10
// 定义商品的总条数
const counts = ref(0)
const getGuessList = async () => {
  // 获取猜你喜欢的数据
  const res = await getHomeGoodsGuessLike({ page, pageSize })
  guessList.value.push(...res.items)
  // 保存商品的总数据
  counts.value = res.counts
}
// 定义一个上拉触底的事件
const myScrolltolower = () => {
  // 判断数据源是否加载完毕
  if (guessList.value.length >= 40)
    return uni.showToast({ title: '数据源已经加载完毕' })
  // 将页码++
  page++
  // 继续请求猜你喜欢数据
  getGuessList()
}
// 定义一个下拉刷新的事件
// 设置下拉的状态
const triggered = ref(false)
const myRefresherrefresh = async () => {
  // 开启下拉状态
  triggered.value = true
  // 将页面上所有的数据源全部清空
  bannerList.value.length = 0
  categoryList.value.length = 0
  hotList.value.length = 0
  newList.value.length = 0
  guessList.value.length = 0
  // 重置页码
  page = 1
  // 再次重新请求页面数据
  await loadData()
  // 关闭下拉状态
  triggered.value = false
}
</script>

<template>
  <!-- 导航条 -->
  <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
    <!-- 文字logo -->
    <view class="logo">
      <image
        src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo.png"
      ></image>
      <text>新鲜 · 亲民 · 快捷</text>
    </view>
    <!-- 搜索条 -->
    <view class="search" @tap="goSearch">
      <text class="icon-search">搜索商品</text>
      <text class="icon-scan" @tap="scanCode"></text>
    </view>
  </view>

  <scroll-view
    class="viewport"
    scroll-y
    enable-back-to-top
    enhanced
    refresher-background="#f7f7f8"
    :show-scrollbar="false"
    @scrolltolower="myScrolltolower"
    refresher-enabled
    @refresherrefresh="myRefresherrefresh"
    :refresher-triggered="triggered"
  >
    <!-- 广告区域 -->
    <carousel style="height: 280rpx" :source="bannerList"></carousel>
    <!-- 前台分类 -->
    <entries :source="categoryList"></entries>
    <!-- 推荐专区 -->
    <view class="panel recommend">
      <view
        class="item"
        v-for="item in hotList"
        :key="item.id"
        @tap="toRecommend(item.type)"
      >
        <view class="title">{{ item.title }}<text>精选全攻略</text></view>
        <navigator hover-class="none" class="cards">
          <image mode="aspectFit" :src="item.pictures[0]"></image>
          <image mode="aspectFit" :src="item.pictures[1]"></image>
        </navigator>
      </view>
    </view>
    <!-- 新鲜好物 -->
    <view class="panel fresh">
      <view class="title">
        新鲜好物
        <navigator
          hover-class="none"
          class="more"
          url="/pages/recommend/index?type=5"
          >更多</navigator
        >
      </view>
      <view class="cards">
        <navigator
          v-for="item in newList"
          :key="item.id"
          hover-class="none"
          :url="`/pages/goods/index?id=${item.id}`"
        >
          <image mode="aspectFit" :src="item.picture"></image>
          <view class="name">{{ item.name }}</view>
          <view class="price">
            <text class="small">¥</text>{{ item.price }}
          </view>
        </navigator>
      </view>
    </view>
    <!-- 热门品牌 -->
    <view class="panel brands">
      <view class="title">
        热门品牌
        <navigator hover-class="none" class="more" url="/pages/list/index"
          >更多</navigator
        >
      </view>
      <view class="cards">
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/brand_logo_1.jpg"
          ></image>
          <view class="name">小米</view>
          <view class="price">99元起</view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/brand_logo_2.jpg"
          ></image>
          <view class="name">TCL</view>
          <view class="price">199起</view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/brand_logo_3.jpg"
          ></image>
          <view class="name">饭小宝</view>
          <view class="price">9.9起</view>
        </navigator>
        <navigator hover-class="none" url="/pages/goods/index">
          <image
            mode="aspectFit"
            src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/brand_logo_4.jpg"
          ></image>
          <view class="name">鳄鱼</view>
          <view class="price">299起</view>
        </navigator>
      </view>
    </view>
    <!-- 专题 -->
    <view class="panel topic">
      <view class="title">
        专题
        <navigator hover-class="none" class="more" url="">更多</navigator>
      </view>
      <view class="cards">
        <navigator hover-class="none" url="">
          <image
            src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/topic_1.jpg"
          ></image>
          <view class="name">忙里忙外，回家吃饭忙里忙外，回家吃饭</view>
          <view class="price"> <text>19.9元</text>起 </view>
          <view class="extra">
            <text space="ensp" class="icon-heart">1220</text>
            <text space="ensp" class="icon-preview">1000</text>
          </view>
        </navigator>
        <navigator hover-class="none" url="">
          <image
            src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/topic_2.jpg"
          ></image>
          <view class="name">忙里忙外，回家吃饭</view>
          <view class="price"> <text>19.9元</text>起 </view>
          <view class="extra">
            <text space="ensp" class="icon-heart">1220</text>
            <text space="ensp" class="icon-preview">1000</text>
          </view>
        </navigator>
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <guess :source="guessList"></guess>
    <view class="loading" v-if="guessList.length < 40">正在加载...</view>
    <view class="loading" v-else>~我是有底线的~</view>
  </scroll-view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* 自定义导航条 */
.navbar {
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/navigator_bg.png);
  background-size: cover;
  position: relative;
}

.navbar .logo {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding-left: 30rpx;
}

.navbar .logo image {
  width: 166rpx;
  height: 39rpx;
}

.navbar .logo text {
  flex: 1;
  line-height: 28rpx;
  color: #fff;
  margin: 2rpx 0 0 20rpx;
  padding-left: 20rpx;
  border-left: 1rpx solid #fff;
  font-size: 26rpx;
}

.navbar .search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10rpx 0 26rpx;
  height: 64rpx;
  margin: 16rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  border-radius: 32rpx;
  background-color: rgba(255, 255, 255, 0.5);
}

.navbar .icon-search::before {
  margin-right: 10rpx;
}

.navbar .icon-scan {
  font-size: 30rpx;
  padding: 15rpx;
}

.viewport {
  background-color: #f7f7f8;
}

/* 焦点图 */
.banner {
  height: 280rpx;
  margin: 20rpx 20rpx 0;
}

/* 公共面板 */
.panel {
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;
}

.panel .title {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx 0;
  font-size: 32rpx;
  color: #262626;
  position: relative;
}

.panel .title text {
  font-size: 24rpx;
  color: #7f7f7f;
  margin-left: 18rpx;
}

.panel .more {
  position: absolute;
  right: 24rpx;
  font-size: 26rpx;
  color: #7f7f7f;
}

.panel .cards {
  display: flex;
}

.panel .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 推荐专区 */
.recommend {
  display: flex;
  flex-wrap: wrap;
  min-height: 508rpx;
}

.recommend .item {
  display: flex;
  flex-direction: column;

  width: 50%;
  height: 254rpx;
}

.recommend .item {
  border-right: 1rpx solid #eee;
  border-top: 1rpx solid #eee;
}

.recommend .item:nth-child(2n) {
  border-right: 0 none;
}

.recommend .item:nth-child(-n + 2) {
  border-top: 0 none;
}

.recommend .cards {
  flex: 1;
  padding: 15rpx 20rpx;
}

.recommend .cards navigator {
  width: 50%;
}

/* 新鲜好物 & 热门品牌 */
.fresh {
  min-height: 320rpx;
}

.fresh .cards navigator,
.brands .cards navigator {
  width: 25%;
  padding: 15rpx 20rpx 20rpx;
  line-height: 1;
  text-align: center;
}

.fresh image,
.brands image {
  width: 126rpx;
  height: 126rpx;
}

.fresh .name,
.brands .name {
  margin: 20rpx 0 16rpx;
  font-size: 24rpx;
  color: #262626;
}

.fresh .price {
  line-height: 1;
  text-align: left;
  font-size: 26rpx;
  color: #cf4444;
}

.fresh .small {
  font-size: 80%;
}

.brands .price {
  font-size: 24rpx;
  color: #999;
}

/* 专题 */
.topic .cards {
  justify-content: space-between;
  padding: 15rpx 20rpx 20rpx;
}

.topic .cards navigator {
  width: 325rpx;
  line-height: 1;
  flex: 0;
}

.topic image {
  width: 325rpx;
  height: 164rpx;
  border-radius: 4rpx;
}

.topic navigator > view {
  margin-top: 16rpx;
}

.topic .name {
  font-size: 26rpx;
  color: #262626;
}

.topic .price {
  font-size: 24rpx;
  color: #999;
}

.topic .price text {
  color: #cf4444;
}

.topic .extra {
  font-size: 22rpx;
  color: #666;
}

.topic .extra text {
  margin-right: 20rpx;
}

.topic .extra text::before {
  margin-right: 4rpx;
}

.topic .extra .icon-preview:before {
  font-size: 25rpx;
}
</style>
