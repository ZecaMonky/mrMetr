'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

    if (!form.phone) {
        setError('Пожалуйста, введите номер телефона.')
        return
    }
    if (!form.email) {
      setError('Пожалуйста, заполните поле почты.')
      return
    }
    if (!form.password) {
      setError('Пожалуйста, введите пароль.')
      return
    }
    if (!form.confirmPassword) {
      setError('Пожалуйста, повторите пароль.')
      return
    }

    if (!/^\+?\d{10,15}$/.test(form.phone)) {
        setError('Введите корректный номер телефона.')
        return
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError('Введите корректную почту.')
      return
    }

    if (form.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают.')
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccess('Вы успешно зарегистрированы!')
      setForm({ email: '', phone: '', password: '', confirmPassword: '' })

          setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (err) {
      setError(err.message || 'Что-то пошло не так...')
    }
  }

  return (
    <div className="container mx-auto w-full mt-10 px-4 sm:px-0 sm:mt-30 sm:flex sm:justify-center">
      <div className="w-full max-w-md px-4 sm:px-6 py-10 sm:py-14 bg-white rounded-2xl shadow-md border border-gray-300">
      <h1 className="text-2xl font-bold mb-6 text-center">Регистрация</h1>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Телефон</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Почта</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Пароль</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Подтверждение пароля</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Зарегистрироваться
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/login')}
          className="text-blue-600 hover:underline"
        >
          Уже есть аккаунт? Войдите
        </button>
      </div>
    </div>
    </div>
  )
}
