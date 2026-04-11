import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useMenuItems } from '../../hooks/useMenuItems'

export default function AdminMenuList() {
  const { items, loading, refetch } = useMenuItems({ activeOnly: false })
  const [editing, setEditing] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  function closeModal() {
    setEditing(null)
    setShowAdd(false)
  }

  function handleDone() {
    closeModal()
    refetch()
  }

  if (loading) return <Spinner />

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-label text-brand-400 text-xs tracking-widest uppercase">
          {items.length} item{items.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-brand-600 text-brand-900 font-label text-xs tracking-[0.3em] uppercase hover:bg-brand-700 transition-colors"
        >
          Add Item
        </button>
      </div>

      {items.length === 0 && (
        <p className="font-label text-brand-400 text-xs tracking-widest uppercase text-center py-8">
          No menu items yet.
        </p>
      )}

      <div className="space-y-1.5">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 bg-brand-100 border border-brand-200 p-3"
          >
            {/* Thumbnail */}
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: '48px', height: '48px', backgroundColor: '#f5efe3', border: '1px solid #d9cfc0' }}
            >
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4722a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                  <path d="M5 8h14l-1.5 9a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 8z" />
                  <path d="M17 10h2a2 2 0 0 1 0 4h-2" />
                  <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
                  <path d="M4 19h16" />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-serif text-brand-900 text-sm">{item.name}</p>
              <p className="font-label text-brand-400 text-xs tracking-wider truncate">{item.description}</p>
              <p className="font-label text-brand-600 text-xs tracking-wider mt-0.5">
                ₹{Number(item.price).toLocaleString('en-IN')}
              </p>
            </div>

            {/* Status + Edit */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <span className={`font-label text-xs tracking-widest uppercase px-2 py-0.5 ${
                item.is_active
                  ? 'text-green-600 border border-green-200 bg-green-50'
                  : 'text-brand-400 border border-brand-200'
              }`}>
                {item.is_active ? 'On' : 'Off'}
              </span>
              <button
                onClick={() => setEditing(item)}
                className="font-label text-xs tracking-widest uppercase px-2.5 py-1 border border-brand-200 text-brand-400 hover:text-brand-900 hover:bg-brand-200 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || showAdd) && (
        <MenuItemModal item={editing} onDone={handleDone} onClose={closeModal} />
      )}
    </div>
  )
}

function MenuItemModal({ item, onDone, onClose }) {
  const isEdit = !!item
  const [form, setForm] = useState({
    name: item?.name ?? '',
    description: item?.description ?? '',
    price: item ? String(item.price) : '',
    is_active: item?.is_active ?? true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(item?.image_url ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const price = parseFloat(form.price)
    if (isNaN(price) || price <= 0) {
      setError('Enter a valid price.')
      return
    }

    setLoading(true)
    let image_url = item?.image_url ?? null

    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(path, imageFile, { upsert: true })

      if (uploadError) {
        setError('Image upload failed. Make sure the "menu-images" storage bucket exists.')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage.from('menu-images').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price,
      is_active: form.is_active,
      image_url,
    }

    let err
    if (isEdit) {
      ;({ error: err } = await supabase.from('menu_items').update(payload).eq('id', item.id))
    } else {
      ;({ error: err } = await supabase.from('menu_items').insert(payload))
    }

    setLoading(false)
    if (err) {
      setError('Failed to save item. Please try again.')
    } else {
      onDone()
    }
  }

  const inputClass = 'w-full px-3 py-2 border border-brand-200 bg-brand-50 text-brand-900 placeholder-brand-300 text-sm focus:outline-none focus:border-brand-600 transition-colors'
  const labelClass = 'block font-label text-brand-400 text-xs tracking-widest uppercase mb-1.5'

  return (
    <div className="fixed inset-0 bg-brand-900/70 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-brand-50 border border-brand-200 w-full max-w-md p-5 space-y-4 max-h-[90vh] overflow-y-auto">
        <p className="font-label text-brand-600 text-xs tracking-[0.4em] uppercase">
          {isEdit ? 'Edit Item' : 'Add Menu Item'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Photo */}
          <div>
            <label className={labelClass}>Photo</label>
            <div className="flex items-center gap-3">
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: '56px', height: '56px', backgroundColor: '#f5efe3', border: '1px solid #d9cfc0' }}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4722a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                    <path d="M5 8h14l-1.5 9a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 8z" />
                    <path d="M17 10h2a2 2 0 0 1 0 4h-2" />
                    <path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
                    <path d="M4 19h16" />
                  </svg>
                )}
              </div>
              <label className="flex-1 cursor-pointer">
                <span className="block font-label text-xs px-3 py-2 border border-brand-200 text-brand-400 hover:text-brand-900 hover:bg-brand-200 tracking-widest uppercase transition-colors text-center">
                  {imagePreview ? 'Change photo' : 'Upload photo'}
                </span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>Item Name</label>
            <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Espresso" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Rich and bold single shot" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Price (₹)</label>
            <input type="number" min="1" step="1" required value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="120" className={inputClass} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="border-brand-300 text-brand-600 focus:ring-brand-600" />
            <span className="font-label text-brand-400 text-xs tracking-widest uppercase">Show on menu</span>
          </label>

          {error && (
            <p className="text-xs text-red-400 border border-red-900 bg-red-950/40 px-3 py-2 font-label tracking-wider">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} disabled={loading}
              className="flex-1 py-2.5 border border-brand-200 font-label text-xs tracking-widest uppercase text-brand-400 hover:text-brand-900 hover:bg-brand-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 bg-brand-600 text-brand-900 font-label text-xs tracking-widest uppercase hover:bg-brand-700 disabled:opacity-60 transition-colors">
              {loading ? 'Saving…' : isEdit ? 'Save' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
