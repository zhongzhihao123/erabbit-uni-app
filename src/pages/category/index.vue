<script setup lang="ts">
import carousel from '@/components/carousel/index.vue'
import { getHomeBanner, BannerItem } from '@/apis/home'
import { getCategoryTop, CategoryTopItem } from '@/apis/category'
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 定义广告区域的数据源
const bannerData = ref<BannerItem[]>([])
// 定义一级分类的数据
const categoryList = ref<CategoryTopItem[]>([])
onLoad(async () => {
  // 发送请求得到广告区域的数据源
  bannerData.value = await getHomeBanner(2)
  // 发送请求得到一级分类数据
  categoryList.value = await getCategoryTop()
})
// 定义一个当前选中的一级分类下标
const activeIndex = ref(0)
// 定义修改选中下标的方法
const changeActive = (index: number) => {
  activeIndex.value = index
}
// 定义一个计算属性：二级分类
const subCategory = computed(() => {
  return categoryList.value[activeIndex.value]?.children
})
</script>

<template>
  <view class="viewport">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">女靴</text>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 主分类（一级类目） -->
      <scroll-view
        class="primary"
        enhanced
        scroll-y="true"
        :show-scrollbar="false"
      >
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{ active: index === activeIndex }"
          @tap="changeActive(index)"
        >
          {{ item.name }}
        </view>
      </scroll-view>
      <!-- 次分类（二级类目） -->
      <scroll-view class="secondary" enhanced scroll-y :show-scrollbar="false">
        <!-- 焦点图 -->
        <carousel class="banner" :source="bannerData"></carousel>
        <!-- 区块 -->
        <view v-for="item in subCategory" :key="item.id" class="panel">
          <view class="title">
            {{ item.name }}
            <navigator
              class="more"
              hover-class="none"
              url="/pages/goods/list/index"
              >全部</navigator
            >
          </view>
          <view class="section">
            <navigator
              v-for="subitem in item.goods"
              :key="subitem.id"
              hover-class="none"
              url="/pages/goods/index"
            >
              <image :src="subitem.picture"></image>
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
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 0 30rpx 20rpx;
  background-color: #fff;
}

.search .input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64rpx;
  padding-left: 26rpx;
  color: #8b8b8b;
  font-size: 28rpx;
  border-radius: 32rpx;
  background-color: #f3f4f4;
}

.icon-search::before {
  margin-right: 10rpx;
}

/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}

/* 主分类 */
.primary {
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;
}

.primary .item {
  height: 96rpx;
  text-align: center;
  line-height: 96rpx;
  font-size: 26rpx;
  color: #595c63;
  position: relative;
}

.primary .active::before {
  position: absolute;
  left: 0;
  top: 0;

  content: '';
  width: 8rpx;
  height: 100%;
  background-color: #27ba9b;
}

.primary .item::after {
  position: absolute;
  left: 42rpx;
  bottom: 0;

  content: '';
  width: 96rpx;
  border-top: 1rpx solid #e3e4e7;
}

.primary .active {
  background-color: #fff;
}

.primary .item:last-child::after,
.primary .active::after {
  display: none;
}

/* 次分类 */
.secondary {
  background-color: #fff;
}

.secondary .banner {
  height: 200rpx;
  margin: 30rpx;
  border-radius: 4rpx;
  overflow: hidden;
}

.secondary .panel {
  margin: 0 30rpx 0rpx;
}

.secondary .title {
  height: 60rpx;
  line-height: 60rpx;
  color: #333;
  font-size: 28rpx;
  border-bottom: 1rpx solid #f7f7f8;
}

.secondary .title .more {
  float: right;
  padding-left: 20rpx;
  font-size: 24rpx;
  color: #999;
}

.secondary .more::after {
  font-family: 'erabbit' !important;
  content: '\e6c2';
}

.secondary .section {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx 0;
}

.secondary .section navigator {
  /* flex: 1; */
  width: 150rpx;
  /* text-align: center; */
  margin: 0rpx 30rpx 20rpx 0;
}

.secondary .section navigator:nth-child(3n) {
  margin-right: 0;
}

.secondary navigator image {
  width: 126rpx;
  height: 126rpx;
}

.secondary navigator .name {
  /* display: block; */
  font-size: 26rpx;
  color: #333;
}

.secondary navigator .price {
  font-size: 18rpx;
  color: #cf4444;
}

.secondary navigator .number {
  font-size: 24rpx;
  margin-left: 2rpx;
}
</style>
