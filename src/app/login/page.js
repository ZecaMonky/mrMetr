'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [form, setForm] = useState({
    identifier: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const router = useRouter()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.identifier || !form.password) {
      setError('Пожалуйста, заполните все поля.')
      return
    }

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        credentials: 'include',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ошибка входа')
      }

      setSuccess('Успешный вход!')

      const check = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include',
      })

      if (check.ok) {
        const result = await check.json()
        console.log('Авторизован как:', result)
        router.refresh();
      } else {
        console.log('Не авторизован')
      }

      if (data.role === 'ADMIN') {
        window.location.href = '/admin'
      } else {
        window.location.href = '/profile'
      }
    } catch (err) {
      setError(err.message || 'Что-то пошло не так...')
    }
  }


  return (
    <div className="container mx-auto w-full mt-10 px-4 sm:px-0 sm:mt-30 sm:flex sm:justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 py-10 sm:py-14 bg-white rounded-2xl shadow-md border border-gray-300">
        <h1 className="text-2xl sm:text-3xl font-bold mb-10 sm:mb-20 text-center">Вход</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Почта или номер телефона
            </label>
            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              className="w-full px-3 py-2 border-1 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border-1 border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white mt-6 py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Войти
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/register')}
            className="text-blue-600 hover:underline text-sm"
          >
            Нет аккаунта? Зарегистрируйтесь
          </button>
        </div>
      </div>
    </div>
  )
}
