"use client";

import { useState } from "react";

export default function OrderStatusForm({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/update-order-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });

    if (res.ok) {
      setMessage("✅ Статус обновлен");
    } else {
      setMessage("❌ Ошибка при обновлении");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="mr-2 text-sm text-gray-600">Статус:</label>
      <select
        name="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-2 py-1 text-sm rounded"
      >
        <option value="Проверяется">Проверяется</option>
        <option value="Собирается">Собирается</option>
        <option value="Отправлено">Отправлено</option>
        <option value="Доставлено">Доставлено</option>
        <option value="Выдача">Выдаётся</option>
        <option value="Отменено">Отменено</option>
        <option value="Завершено">Завершено</option>
      </select>
      <button
        type="submit"
        className="ml-2 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1 rounded text-sm"
        disabled={loading}
      >
        {loading ? "Обновление..." : "Обновить"}
      </button>
      {message && <p className="text-sm mt-1">{message}</p>}
    </form>
  );
}
