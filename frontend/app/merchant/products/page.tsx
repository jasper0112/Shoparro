'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { getUser, isAuthenticated } from '@/lib/auth'
import {
  getProductsByMerchant,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
  updateProductStock,
  type Product,
  type CreateProductRequest,
  type UpdateProductRequest,
} from '@/lib/api'
import styles from './merchant-products.module.css'

export default function MerchantProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [authChecked, setAuthChecked] = useState(false)
  const [merchantId, setMerchantId] = useState<number | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<CreateProductRequest>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    sku: '',
    brand: '',
    unit: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const authed = isAuthenticated()
    setAuthChecked(true)
    if (!authed) {
      router.push('/login')
      return
    }

    const currentUser = getUser()
    if (currentUser && currentUser.id) {
      setMerchantId(currentUser.id)
      loadProducts(currentUser.id)
    } else {
      setError('User not found')
      setLoading(false)
    }
  }, [router, currentPage])

  const loadProducts = async (userId: number) => {
    try {
      setLoading(true)
      const response = await getProductsByMerchant(userId, currentPage, 20)
      setProducts(response.content)
      setTotalPages(response.totalPages)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to load products')
      console.error('Error loading products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!merchantId) return

    setSaving(true)
    try {
      await createProduct(merchantId, formData)
      setShowCreateModal(false)
      resetForm()
      loadProducts(merchantId)
    } catch (err: any) {
      setError(err.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!merchantId || !editingProduct) return

    setSaving(true)
    try {
      await updateProduct(editingProduct.id, merchantId, formData as UpdateProductRequest)
      setEditingProduct(null)
      resetForm()
      loadProducts(merchantId)
    } catch (err: any) {
      setError(err.message || 'Failed to update product')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId: number) => {
    if (!merchantId || !confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteProduct(productId, merchantId)
      loadProducts(merchantId)
    } catch (err: any) {
      setError(err.message || 'Failed to delete product')
    }
  }

  const handleToggleStatus = async (productId: number) => {
    if (!merchantId) return

    try {
      await toggleProductStatus(productId, merchantId)
      loadProducts(merchantId)
    } catch (err: any) {
      setError(err.message || 'Failed to toggle product status')
    }
  }

  const handleUpdateStock = async (productId: number, newStock: number) => {
    try {
      await updateProductStock(productId, newStock)
      if (merchantId) loadProducts(merchantId)
    } catch (err: any) {
      setError(err.message || 'Failed to update stock')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      imageUrl: '',
      sku: '',
      brand: '',
      unit: '',
    })
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      sku: product.sku || '',
      brand: product.brand || '',
      unit: product.unit || '',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount)
  }

  if (!authChecked) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>My Products</h1>
              <p className={styles.subtitle}>Manage your product catalog</p>
            </div>
            <button
              onClick={() => {
                resetForm()
                setEditingProduct(null)
                setShowCreateModal(true)
              }}
              className={styles.createButton}
            >
              + Add Product
            </button>
          </header>

          {error && (
            <div className={styles.errorMessage}>
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className={styles.loading}>
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h2>No products yet</h2>
              <p>Start by adding your first product to the catalog.</p>
              <button
                onClick={() => {
                  resetForm()
                  setShowCreateModal(true)
                }}
                className={styles.createButton}
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <>
              <div className={styles.productsGrid}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div className={styles.placeholderImage}>📦</div>
                      )}
                      <span className={`${styles.statusBadge} ${styles[product.status.toLowerCase()]}`}>
                        {product.status}
                      </span>
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productPrice}>{formatCurrency(product.price)}</p>
                      <div className={styles.productMeta}>
                        <span>Stock: {product.stock}</span>
                        {product.category && <span>• {product.category}</span>}
                      </div>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        onClick={() => openEditModal(product)}
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={styles.toggleButton}
                      >
                        {product.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className={styles.pageButton}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className={styles.pageButton}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}

          {(showCreateModal || editingProduct) && (
            <div className={styles.modalOverlay} onClick={() => {
              setShowCreateModal(false)
              setEditingProduct(null)
              resetForm()
            }}>
              <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <h2>{editingProduct ? 'Edit Product' : 'Create New Product'}</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    editingProduct ? handleUpdate() : handleCreate()
                  }}
                  className={styles.form}
                >
                  <div className={styles.formRow}>
                    <label>
                      Product Name *
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        maxLength={200}
                      />
                    </label>
                  </div>

                  <div className={styles.formRow}>
                    <label>
                      Description
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        maxLength={2000}
                      />
                    </label>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formRow}>
                      <label>
                        Price (AUD) *
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                          required
                          min="0.01"
                          step="0.01"
                        />
                      </label>
                    </div>

                    <div className={styles.formRow}>
                      <label>
                        Stock *
                        <input
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                          required
                          min="0"
                        />
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formRow}>
                      <label>
                        Category
                        <input
                          type="text"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          maxLength={100}
                        />
                      </label>
                    </div>

                    <div className={styles.formRow}>
                      <label>
                        SKU
                        <input
                          type="text"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                          maxLength={50}
                        />
                      </label>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formRow}>
                      <label>
                        Brand
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          maxLength={100}
                        />
                      </label>
                    </div>

                    <div className={styles.formRow}>
                      <label>
                        Unit
                        <input
                          type="text"
                          value={formData.unit}
                          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                          placeholder="e.g., piece, kg, L"
                          maxLength={50}
                        />
                      </label>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <label>
                      Image URL
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        maxLength={500}
                      />
                    </label>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateModal(false)
                        setEditingProduct(null)
                        resetForm()
                      }}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className={styles.saveButton}
                    >
                      {saving ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}

