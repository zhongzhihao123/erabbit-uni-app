// 存储所有会员相关的信息
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { LoginWxMinResult } from '@/apis/login'

export const useMemberStore = defineStore(
  'member',
  () => {
    // 用户信息
    const profile = ref({} as LoginWxMinResult)

    // 设置用户信息的方法
    const setProfile = (useInfo: LoginWxMinResult) => {
      profile.value = useInfo
      console.log(profile.value)
    }

    // 计算属性：判断用户是否登录
    const isLogin = computed(() => Boolean(profile.value.token))

    return { profile, setProfile, isLogin }
  },
  {
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, val) {
          uni.setStorageSync(key, val)
        },
      },
    },
  }
)
