<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  getHotPreference,
  SubType,
  getHotInVogue,
  getHotRecommend,
} from '@/apis/home'

import { onLoad } from '@dcloudio/uni-app'

interface metaType {
  title: string
  coverPath: string
  tabs: string[]
}

const metaMap = reactive<{ [key: string]: metaType }>({
  1: {
    title: '特惠推荐',
    coverPath:
      'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_1.jpg',
    tabs: ['价格', '折扣', '筛选'],
  },
  2: {
    title: '爆款推荐',
    coverPath:
      'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_2.jpg',
    tabs: ['24小时热搜', '热销总榜', '人气周榜'],
  },
  3: {
    title: '一站买全',
    coverPath:
      'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_3.jpg',
    tabs: ['搞定熊孩子', '家里不凌乱', '让音质更出众'],
  },
  5: {
    title: '新鲜好物',
    coverPath:
      'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/recommend_4.jpg',
    tabs: ['抢先尝新', '新品预告'],
  },
})

let type = $ref('1')
let meta = $ref(metaMap[type])

onLoad(({ type }) => {
  if (type) meta = metaMap[type]
})

// 动态更新导航栏标题
uni.setNavigationBarTitle({
  title: meta.title,
})
// --------------自己的代码-----------------
// 定义活动图片
const bannerPicture = ref('')
// tab 项的数据源
const subTypes = ref<SubType[]>([])
// 定义路径字典
const urlMap = [
  { type: '1', url: '/hot/preference' },
  { type: '2', url: '/hot/inVogue' },
  { type: '3', url: '/hot/oneStop' },
  { type: '4', url: '/hot/oneStop' },
  { type: '5', url: '/hot/new' },
]
// 定义一个请求的接口路径
let currentUrl = ''
onLoad(async ({ type }) => {
  // 根据 type 找到对应的对象
  const currentMap = urlMap.find((item) => item.type === type)
  // 判断是否存在
  if (currentMap) {
    // 保存请求的路径
    currentUrl = currentMap.url
    // 发送请求
    const res = await getHotRecommend(currentMap.url, {})
    // 设置页面标题
    uni.setNavigationBarTitle({
      title: res.title,
    })
    // 设置活动图片
    bannerPicture.value = res.bannerPicture
    // 保存 tab 项的数据源
    subTypes.value = res.subTypes
  }
})
// 定义 tab 选项选中下标的变量
const activeIndex = ref(0)
// 定义一个切换 tab 选项的方法
const changeActive = (index: number) => {
  activeIndex.value = index
}
// 定义一个 scrollview 上拉触底的事件
const onScrolltolower = async () => {
  // 得到当前选中的 tab 数据源
  const currentSubType = subTypes.value[activeIndex.value]
  // 判断当前选中的 tab 项的数据源是加载完毕
  if (
    currentSubType.goodsItems.counts === currentSubType.goodsItems.items.length
  )
    return uni.showToast({ title: '数据源加载完毕' })
  // 当前选中的 tab 的数据源中的 page ++
  currentSubType.goodsItems.page++
  // 发送请求到服务器得以当前选中的 tab 下的下一页数据
  const res = await getHotRecommend(currentUrl, {
    subType: currentSubType.id,
    page: currentSubType.goodsItems.page,
    pageSize: currentSubType.goodsItems.pageSize,
  })
  // 得到当前选中 tab 项的下一页数据源
  const data = res.subTypes[activeIndex.value].goodsItems.items
  // 将数据源添加到当前选中 tab 项的数据源
  currentSubType.goodsItems.items.push(...data)
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture"></image>
    </view>
    <!-- tab 选项集合 -->
    <view class="tabs">
      <text
        class="text"
        v-for="(item, index) in subTypes"
        :key="item.id"
        :class="{ active: index === activeIndex }"
        @tap="changeActive(index)"
        >{{ item.title }}</text
      >
    </view>
    <scroll-view
      @scrolltolower="onScrolltolower"
      v-show="index === activeIndex"
      v-for="(item, index) in subTypes"
      :key="item.id"
      scroll-y
      enhanced
      :show-scrollbar="false"
      class="scroll-view"
    >
      <view class="goods">
        <navigator
          v-for="subitem in item.goodsItems.items"
          :key="subitem.id"
          hover-class="none"
          url="/pages/goods/index"
          class="navigator"
        >
          <image class="thumb" :src="subitem.picture"></image>
          <view class="name ellipsis">{{ subitem.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{
              subitem.price.toString().split('.')[0]
            }}</text>
            <text class="decimal"
              >.{{ subitem.price.toString().split('.')[1] }}</text
            >
          </view>
        </navigator>
      </view>
      <view
        class="loading"
        v-if="
          subTypes[activeIndex] &&
          subTypes[activeIndex].goodsItems.items.length <
            subTypes[activeIndex].goodsItems.counts
        "
        >正在加载...</view
      >
      <view class="loading" v-else>~我是有底线的~</view>
    </scroll-view>
  </view>
</template>

<style>
page {
  height: 100%;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;

  position: absolute;
  left: 0;
  top: 0;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
}

.tabs .text {
  margin: 0 20rpx;
  position: relative;
}

.tabs .active::after {
  content: '';
  width: 40rpx;
  height: 4rpx;
  transform: translate(-50%);
  background-color: #27ba9b;
  position: absolute;
  left: 50%;
  bottom: 24rpx;
}

.scroll-view {
  flex: 1;
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
}

.goods .navigator {
  width: 345rpx;
  padding: 20rpx;
  margin-top: 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.goods .thumb {
  width: 305rpx;
  height: 305rpx;
}

.goods .name {
  height: 88rpx;
  font-size: 26rpx;
}

.goods .price {
  line-height: 1;
  color: #cf4444;
  font-size: 30rpx;
}

.goods .symbol,
.goods .decimal {
  font-size: 70%;
}
</style>
