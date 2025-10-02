import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTodos } from '../src/composables/useTodos.js'

describe('useTodos', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('должен инициализироваться с пустым массивом задач', () => {
    const { todos } = useTodos()
    expect(todos.value).toEqual([])
  })

  it('должен добавлять новую задачу', () => {
    const { todos, addTodo } = useTodos()
    
    addTodo('Купить молоко')
    
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0].title).toBe('Купить молоко')
    expect(todos.value[0].completed).toBe(false)
    expect(todos.value[0].id).toBeDefined()
  })

  it('не должен добавлять пустую задачу', () => {
    const { todos, addTodo } = useTodos()
    
    addTodo('   ')
    
    expect(todos.value).toHaveLength(0)
  })

  it('должен обрезать пробелы при добавлении', () => {
    const { todos, addTodo } = useTodos()
    
    addTodo('  Задача с пробелами  ')
    
    expect(todos.value[0].title).toBe('Задача с пробелами')
  })

  it('должен переключать статус задачи', () => {
    const { todos, addTodo, toggleTodo } = useTodos()
    
    addTodo('Тестовая задача')
    const todoId = todos.value[0].id
    
    expect(todos.value[0].completed).toBe(false)
    
    toggleTodo(todoId)
    expect(todos.value[0].completed).toBe(true)
    
    toggleTodo(todoId)
    expect(todos.value[0].completed).toBe(false)
  })

  it('должен обновлять название задачи', () => {
    const { todos, addTodo, updateTitle } = useTodos()
    
    addTodo('Старое название')
    const todoId = todos.value[0].id
    
    updateTitle(todoId, 'Новое название')
    
    expect(todos.value[0].title).toBe('Новое название')
  })

  it('не должен обновлять задачу пустым названием', () => {
    const { todos, addTodo, updateTitle } = useTodos()
    
    addTodo('Исходное название')
    const todoId = todos.value[0].id
    
    updateTitle(todoId, '   ')
    
    expect(todos.value[0].title).toBe('Исходное название')
  })

  it('должен удалять задачу', () => {
    const { todos, addTodo, removeTodo } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    const todoId = todos.value[0].id
    
    expect(todos.value).toHaveLength(2)
    
    removeTodo(todoId)
    
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0].title).toBe('Задача 2')
  })

  it('должен очищать выполненные задачи', () => {
    const { todos, addTodo, toggleTodo, clearCompleted } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    addTodo('Задача 3')
    
    toggleTodo(todos.value[0].id)
    toggleTodo(todos.value[2].id)
    
    clearCompleted()
    
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0].title).toBe('Задача 2')
  })

  it('должен фильтровать активные задачи', () => {
    const { todos, addTodo, toggleTodo, setFilter, filteredTodos } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    addTodo('Задача 3')
    
    toggleTodo(todos.value[1].id)
    
    setFilter('active')
    
    expect(filteredTodos.value).toHaveLength(2)
    expect(filteredTodos.value[0].title).toBe('Задача 1')
    expect(filteredTodos.value[1].title).toBe('Задача 3')
  })

  it('должен фильтровать выполненные задачи', () => {
    const { todos, addTodo, toggleTodo, setFilter, filteredTodos } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    addTodo('Задача 3')
    
    toggleTodo(todos.value[0].id)
    toggleTodo(todos.value[2].id)
    
    setFilter('completed')
    
    expect(filteredTodos.value).toHaveLength(2)
    expect(filteredTodos.value[0].title).toBe('Задача 1')
    expect(filteredTodos.value[1].title).toBe('Задача 3')
  })

  it('должен показывать все задачи при фильтре "all"', () => {
    const { todos, addTodo, toggleTodo, setFilter, filteredTodos } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    
    toggleTodo(todos.value[0].id)
    setFilter('all')
    
    expect(filteredTodos.value).toHaveLength(2)
  })

  it('должен подсчитывать оставшиеся задачи', () => {
    const { addTodo, toggleTodo, remainingCount, todos } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    addTodo('Задача 3')
    
    expect(remainingCount.value).toBe(3)
    
    toggleTodo(todos.value[0].id)
    
    expect(remainingCount.value).toBe(2)
  })

  it('должен сохранять задачи в localStorage', async () => {
    const { addTodo } = useTodos()
    
    addTodo('Сохраненная задача')
    
    // Ждем следующего тика для выполнения watch
    await new Promise(resolve => setTimeout(resolve, 0))
    
    const stored = localStorage.getItem('todos-v1')
    expect(stored).toBeDefined()
    
    const parsed = JSON.parse(stored)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].title).toBe('Сохраненная задача')
  })

  it('должен загружать задачи из localStorage', () => {
    const mockTodos = [
      { id: '1', title: 'Загруженная задача', completed: false }
    ]
    
    localStorage.setItem('todos-v1', JSON.stringify(mockTodos))
    
    const { todos } = useTodos()
    
    expect(todos.value).toHaveLength(1)
    expect(todos.value[0].title).toBe('Загруженная задача')
  })

  it('должен корректно обрабатывать поврежденные данные в localStorage', () => {
    localStorage.setItem('todos-v1', 'invalid json')
    
    const { todos } = useTodos()
    
    expect(todos.value).toEqual([])
  })

  it('должен генерировать уникальные ID для задач', () => {
    const { todos, addTodo } = useTodos()
    
    addTodo('Задача 1')
    addTodo('Задача 2')
    addTodo('Задача 3')
    
    const ids = todos.value.map(t => t.id)
    const uniqueIds = new Set(ids)
    
    expect(uniqueIds.size).toBe(3)
  })
})


