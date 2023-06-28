<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import {
  PostMemberAddressData,
  postMemberAddress,
  getMemberAddressById,
  putMemberAddressById,
} from '@/apis/address'
import { ref } from 'vue'

// 定义参数对象（提交到服务器中）
const form = ref({ isDefault: 0 } as PostMemberAddressData)

// 定义一个变量保存 id
const addressId = ref('')
onLoad(async ({ id }) => {
  // id：1）不存在：说明是新增 2）存在：说明是修改
  uni.setNavigationBarTitle({
    title: id ? '修改地址' : '新建地址',
  })
  if (id) {
    // 保存 id
    addressId.value = id
    // 发送请求到服务器得到地址的详情
    const res = await getMemberAddressById(id)
    // 将接口返回的信息合并到 form 中
    Object.assign(form.value, res)
    // 将收货地址保存起来
    fullLocationWord.value = res.fullLocation
    console.log(form.value)
  }
})
// 地址改变时会触发
// 定义一个显示在页面上的地址变量
const fullLocationWord = ref('')
const fullLocationChange = (res: WechatMiniprogram.PickerChange) => {
  // res.detail.code：选择地址的编码 ['省编码', '市编码', '区编码']
  // res.detail.value：选择地址的名称 ['省名称', '市名称', '区名称']
  // 得到地址的编码
  const [provinceCode, cityCode, countyCode] = res.detail.code
  // 保存地址编码到 form 实例中
  form.value.provinceCode = provinceCode
  form.value.cityCode = cityCode
  form.value.countyCode = countyCode
  // 保存地址名称
  fullLocationWord.value = (res.detail.value as string[]).join('')
}
// 修改是否为默认地址时会触发
const isDefaultChange = (res: WechatMiniprogram.SwitchChange | Event) => {
  // 根据得到值给 isDefault 赋值
  form.value.isDefault = (res as WechatMiniprogram.SwitchChange).detail.value
    ? 0
    : 1
}
// 点击提交数据到服务器
const submitForm = async () => {
  if (addressId.value) {
    // 提交修改的数据到服务器
    await putMemberAddressById(addressId.value, form.value)
  } else {
    // 提交新增的数据到服务器
    await postMemberAddress(form.value)
  }
  // 提示成功
  uni.showToast({ title: addressId.value ? '修改成功' : '新增成功' })
  // 回到上一个页面
  uni.navigateBack({})
}
</script>

<template>
  <view class="viewport">
    <!-- 地址信息 -->
    <view class="form">
      <view class="form-item">
        <text class="label">姓名</text>
        <input
          v-model="form.receiver"
          placeholder-style="color: #888"
          placeholder="请填写收货人姓名"
        />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input
          v-model="form.contact"
          placeholder-style="color: #888"
          placeholder="请填写收货人手机号码"
        />
      </view>
      <view class="form-item">
        <text class="label">省/市/县 (区)</text>
        <picker @change="fullLocationChange" mode="region">
          <view v-if="fullLocationWord" class="region">
            {{ fullLocationWord }}
          </view>
          <view v-else class="placeholder">请填写收货人所在城市</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <input
          v-model="form.address"
          placeholder-style="color: #888"
          placeholder="街道、楼牌号信息"
        />
      </view>
      <view class="form-item">
        <text class="label">设置默认地址</text>
        <switch
          @change="isDefaultChange"
          :checked="!form.isDefault"
          color="#27ba9b"
        />
      </view>
    </view>
    <!-- 提交按钮 -->
    <view @tap="submitForm" class="button">{{
      addressId ? '保 存' : '新  增'
    }}</view>
  </view>
</template>

<style>
page {
  background-color: #f4f4f4;
}

.form {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.form .form-item {
  display: flex;
  min-height: 96rpx;
  line-height: 46rpx;
  padding: 25rpx 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  border-bottom: 1rpx solid #ddd;
  position: relative;
}

.form .form-item:last-child {
  border: none;
}

.form .form-item .label {
  width: 200rpx;
  color: #333;
}

.form .form-item input {
  flex: 1;
  display: block;
  height: 46rpx;
}

.form .form-item switch {
  position: absolute;
  right: -10rpx;
  transform: scale(0.7) translateY(-8px);
}

.form .form-item picker {
  flex: 1;
}

.form .form-item .region {
  color: #333;
}

.form .form-item .placeholder {
  color: #888;
}

.button {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
