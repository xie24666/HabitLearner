import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 状态
  const isDarkMode = ref(localStorage.getItem('darkMode') === 'true' || false)

  // 计算属性
  const theme = computed(() => isDarkMode.value ? 'dark' : 'light')

  // 动作
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    updateDocumentClass()
  }

  const setTheme = (theme) => {
    isDarkMode.value = theme === 'dark'
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    updateDocumentClass()
  }

  const updateDocumentClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 初始化时设置主题
  const initTheme = () => {
    updateDocumentClass()
  }

  return {
    // 状态
    isDarkMode,
    // 计算属性
    theme,
    // 动作
    toggleTheme,
    setTheme,
    initTheme
  }
})
