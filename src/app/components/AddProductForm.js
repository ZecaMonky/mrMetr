'use client';

import { useState, useEffect } from 'react';
import { FaSave, FaTrashAlt } from 'react-icons/fa';

export default function AddProductForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editNames, setEditNames] = useState({});
  const [loading, setLoading] = useState(false);

 useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const selected = categories.find((cat) => cat.id === categoryId);
    setSubcategories(Array.isArray(selected?.subcategories) ? selected.subcategories : []);
  }, [categoryId, categories]);

  useEffect(() => {
    const generateSKU = () => Math.floor(100000 + Math.random() * 900000).toString();
    setSku(generateSKU());
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      setLoading(true);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });

      const data = await res.json();
      setCategories([...categories, data]);
      setNewCategory('');
      setLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (newSubcategory.trim() && categoryId) {
      setLoading(true);
      const res = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubcategory, categoryId }),
      });
      const data = await res.json();
      const updatedCategories = categories.map((cat) =>
        cat.id === categoryId ? { ...cat, subcategories: [...cat.subcategories, data] } : cat
      );
      setCategories(updatedCategories);
      setSubcategories([...subcategories, data]);
      setNewSubcategory('');
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Удалить категорию?')) return;
    await fetch('/api/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCategories();
  };

  const handleDeleteSubcategory = async (id) => {
    if (!confirm('Удалить подкатегорию?')) return;
    await fetch('/api/subcategories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchCategories();
  };

  const handleUpdateCategory = async (id) => {
    const name = editNames[`cat-${id}`];
    if (!name.trim()) return;
    await fetch('/api/categories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    });
    fetchCategories();
  };

  const handleUpdateSubcategory = async (id) => {
    const name = editNames[`sub-${id}`];
    if (!name.trim()) return;
    await fetch('/api/subcategories', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name }),
    });
    fetchCategories();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = {
      name,
      description,
      sku,
      price: parseFloat(price),
      categoryId,
      subcategoryId,
    };

    await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });

    window.location.reload();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6 mx-auto">
      <form onSubmit={handleSubmit} className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Добавление товара</h2>
      <input type="text" placeholder="Название" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" required />
        <textarea placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" required />
        <input type="text" placeholder="Артикул (SKU)" value={sku} onChange={(e) => setSku(e.target.value)} className="border p-2 w-full" required />
        <input type="number" placeholder="Цена" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" required />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border p-2 w-full">
          <option value="">Выберите категорию</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {Array.isArray(subcategories) && subcategories.length > 0 && (
          <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="border p-2 w-full">
            <option value="">Выберите подкатегорию</option>
            {subcategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        )}

        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full">
          Добавить товар
        </button>
      </form>

      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Категории</h2>

        <div className="flex gap-2">
          <input type="text" placeholder="Новая категория" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="border p-2 w-full" />
          <button type="button" onClick={handleAddCategory} disabled={loading} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
            Добавить
          </button>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <input
                value={editNames[`cat-${cat.id}`] ?? cat.name}
                onChange={(e) => setEditNames({ ...editNames, [`cat-${cat.id}`]: e.target.value })}
                className="border p-1 flex-1"
              />
              <button type="button" onClick={() => handleUpdateCategory(cat.id)} className="text-gray-400 hover:text-green-600 text-lg">
                <FaSave />
              </button>
              <button type="button" onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 hover:text-red-800 text-lg">
                <FaTrashAlt />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold mb-2">Подкатегории</h2>
        {categoryId ? (
          <>
            <div className="flex gap-2">
              <input type="text" placeholder="Новая подкатегория" value={newSubcategory} onChange={(e) => setNewSubcategory(e.target.value)} className="border p-2 w-full" />
              <button type="button" onClick={handleAddSubcategory} disabled={loading} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded">
                Добавить
              </button>
            </div>

            <div className="space-y-2">
            {Array.isArray(subcategories) && subcategories.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2">
                  <input
                    value={editNames[`sub-${sub.id}`] ?? sub.name}
                    onChange={(e) => setEditNames({ ...editNames, [`sub-${sub.id}`]: e.target.value })}
                    className="border p-1 flex-1"
                  />
                  <button type="button" onClick={() => handleUpdateSubcategory(sub.id)} className="text-gray-400 hover:text-green-600 text-lg">
                    <FaSave />
                  </button>
                  <button type="button" onClick={() => handleDeleteSubcategory(sub.id)} className="text-red-600 hover:text-red-800 text-lg">
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Выберите категорию, чтобы добавить или редактировать подкатегории</p>
        )}
      </div>
    </div>
  );
}
