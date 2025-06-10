'use client';

import { useState } from 'react';

import ImageUploadForm from './ImageUploadForm';

export default function ProductItem({ product }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    description: product.description || '',
  });

  const handleDelete = async () => {
    if (confirm('Удалить этот товар?')) {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload();
      } else {
        alert('Ошибка при удалении товара');
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Ошибка при обновлении товара');
      }
    } catch (error) {
      alert('Произошла ошибка при сохранении изменений');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description || '',
    });
  };

  return (
    <li className="border-1 border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg">
      <div className="flex flex-col md:flex-row gap-4 items-start">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-48 h-48 object-cover rounded-lg border"
          />
        )}
        <div className="flex-1 space-y-2">
          {isEditing ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Название</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Цена (₽)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-lg font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500">₽{product.price.toLocaleString('ru-RU')}</div>
              {product.description && (
                <div className="text-sm text-gray-700">{product.description}</div>
              )}
            </>
          )}

          <div className="flex gap-2 py-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3  bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Отмена
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-3 bg-sky-600 hover:bg-sky-700 h-10 text-white rounded transition-colors"
              >
                Редактировать
              </button>
            )}
            <ImageUploadForm productId={product.id} />
            <button
              onClick={handleDelete}
              className="px-3 py-1 h-10 text-red-600 hover:text-red-800 transition-colors"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}