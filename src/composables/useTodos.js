import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'todos-v1'

export function useTodos() {
  // Состояние
  const todos = ref([])
  const filter = ref('all')

  // Инициализация из localStorage
  const loadTodos = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        todos.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Ошибка загрузки задач:', error)
    }
  }

  // Сохранение в localStorage при изменении
  watch(
    todos,
    (newTodos) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
      } catch (error) {
        console.error('Ошибка сохранения задач:', error)
      }
    },
    { deep: true }
  )

  // Методы
  const addTodo = (title) => {
    const trimmed = title.trim()
    if (!trimmed) return

    todos.value.push({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: trimmed,
      completed: false
    })
  }

  const toggleTodo = (id) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  const updateTitle = (id, newTitle) => {
    const trimmed = newTitle.trim()
    if (!trimmed) return

    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.title = trimmed
    }
  }

  const removeTodo = (id) => {
    todos.value = todos.value.filter(t => t.id !== id)
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter(t => !t.completed)
  }

  const setFilter = (newFilter) => {
    filter.value = newFilter
  }

  // Вычисляемые значения
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(t => !t.completed)
      case 'completed':
        return todos.value.filter(t => t.completed)
      default:
        return todos.value
    }
  })

  const remainingCount = computed(() => {
    return todos.value.filter(t => !t.completed).length
  })

  const completedCount = computed(() => {
    return todos.value.filter(t => t.completed).length
  })

  // Загружаем задачи при инициализации
  loadTodos()

  return {
    todos,
    filter,
    filteredTodos,
    remainingCount,
    completedCount,
    addTodo,
    toggleTodo,
    updateTitle,
    removeTodo,
    clearCompleted,
    setFilter
  }
}


