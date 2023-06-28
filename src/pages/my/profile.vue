<script setup lang="ts">
import { toRef } from 'vue'
import useAppStore from '@/store'
import {
  Gender,
  getMemberProfile,
  ProfileResult,
  putMemberProfile,
} from '@/apis/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useMemberStore } from '@/store/member'

const appStore = useAppStore()
const safeArea = toRef(appStore, 'safeArea')

const goBack = () => {
  uni.navigateBack({})
}
// ----------自己的代码-------------
// 得到 pinia 的 store
const memberStore = useMemberStore()
// 定义个人信息的数据
const profileObj = ref({} as ProfileResult)
onLoad(async () => {
  // 获取个人信息
  profileObj.value = await getMemberProfile()
  // 将数据保存到 pinia 中
  memberStore.profile.avatar = profileObj.value.avatar
  memberStore.profile.nickname = profileObj.value.nickname
})
// 点击头像会触发
const chooseImage = () => {
  // 1. 选择一张图片
  uni.chooseImage({
    count: 6,
    success: (success) => {
      // 得到上传的图片
      const filePath = success.tempFilePaths[0]
      // 2. 将选中的图片提交到服务器
      uni.uploadFile({
        url: '/member/profile/avatar',
        filePath: filePath,
        name: 'file',
        success: (res) => {
          // 将显示的头像进行修改
          profileObj.value.avatar = filePath
          // 将头像地址保存到 pinia 中
          memberStore.profile.avatar = filePath
          // 提示修改成功
          uni.showToast({ title: '修改头像成功' })
        },
      })
    },
  })
}
// 切换性别的单选框会触发
const genderChange = (res: WechatMiniprogram.RadioGroupChange) => {
  // 将修改后的值赋值给原来的对象：profileObj
  profileObj.value.gender = res.detail.value as Gender
}
// 切换出生日期时会触发
const birthdayChange = (res: WechatMiniprogram.PickerChange) => {
  // 将修改后的值赋值给原来的对象：profileObj
  profileObj.value.birthday = res.detail.value as string
}
// 切换城市时会触发
// 定义一个变量：用来保存 code
let fullLocationCode: string[] = []
const fullLocationChange = (res: WechatMiniprogram.PickerChange) => {
  // 保存文本
  profileObj.value.fullLocation = (res.detail.value as string[]).join('')
  // 保存 code
  fullLocationCode = res.detail.code // ['省编码', '市编码', '区编码']
}
// 修改个人信息
const submitForm = async () => {
  // 从对象中解构需要的数据
  const { nickname, gender, birthday, profession } = profileObj.value
  // 解构地址的编码
  const [provinceCode, cityCode, countyCode] = fullLocationCode
  await putMemberProfile({
    nickname,
    gender,
    birthday,
    profession,
    provinceCode,
    cityCode,
    countyCode,
  })
  // 提示成功
  uni.showToast({ title: '修改信息成功' })
  // 更新 pinia 中的昵称
  memberStore.profile.nickname = nickname
  // 跳转回上一个页面（我的）
  uni.switchTab({ url: '/pages/my/index' })
}
</script>

<template>
  <view class="viewport">
    <view class="navbar" :style="{ paddingTop: safeArea?.top + 'px' }">
      <view class="back icon-left" @tap="goBack"></view>
      <view class="title">个人信息</view>
    </view>
    <scroll-view scroll-y>
      <!-- 头像 -->
      <view class="avatar">
        <image @tap="chooseImage" :src="profileObj.avatar" mode="aspectFill" />
        <text>点击修改头像</text>
      </view>
      <!-- 用户信息 -->
      <view class="form">
        <view class="form-item">
          <text class="label">账号</text>
          <text>{{ profileObj.account }}</text>
          <!-- <input :value="profileObj.account" /> -->
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input v-model="profileObj.nickname" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          {{ profileObj.gender }}
          <radio-group @change="genderChange">
            <label class="radio">
              <radio
                value="男"
                color="#27ba9b"
                :checked="profileObj.gender === '男'"
              />
              男
            </label>
            <label class="radio">
              <radio
                value="女"
                color="#27ba9b"
                :checked="profileObj.gender === '女'"
              />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">出生日期</text>
          <picker
            :value="profileObj.birthday"
            @change="birthdayChange"
            mode="date"
            start="1900-01-01"
            end="2023-10-01"
          >
            <view>{{ profileObj.birthday || '请选择出生日期' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker @change="fullLocationChange" mode="region">
            <view>{{ profileObj.fullLocation || '请选择城市' }}</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">职业</text>
          <input v-model="profileObj.profession" placeholder="请输入职业" />
        </view>
      </view>
      <!-- 提交按钮 -->
      <view @tap="submitForm" class="button">保 存</view>
    </scroll-view>
  </view>
</template>

<style>
page {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/order_bg.png);
  background-size: auto 392rpx;
  background-repeat: no-repeat;
}

.navbar .title {
  height: 40px;
  line-height: 32px;
  text-align: center;
  font-size: 17px;
  font-weight: 500;
  color: #fff;
}

.navbar .back {
  position: absolute;
  left: 20rpx;
  top: 22px;
  font-size: 23px;
  z-index: 9;
  color: #fff;
}

.avatar {
  text-align: center;
  padding: 20rpx 0 40rpx;
}

.avatar image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
}

.avatar text {
  display: block;
  padding-top: 20rpx;
  line-height: 1;
  font-size: 26rpx;
  color: #fff;
}

.form {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;
}

.form .form-item {
  display: flex;
  height: 96rpx;
  line-height: 46rpx;
  padding: 25rpx 10rpx;
  background-color: #fff;
  font-size: 28rpx;
  border-bottom: 1rpx solid #ddd;
}

.form .form-item:last-child {
  border: none;
}

.form .form-item .label {
  width: 180rpx;
  color: #333;
}

.form .form-item input {
  flex: 1;
  display: block;
  height: 46rpx;
}

.form .form-item .radio {
  display: inline-block;
  height: 46rpx;
  margin-right: 20rpx;
  vertical-align: middle;
}

.form .form-item radio {
  transform: scale(0.7) translateY(-2px);
}

.form .form-item picker {
  flex: 1;
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
