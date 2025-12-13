"use client";

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/admin/Card';
import { FormInput, FormTextarea, FormSelect, FormButton } from '@/components/admin/FormInput';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

const ProductEditPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState<string[]>(['']);
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [rating, setRating] = useState(0);
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const isNewProduct = id === 'new';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/categories');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();

    if (!isNewProduct) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:5001/api/products/${id}`);
          if (!res.ok) throw new Error('Failed to fetch product data.');
          const data = await res.json();
          setName(data.name);
          setPrice(data.price);
          setImages(Array.isArray(data.images) && data.images.length ? data.images : ['']);
          setCategory(data.category);
          setBadge(data.badge || '');
          setRating(data.rating || 0);
          setShortDescription(data.shortDescription || '');
          setLongDescription(data.longDescription || '');
          setFeatures(data.features?.join(', ') || '');
          
          if (data.specifications) {
            const specsObj = data.specifications instanceof Map ? Object.fromEntries(data.specifications) : data.specifications;
            const specsString = Object.entries(specsObj)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n');
            setSpecifications(specsString);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNewProduct]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const specsObj: Record<string, string> = {};
    specifications.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length > 0) {
        specsObj[key.trim()] = valueParts.join(':').trim();
      }
    });

    const productData = {
      name,
      price,
      images: images.map(img => img.trim()).filter(Boolean),
      category,
      badge: badge || null,
      rating,
      shortDescription,
      longDescription,
      features: features.split(',').map(f => f.trim()).filter(Boolean),
      specifications: specsObj,
    };
    
    try {
      const url = isNewProduct
        ? 'http://localhost:5001/api/products'
        : `http://localhost:5001/api/products/${id}`;
      
      const method = isNewProduct ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isNewProduct ? 'create' : 'update'} product`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, index: number) => {
    setUploadingImages(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Image upload failed');
      }

      const data = await res.json();
      const newImages = [...images];
      newImages[index] = data.url;
      setImages(newImages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingImages(false);
    }
  };

  if (loading && !isNewProduct) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/products" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isNewProduct ? '✨ Create New Product' : '✏️ Edit Product'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isNewProduct 
              ? 'Fill in the details below to add a new product to your inventory'
              : 'Update the product information and save your changes'
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-800 font-semibold">
                Product {isNewProduct ? 'created' : 'updated'} successfully! Redirecting...
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-6">
          {/* Basic Information */}
          <Card
            title="Basic Information"
            description="Essential product details"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Product Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g., Premium HVAC System"
              />

              <FormInput
                label="Price (PHP)"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />

              <FormSelect
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </FormSelect>

              <FormInput
                label="Badge (Optional)"
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g., NEW, SALE, HOT"
                helpText="Displayed as a tag on the product"
              />

              <FormInput
                label="Rating"
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                min="0"
                max="5"
                step="0.1"
                placeholder="0.0"
                helpText="Rating out of 5"
              />
            </div>
          </Card>

          {/* Descriptions */}
          <Card
            title="Product Descriptions"
            description="Write compelling product descriptions"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          >
            <div className="space-y-6">
              <FormTextarea
                label="Short Description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
                required
                placeholder="A brief, catchy description (1-2 sentences)"
                helpText="This appears in product listings"
              />

              <FormTextarea
                label="Long Description"
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                rows={6}
                required
                placeholder="Detailed product description with all important information"
                helpText="This appears on the product detail page"
              />
            </div>
          </Card>

          {/* Images */}
          <Card
            title="Product Images"
            description="Upload to Cloudinary or paste URLs"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          >
            <div className="space-y-3">
              {images.map((img, idx) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3">
                  <div className="flex-1 space-y-2">
                    <FormInput
                      label={idx === 0 ? 'Image URL' : undefined}
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const next = [...images];
                        next[idx] = e.target.value;
                        setImages(next);
                      }}
                      placeholder="Uploaded image URL will appear here"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-blue-500 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, idx);
                        }}
                        disabled={uploadingImages}
                      />
                      {uploadingImages ? 'Uploading...' : 'Upload'}
                    </label>
                    {images.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <FormButton
                  type="button"
                  variant="secondary"
                  onClick={() => setImages([...images, ''])}
                  disabled={uploadingImages}
                  className="text-sm"
                >
                  + Add Another Image
                </FormButton>
                <p className="text-sm text-gray-500">First image will be the main thumbnail.</p>
              </div>
              {images.some(Boolean) && (
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images
                    .map((img, idx) => ({ img: img.trim(), idx }))
                    .filter(({ img }) => !!img)
                    .map(({ img, idx }) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 transition-all"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f3f4f6" width="100" height="100"/%3E%3Ctext fill="%239ca3af" font-size="14" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        {idx === 0 && (
                          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </Card>

          {/* Features */}
          <Card
            title="Product Features"
            description="Highlight key features"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          >
            <FormTextarea
              label="Features"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              rows={5}
              required
              placeholder="Feature 1, Feature 2, Feature 3"
              helpText="Enter features separated by commas. Each will be displayed as a bullet point."
            />
          </Card>

          {/* Specifications */}
          <Card
            title="Technical Specifications"
            description="Detailed product specifications"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            }
          >
            <FormTextarea
              label="Specifications"
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              rows={8}
              required
              placeholder="Dimensions: 100x50x30 cm&#10;Weight: 25 kg&#10;Power: 220V&#10;Capacity: 5000 BTU"
              helpText="Enter specifications in 'Key: Value' format, one per line"
            />
          </Card>

          {/* Action Buttons */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4">
              <FormButton
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isNewProduct ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {isNewProduct ? 'Create Product' : 'Save Changes'}
                  </>
                )}
              </FormButton>
              <Link href="/admin/products" className="flex-1">
                <FormButton
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={loading}
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </FormButton>
              </Link>
            </div>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductEditPage;
