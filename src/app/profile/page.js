'use client'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('authToken')

    if (!token) {
      router.push('/login')
      return
    }

    const fetchData = async () => {
      try {
        const profileRes = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const profileData = await profileRes.json()

        if (!profileRes.ok || profileData.error) {
          throw new Error(profileData.error || 'Ошибка авторизации')
        }

        setUser(profileData)

        Cookies.set('user', JSON.stringify(profileData))

        const ordersRes = await fetch('/api/orders/history', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const ordersData = await ordersRes.json()

        if (!ordersRes.ok || ordersData.error) {
          throw new Error(ordersData.error || 'Ошибка получения заказов')
        }

        setOrders(ordersData)
      } catch (err) {
        console.error('Ошибка:', err.message)
        Cookies.remove('authToken')
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    Cookies.remove('authToken')
    router.push('/login')
  }

  const calculateOrderTotal = (order) => {
    return order.items.reduce((total, item) => {
      return total + item.product.price * item.quantity
    }, 0).toFixed(2);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
      </div>
    );
  }


  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
        >
          Выйти
        </button>
      </div>

      <div className="mb-8 border-1 border-gray-200 p-4 rounded-xl shadow">
        <p><strong>Email:</strong> {user.email || '—'}</p>
        <p><strong>Телефон:</strong> {user.phone || '—'}</p>

        {user.role === 'ADMIN' && (
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Панель администратора
          </button>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">История заказов</h2>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border-1 border-gray-200 p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-500 mb-2">
                Заказ от {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <p className="text-sm mb-2">
                <strong>Статус:</strong> {order.status}
              </p>

              <ul className="list-disc pl-4 mb-2">
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.product.name} — {item.quantity} шт. (₽
                    {item.product.price * item.quantity})
                  </li>
                ))}
              </ul>
              <p>
                <strong>Способ:</strong> {order.deliveryMethod} <br />
                {order.deliveryAddress && (
                  <>
                    <strong>Адрес:</strong> {order.deliveryAddress}
                  </>
                )}
              </p>
              <div className="mt-2">
                <strong>Итого:</strong> ₽{calculateOrderTotal(order)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>У вас пока нет заказов.</p>
      )}
    </div>
  )
}
