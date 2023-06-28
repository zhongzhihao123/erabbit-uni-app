// 管理选中的收货地址
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MemberAddressItem } from '@/apis/address'

export const useAddressStore = defineStore(
  'address',
  () => {
    // 定义选中的收货地址的变量
    const selectedAddress = ref({} as MemberAddressItem)
    // 定义保存选中收货地址的方法
    const changeSelectedAddress = (addresInfo: MemberAddressItem) => {
      selectedAddress.value = addresInfo
    }
    return { selectedAddress, changeSelectedAddress }
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
