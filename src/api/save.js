// 模拟 API 层
const STORAGE_KEY = 'hoes_save_data'

export default {
  // 保存游戏
  saveGame(data) {
    return new Promise((resolve) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      setTimeout(() => resolve({ success: true }), 500) // 模拟网络延迟
    })
  },

  // 读取游戏
  loadGame() {
    return new Promise((resolve, reject) => {
      const data = localStorage.getItem(STORAGE_KEY)
      setTimeout(() => {
        if (data) {
          resolve(JSON.parse(data))
        } else {
          resolve(null)
        }
      }, 500)
    })
  }
}
