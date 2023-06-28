<script setup lang="ts">
import { postLoginWxMin, postLoginWxMinSimple } from '@/apis/login'
import { onLoad } from '@dcloudio/uni-app'
import { useMemberStore } from '@/store/member'

const getPhoneNumber = () => {}
// 提示消息
const nextVersion = () => {
  uni.showToast({ title: '等下一个版本哦', icon: 'none' })
}
// 打开页面时，直接获取 code
// 定义一个变量保存 code
let code = ''
onLoad(() => {
  wx.login({
    success: (res) => {
      code = res.code
    },
  })
})

// 获取手机号授权方法
const onGetphonenumber = async (res: any) => {
  // 发送请求到服务器
  const loginRes = await postLoginWxMin({
    code,
    encryptedData: res.detail.encryptedData,
    iv: res.detail.iv,
  })
  console.log(loginRes)
}

// 小程序登录 - 内测版
// 得到 member 对应的 store 实例
const memberStore = useMemberStore()
const myLogin = async () => {
  // 发送请求到服务器，完成登录
  const res = await postLoginWxMinSimple('13302341265')
  // 提示登录成功
  uni.showToast({ title: '登录成功', icon: 'success' })
  // 保存用户信息到 pinia 中
  memberStore.setProfile(res)
  setTimeout(() => {
    // 跳转到上一个页面
    uni.navigateBack({})
  }, 1000)
}
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image
        src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png"
      ></image>
    </view>
    <view class="login">
      <button
        open-type="getPhoneNumber"
        @getphonenumber="onGetphonenumber"
        class="button phone"
      >
        <text class="icon icon-phone"></text>
        手机号快捷登录
      </button>
      <button @tap="myLogin" class="button phone">
        <text class="icon icon-phone"></text>
        小程序登录 - 内测版
      </button>
      <view class="extra">
        <view class="caption">
          <text>其它登录方式</text>
        </view>
        <view class="options">
          <button>
            <text class="icon icon-weixin">微信</text>
          </button>
          <button @getphonenumber="getPhoneNumber" open-type="getPhoneNumber">
            <text class="icon icon-phone">手机</text>
          </button>
          <button @tap="nextVersion">
            <text class="icon icon-mail">邮箱</text>
          </button>
        </view>
      </view>
      <view class="tips"
        >登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》</view
      >
    </view>
  </view>
</template>

<style>
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
}

.logo image {
  width: 220rpx;
  height: 220rpx;
  margin-top: 100rpx;
}

.login {
  display: flex;
  flex-direction: column;
  height: 600rpx;
  padding: 40rpx 20rpx 20rpx;
}

.login .button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80rpx;
  font-size: 28rpx;
  border-radius: 72rpx;
  color: #fff;
}

.login .button .icon {
  font-size: 40rpx;
  margin-right: 6rpx;
}

.login .phone {
  background-color: #28bb9c;
}

.login .wechat {
  background-color: #06c05f;
}

.login .extra {
  flex: 1;
  padding: 70rpx 70rpx 0;
}

.login .extra .caption {
  width: 440rpx;
  line-height: 1;
  border-top: 1rpx solid #ddd;
  font-size: 26rpx;
  color: #999;
  position: relative;
}

.login .caption text {
  transform: translate(-40%);
  background-color: #fff;
  position: absolute;
  top: -12rpx;
  left: 50%;
}

.login .extra .options {
  display: flex;
  justify-content: center;
  margin-top: 70rpx;
}

.login .options button {
  line-height: 1;
  padding: 0;
  margin: 0 40rpx;
  background-color: transparent;
}

.login .extra .icon {
  text-align: center;
  font-size: 28rpx;
  color: #444;
}

.login .extra .icon::before {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 80rpx;
  margin-bottom: 6rpx;
  font-size: 40rpx;
  border: 1rpx solid #444;
  border-radius: 50%;
}

.login .extra .icon-weixin::before {
  border-color: #06c05f;
  color: #06c05f;
}

.login .tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
