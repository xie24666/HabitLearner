<template>
  <AppLayout 
    :title="isEditMode ? '编辑习惯' : '创建习惯'"
    :show-back-button="true"
  >
    <div class="p-4 lg:p-0">
                      <form @submit.prevent="handleSubmit" class="space-y-8 max-w-3xl mx-auto">
        <!-- 习惯基本信息 -->
        <BaseCard title="基本信息">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">习惯名称</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="input-apple"
                placeholder="例如：每日阅读"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">习惯分类</label>
              <div class="relative">
                <select v-model="form.category" @change="handleCategoryChange" class="input-apple pr-12" required>
                  <option value="">请选择分类</option>
                  <option v-for="category in availableCategories" :key="category" :value="category">
                    {{ category }}
                  </option>
                  <option value="add-category">+ 添加分类</option>
                </select>
                <!-- 删除分类按钮 -->
                <button
                  v-if="form.category && isCustomCategory(form.category)"
                  type="button"
                  @click="deleteCategory(form.category)"
                  class="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  :title="`删除分类: ${form.category}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- 图标选择 -->
        <BaseCard title="选择图标">
          <!-- 图标管理按钮 -->
          <div class="flex justify-between items-center mb-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              共 {{ availableIcons.length + customIcons.length }} 个图标
            </div>
            <button
              type="button"
              @click="showIconManagementModal = true"
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              管理图标
            </button>
          </div>
          
          <div class="grid grid-cols-6 gap-3">
            <button
              v-for="icon in availableIcons.filter(icon => icon !== '+')"
              :key="icon"
              type="button"
              @click="handleIconClick(icon)"
              class="w-12 h-12 rounded-apple flex items-center justify-center text-2xl transition-all duration-200"
              :class="[
                form.icon === icon 
                  ? 'bg-primary-500 text-white scale-110' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              ]"
            >
              {{ icon }}
            </button>
            
            <!-- 显示自定义上传的图标 -->
            <button
              v-for="(customIconItem, index) in customIcons"
              :key="`custom-${index}`"
              type="button"
              @click="form.icon = customIconItem"
              class="w-12 h-12 rounded-apple flex items-center justify-center transition-all duration-200 overflow-hidden"
              :class="[
                form.icon === customIconItem 
                  ? 'bg-primary-500 text-white scale-110 border-2 border-primary-500' 
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
              ]"
            >
              <!-- 如果是图片 -->
              <img 
                v-if="customIconItem.startsWith('data:image')" 
                :src="customIconItem" 
                alt="自定义图标" 
                class="w-full h-full object-cover rounded-apple"
              />
              <!-- 如果是文字图标 -->
              <span v-else class="text-2xl">{{ customIconItem }}</span>
            </button>
          </div>
        </BaseCard>

        <!-- 目标设置 -->
        <BaseCard title="目标设置">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">频率</label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="form.frequency = 'daily'"
                  class="p-3 rounded-apple border-2 transition-all duration-200"
                  :class="[
                    form.frequency === 'daily'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  <div class="text-center">
                    <div class="font-medium">每日</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">每天完成</div>
                  </div>
                </button>
                <button
                  type="button"
                  @click="form.frequency = 'weekly'"
                  class="p-3 rounded-apple border-2 transition-all duration-200"
                  :class="[
                    form.frequency === 'weekly'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  ]"
                >
                  <div class="text-center">
                    <div class="font-medium">每周</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">每周完成</div>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                目标次数（{{ form.frequency === 'daily' ? '每天' : '每周' }}）
              </label>
              <div class="flex items-center space-x-3">
                <button
                  type="button"
                  @click="decreaseTarget"
                  class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                  </svg>
                </button>
                <div class="flex-1 text-center">
                  <span class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ form.target }}</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">次</span>
                </div>
                <button
                  type="button"
                  @click="increaseTarget"
                  class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-150"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- 每日打卡留言设置 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                每日打卡留言
              </label>
              <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-apple">
                <div>
                  <div class="font-medium text-gray-900 dark:text-gray-100">启用每日留言</div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">每日首次打卡时弹出留言编辑窗口</div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    v-model="form.enableComments"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- 颜色选择 -->
        <BaseCard title="选择颜色">
          <div class="grid grid-cols-6 gap-3">
            <button
              v-for="color in availableColors"
              :key="color"
              type="button"
              @click="form.color = color"
              class="w-12 h-12 rounded-full border-4 transition-all duration-200"
              :class="[
                form.color === color 
                  ? 'scale-110 border-gray-300' 
                  : 'border-transparent hover:scale-105'
              ]"
              :style="{ backgroundColor: color }"
            >
              <div v-if="form.color === color" class="w-full h-full rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </button>
          </div>
        </BaseCard>

        <!-- 提醒设置 -->
        <BaseCard title="提醒设置">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">开启提醒</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">每天定时提醒你完成习惯</div>
              </div>
              <button
                type="button"
                @click="form.reminderEnabled = !form.reminderEnabled"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200"
                :class="[
                  form.reminderEnabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
                ]"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200"
                  :class="[
                    form.reminderEnabled ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <div v-if="form.reminderEnabled">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">提醒时间</label>
              <input
                v-model="form.reminderTime"
                type="time"
                class="input-apple"
              />
            </div>
          </div>
        </BaseCard>

        <!-- 提交按钮 -->
        <div class="space-y-3">
          <button
            type="submit"
            :disabled="habitStore.isLoading"
            class="btn-primary w-full"
          >
            <span v-if="habitStore.isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditMode ? '更新中...' : '创建中...' }}
            </span>
            <span v-else>{{ isEditMode ? '更新习惯' : '创建习惯' }}</span>
          </button>

          <button
            v-if="isEditMode"
            type="button"
            @click="handleDelete"
            class="btn-secondary w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            删除习惯
          </button>
        </div>
      </form>
    </div>

    <!-- 分类管理弹窗 -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-apple-lg p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">分类管理</h3>
        
        <!-- 添加新分类 -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">添加新分类</label>
          <div class="flex space-x-2">
            <input
              v-model="customCategory"
              type="text"
              placeholder="请输入分类名称"
              class="input-apple flex-1"
              @keyup.enter="addCustomCategory"
            />
            <button
              @click="addCustomCategory"
              :disabled="!customCategory.trim()"
              class="btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              添加
            </button>
          </div>
        </div>
        
        <!-- 自定义分类列表 -->
        <div v-if="customCategories.length > 0" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">自定义分类</label>
          <div class="space-y-2 max-h-32 overflow-y-auto">
            <div
              v-for="category in customCategories"
              :key="category"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span class="text-gray-900 dark:text-gray-100">{{ category }}</span>
              <button
                @click="deleteCategory(category)"
                class="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                :title="`删除分类: ${category}`"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex space-x-3">
          <button
            @click="showCategoryModal = false; customCategory = ''"
            class="btn-secondary flex-1"
          >
            完成
          </button>
        </div>
      </div>
    </div>

    <!-- 图标管理弹窗 -->
    <div v-if="showIconManagementModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-apple-lg p-6 w-full max-w-3xl max-h-[85vh] overflow-hidden">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">图标管理</h3>
        
        <!-- 添加新图标区域 -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-apple">
          <h4 class="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">添加新图标</h4>
          
          <!-- 图片上传 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">上传图片</label>
            <div class="flex items-center space-x-3">
              <input
                ref="iconFileInput"
                type="file"
                accept="image/*"
                @change="handleIconFileChange"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.iconFileInput.click()"
                class="btn-secondary px-4 py-2"
              >
                选择文件
              </button>
              <span v-if="iconFile" class="text-sm text-gray-600 dark:text-gray-400">
                {{ iconFile.name }}
              </span>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">支持JPG、PNG等格式，大小不超过10MB</p>
            
            <!-- 图片预览 -->
            <div v-if="iconPreview" class="mt-3">
              <div class="w-16 h-16 rounded-apple overflow-hidden border border-gray-200 dark:border-gray-600">
                <img :src="iconPreview" alt="预览" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          
          <!-- 文字图标输入 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">或输入文字图标</label>
            <input
              v-model="customIcon"
              type="text"
              placeholder="请输入图标(如: 🎯 💡 等)"
              class="input-apple w-full"
              @keyup.enter="addCustomIcon"
            />
          </div>
          
          <!-- 添加按钮 -->
          <button
            @click="addCustomIcon"
            :disabled="!iconPreview && !customIcon.trim()"
            class="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            添加图标
          </button>
        </div>
        
        <!-- 自定义图标列表 -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">
              自定义图标 ({{ customIcons.length }}个)
            </label>
            <div class="flex space-x-2">
              <button
                v-if="customIcons.length > 0"
                @click="toggleMultiSelectMode"
                class="text-sm px-3 py-1 rounded-lg transition-colors"
                :class="[
                  isMultiSelectMode 
                    ? 'bg-primary-500 text-white' 
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                ]"
              >
                {{ isMultiSelectMode ? '取消多选' : '多选删除' }}
              </button>
              <button
                v-if="customIcons.length > 0 && !isMultiSelectMode"
                @click="clearAllCustomIcons"
                class="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              >
                清空所有
              </button>
            </div>
          </div>
          
          <!-- 多选模式提示 -->
          <div v-if="isMultiSelectMode" class="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p class="text-sm text-blue-700 dark:text-blue-300">
              多选模式：点击图标进行选择，已选择 {{ selectedIcons.length }} 个图标
            </p>
            <div v-if="selectedIcons.length > 0" class="mt-2 flex space-x-2">
              <button
                @click="deleteSelectedIcons"
                class="text-sm bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
              >
                删除选中 ({{ selectedIcons.length }})
              </button>
              <button
                @click="clearSelection"
                class="text-sm bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors"
              >
                取消选择
              </button>
            </div>
          </div>
          
          <div v-if="customIcons.length > 0" class="grid grid-cols-8 gap-3 max-h-64 overflow-y-auto">
            <div
              v-for="(icon, index) in customIcons"
              :key="`manage-${index}`"
              class="relative group"
            >
              <div 
                class="w-12 h-12 rounded-apple flex items-center justify-center overflow-hidden border-2 transition-all duration-200 cursor-pointer"
                :class="[
                  isMultiSelectMode && selectedIcons.includes(icon)
                    ? 'border-primary-500'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                ]"
                @click="isMultiSelectMode ? toggleIconSelection(icon) : selectIcon(icon)"
              >
                <!-- 如果是图片 -->
                <img 
                  v-if="icon.startsWith('data:image')" 
                  :src="icon" 
                  alt="自定义图标" 
                  class="w-full h-full object-cover rounded-apple"
                />
                <!-- 如果是文字图标 -->
                <span v-else class="text-2xl">{{ icon }}</span>
                
                <!-- 多选模式选中标记 -->
                <div 
                  v-if="isMultiSelectMode && selectedIcons.includes(icon)"
                  class="absolute inset-0 bg-primary-500/20 rounded-apple flex items-center justify-center"
                >
                  <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <!-- 删除按钮（始终显示在右上角） -->
              <button
                type="button"
                @click="deleteCustomIcon(index)"
                class="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                :title="`删除图标`"
              >
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <!-- 空状态 -->
          <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg class="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>暂无自定义图标</p>
            <p class="text-sm">使用上方功能添加自定义图标</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex space-x-3">
          <button
            @click="closeIconManagementModal"
            class="btn-secondary flex-1"
          >
            完成
          </button>
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHabitStore } from '@/stores/habit'
import AppLayout from '@/components/AppLayout.vue'
import BaseCard from '@/components/BaseCard.vue'

// Store
const habitStore = useHabitStore()
const router = useRouter()
const route = useRoute()

// 响应式数据
const form = ref({
  name: '',
  icon: '📚',
  category: '',
  frequency: 'daily',
  target: 1,
  color: '#007AFF',
  reminderEnabled: false,
  reminderTime: '09:00',
  enableComments: true
})

// 弹窗状态
const showCategoryModal = ref(false)
const showIconManagementModal = ref(false)
const customCategory = ref('')
const customIcon = ref('')
const iconFile = ref(null)
const iconPreview = ref('')

// 分类管理
const defaultCategories = ['健康', '学习', '工作', '生活', '运动']
const availableCategories = ref([...defaultCategories])
const customCategories = ref([])

// 自定义图标管理
const customIcons = ref([])
const selectedIcons = ref([]) // 存储选中的图标内容，而不是索引
const isMultiSelectMode = ref(false)

// 计算属性
const isEditMode = computed(() => !!route.params.id)

// 可用选项
const availableIcons = [
  '📚', '🏃‍♂️', '🧘‍♀️', '💧', '🍎', '☀️',
  '🌙', '💪', '🎯', '📝', '🎵', '🎨',
  '🚴‍♀️', '🏊‍♂️', '🧠', '❤️', '🔥', '⭐',
  '+'
]

const availableColors = [
  '#007AFF', '#34C759', '#FF9500', '#FF3B30',
  '#AF52DE', '#FF2D92', '#5AC8FA', '#FFCC00'
]

// 方法
const increaseTarget = () => {
  if (form.value.target < 10) {
    form.value.target++
  }
}

const decreaseTarget = () => {
  if (form.value.target > 1) {
    form.value.target--
  }
}

const handleCategoryChange = () => {
  if (form.value.category === 'add-category') {
    showCategoryModal.value = true
    form.value.category = ''
  }
}

const handleIconClick = (icon) => {
  form.value.icon = icon
}

const addCustomCategory = () => {
  if (customCategory.value.trim()) {
    const newCategory = customCategory.value.trim()
    // 检查分类是否已存在
    if (!availableCategories.value.includes(newCategory)) {
      availableCategories.value.push(newCategory)
      customCategories.value.push(newCategory)
      // 保存到localStorage
      saveCustomCategories()
    }
    form.value.category = newCategory
    customCategory.value = ''
    showCategoryModal.value = false
  }
}

// 判断是否为自定义分类
const isCustomCategory = (category) => {
  return customCategories.value.includes(category)
}

// 删除分类
const deleteCategory = (category) => {
  if (confirm(`确定要删除分类"${category}"吗？\n\n注意：删除后，使用此分类的习惯将需要重新选择分类。`)) {
    // 从可用分类列表中移除
    const index = availableCategories.value.indexOf(category)
    if (index > -1) {
      availableCategories.value.splice(index, 1)
    }
    
    // 从自定义分类列表中移除
    const customIndex = customCategories.value.indexOf(category)
    if (customIndex > -1) {
      customCategories.value.splice(customIndex, 1)
    }
    
    // 如果当前选择的分类被删除，清空选择
    if (form.value.category === category) {
      form.value.category = ''
    }
    
    // 保存到localStorage
    saveCustomCategories()
    
    // 显示成功提示
    alert(`分类"${category}"已删除`)
  }
}

// 保存自定义分类到localStorage
const saveCustomCategories = () => {
  localStorage.setItem('customCategories', JSON.stringify(customCategories.value))
}

// 保存自定义图标到localStorage
const saveCustomIcons = () => {
  localStorage.setItem('customIcons', JSON.stringify(customIcons.value))
}

// 删除自定义图标
const deleteCustomIcon = (index) => {
  if (confirm('确定要删除这个自定义图标吗？\n\n注意：删除后，使用此图标的习惯将需要重新选择图标。')) {
    const deletedIcon = customIcons.value[index]
    
    // 从自定义图标列表中移除
    customIcons.value.splice(index, 1)
    
    // 如果当前选择的图标被删除，清空选择或选择默认图标
    if (form.value.icon === deletedIcon) {
      form.value.icon = '📚' // 默认图标
    }
    
    // 保存到localStorage
    saveCustomIcons()
    
    // 显示成功提示
    alert('自定义图标已删除')
  }
}

// 清空所有自定义图标
const clearAllCustomIcons = () => {
  if (confirm('确定要清空所有自定义图标吗？\n\n注意：此操作不可撤销，使用这些图标的习惯将需要重新选择图标。')) {
    // 检查当前选择的图标是否为自定义图标
    if (customIcons.value.includes(form.value.icon)) {
      form.value.icon = '📚' // 默认图标
    }
    
    // 清空自定义图标列表
    customIcons.value = []
    
    // 保存到localStorage
    saveCustomIcons()
    
    // 显示成功提示
    alert('所有自定义图标已清空')
  }
}

// 重置图标表单
const resetIconForm = () => {
  iconFile.value = null
  iconPreview.value = ''
  customIcon.value = ''
}

// 切换多选模式
const toggleMultiSelectMode = () => {
  isMultiSelectMode.value = !isMultiSelectMode.value
  if (!isMultiSelectMode.value) {
    selectedIcons.value = []
  }
}

// 选择图标（非多选模式）
const selectIcon = (icon) => {
  form.value.icon = icon
}

// 切换图标选择状态（多选模式）
const toggleIconSelection = (icon) => {
  if (!isMultiSelectMode.value) return
  
  const selectedIndex = selectedIcons.value.indexOf(icon)
  if (selectedIndex > -1) {
    selectedIcons.value.splice(selectedIndex, 1)
  } else {
    selectedIcons.value.push(icon)
  }
}

// 删除选中的图标
const deleteSelectedIcons = () => {
  if (selectedIcons.value.length === 0) return
  
  const deleteCount = selectedIcons.value.length
  
  if (confirm(`确定要删除选中的 ${deleteCount} 个图标吗？\n\n注意：删除后，使用这些图标的习惯将需要重新选择图标。`)) {
    // 检查当前选择的图标是否在被删除的图标中
    if (selectedIcons.value.includes(form.value.icon)) {
      form.value.icon = '📚' // 默认图标
    }
    
    // 删除选中的图标（通过内容匹配删除）
    selectedIcons.value.forEach(selectedIcon => {
      const index = customIcons.value.indexOf(selectedIcon)
      if (index > -1) {
        customIcons.value.splice(index, 1)
      }
    })
    
    // 清空选择
    selectedIcons.value = []
    
    // 保存到localStorage
    saveCustomIcons()
    
    // 显示成功提示
    alert(`已删除 ${deleteCount} 个图标`)
  }
}

// 清空选择
const clearSelection = () => {
  selectedIcons.value = []
}

// 关闭图标管理弹窗
const closeIconManagementModal = () => {
  showIconManagementModal.value = false
  resetIconForm()
  isMultiSelectMode.value = false
  selectedIcons.value = []
}

const handleIconFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过10MB')
      return
    }
    iconFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      iconPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const addCustomIcon = () => {
  if (iconFile.value && iconPreview.value) {
    // 添加图片图标
    const newIcon = iconPreview.value
    if (!customIcons.value.includes(newIcon)) {
      customIcons.value.push(newIcon)
      saveCustomIcons()
    }
    form.value.icon = newIcon
    resetIconForm()
  } else if (customIcon.value.trim()) {
    // 添加文字图标
    const newIcon = customIcon.value.trim()
    if (!customIcons.value.includes(newIcon)) {
      customIcons.value.push(newIcon)
      saveCustomIcons()
    }
    form.value.icon = newIcon
    resetIconForm()
  }
}

const handleSubmit = async () => {
  if (isEditMode.value) {
    const result = await habitStore.updateHabit(route.params.id, form.value)
    if (result.success) {
      // 编辑成功后跳转到首页
      router.push('/dashboard')
    } else {
      console.error('更新习惯失败:', result.error)
      alert('更新失败: ' + result.error)
    }
  } else {
    const result = await habitStore.createHabit(form.value)
    if (result.success) {
      // 创建成功后跳转到首页
      router.push('/dashboard')
    } else {
      console.error('创建习惯失败:', result.error)
      alert('创建失败: ' + result.error)
    }
  }
}

const handleDelete = async () => {
  if (confirm('确定要删除这个习惯吗？此操作不可撤销。')) {
    const result = await habitStore.deleteHabit(route.params.id)
    if (result.success) {
      // 删除成功后跳转到首页
      router.push('/dashboard')
    } else {
      console.error('删除习惯失败:', result.error)
      alert('删除失败: ' + result.error)
    }
  }
}

// 生命周期
onMounted(() => {
  // 加载保存的自定义分类
  const savedCategories = localStorage.getItem('customCategories')
  if (savedCategories) {
    try {
      const parsedCategories = JSON.parse(savedCategories)
      customCategories.value = parsedCategories
      availableCategories.value = [...defaultCategories, ...parsedCategories]
    } catch (error) {
      console.error('加载自定义分类失败:', error)
    }
  }
  
  // 加载保存的自定义图标
  const savedIcons = localStorage.getItem('customIcons')
  if (savedIcons) {
    try {
      const parsedIcons = JSON.parse(savedIcons)
      customIcons.value = parsedIcons
    } catch (error) {
      console.error('加载自定义图标失败:', error)
    }
  }
  
  if (isEditMode.value) {
    const habit = habitStore.getHabitById(route.params.id)
    if (habit) {
      // 确保所有字段都被正确加载，包括enableComments
      form.value = {
        name: habit.name || '',
        icon: habit.icon || '📚',
        category: habit.category || '',
        frequency: habit.frequency || 'daily',
        target: habit.target || 1,
        color: habit.color || '#007AFF',
        reminderEnabled: habit.reminderEnabled || false,
        reminderTime: habit.reminderTime || '09:00',
        enableComments: habit.enableComments !== undefined ? habit.enableComments : true
      }
    }
  }
})
</script>
