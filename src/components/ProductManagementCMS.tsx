"use client";

import { useState, useEffect, FormEvent } from 'react';
import { API_ENDPOINTS } from '@/lib/api';

interface Product {
  _id?: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  badge: string;
  rating: number;
  shortDescription: string;
  longDescription: string;
  features: string[];
  specifications: Record<string, string>;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
}

export default function ProductManagementCMS() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState<string[]>(['']);
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [rating, setRating] = useState(0);
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([{ key: '', value: '' }]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.categories);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.products);
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice(0);
    setImages(['']);
    setCategory('');
    setBadge('');
    setRating(0);
    setShortDescription('');
    setLongDescription('');
    setFeatures(['']);
    setSpecifications([{ key: '', value: '' }]);
    setEditingProduct(null);
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingImages(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(API_ENDPOINTS.upload, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      const newImages = [...images];
      newImages[index] = data.url;
      setImages(newImages);
    } catch (err: any) {
      setError(`Image upload failed: ${err.message}`);
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const specsObj: Record<string, string> = {};
    specifications.forEach(spec => {
      if (spec.key && spec.value) {
        specsObj[spec.key] = spec.value;
      }
    });

    const productData = {
      name,
      price,
      images: images.filter(Boolean),
      category,
      badge: badge || null,
      rating,
      shortDescription,
      longDescription,
      features: features.filter(Boolean),
      specifications: specsObj,
    };

    try {
      const url = editingProduct
        ? API_ENDPOINTS.productById(editingProduct._id!)
        : API_ENDPOINTS.products;

      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!res.ok) throw new Error(`Failed to ${editingProduct ? 'update' : 'create'} product`);

      await fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price);
    setImages(product.images.length ? product.images : ['']);
    setCategory(product.category);
    setBadge(product.badge || '');
    setRating(product.rating);
    setShortDescription(product.shortDescription);
    setLongDescription(product.longDescription);
    setFeatures(product.features.length ? product.features : ['']);
    
    const specs = Object.entries(product.specifications || {}).map(([key, value]) => ({
      key,
      value,
    }));
    setSpecifications(specs.length ? specs : [{ key: '', value: '' }]);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(API_ENDPOINTS.productById(id), {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      await fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add New Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Edit Product' : 'Create New Product'}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No categories available. Please create categories in the Category Management tab first.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Badge</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
                placeholder="New, Best Seller, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Images {uploadingImages && '(Uploading...)'}</label>
            {images.map((img, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={img}
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  placeholder="Image URL or upload below"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, index);
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                  disabled={uploadingImages}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setImages([...images, ''])}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Another Image
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long Description *</label>
            <textarea
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    const newFeatures = [...features];
                    newFeatures[index] = e.target.value;
                    setFeatures(newFeatures);
                  }}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900"
                  placeholder="Feature description"
                />
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setFeatures(features.filter((_, i) => i !== index))}
                    className="text-red-600 hover:text-red-800 px-2"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFeatures([...features, ''])}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Feature
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specifications</label>
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => {
                    const newSpecs = [...specifications];
                    newSpecs[index].key = e.target.value;
                    setSpecifications(newSpecs);
                  }}
                  className="border border-gray-300 rounded px-3 py-2 text-gray-900"
                  placeholder="Key (e.g., Weight)"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => {
                      const newSpecs = [...specifications];
                      newSpecs[index].value = e.target.value;
                      setSpecifications(newSpecs);
                    }}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-gray-900"
                    placeholder="Value (e.g., 5kg)"
                  />
                  {specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setSpecifications(specifications.filter((_, i) => i !== index))}
                      className="text-red-600 hover:text-red-800 px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSpecifications([...specifications, { key: '', value: '' }])}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Specification
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      )}

      {/* Product List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Image</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Category</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Price</th>
              <th className="px-4 py-2 text-left text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-t">
                <td className="px-4 py-2">
                  {product.images[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2 text-gray-900">{product.name}</td>
                <td className="px-4 py-2 text-gray-700">{product.category}</td>
                <td className="px-4 py-2 text-gray-900 font-medium">${product.price}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id!)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

