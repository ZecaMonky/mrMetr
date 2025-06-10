'use client'

import { useState } from 'react'

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        throw new Error('Ошибка при отправке формы')
      }

      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

return (
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-xl mt-10 mx-auto p-8 bg-white shadow-xl rounded-2xl space-y-6 border border-gray-100"
  >
    <h2 className="text-2xl font-bold text-gray-800 text-center">
      Свяжитесь с нами
    </h2>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Имя
      </label>
      <input
        name="name"
        type="text"
        placeholder="Введите ваше имя"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        name="email"
        type="email"
        placeholder="Введите ваш email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Сообщение
      </label>
      <textarea
        name="message"
        placeholder="Напишите ваше сообщение..."
        value={form.message}
        onChange={handleChange}
        required
        rows={5}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className={`w-full py-2 px-4 rounded-xl font-semibold text-white transition-all duration-300 ${
        loading
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {loading ? 'Отправка...' : 'Отправить сообщение'}
    </button>

    {success && (
      <p className="text-green-600 text-center font-medium">
        ✅ Сообщение успешно отправлено!
      </p>
    )}
    {error && (
      <p className="text-red-600 text-center font-medium">
        ❌ Ошибка: {error}
      </p>
    )}
  </form>
);

}
