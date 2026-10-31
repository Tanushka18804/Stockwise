import { useEffect, useMemo, useState } from 'react'
import { Boxes, Search, Plus, Pencil, Trash2, Package, AlertTriangle, IndianRupee, Layers3, X, RefreshCw } from 'lucide-react'

const API = 'http://localhost:8080/api'
const emptyForm = { name: '', sku: '', category: 'Electronics', price: '', quantity: '', reorderLevel: '5' }
const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0))

export default function App() {
  const [products, setProducts] = useState([])
  const [summary, setSummary] = useState({ totalProducts: 0, totalUnits: 0, lowStockItems: 0, inventoryValue: 0 })
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [modal, setModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadData(term = search) {
    setLoading(true); setError('')
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/products${term ? `?search=${encodeURIComponent(term)}` : ''}`),
        fetch(`${API}/dashboard/summary`)
      ])
      if (!pRes.ok || !sRes.ok) throw new Error('Could not load data. Check that the Spring Boot backend and MySQL are running.')
      setProducts(await pRes.json()); setSummary(await sRes.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadData('') }, [])

  const lowStock = useMemo(() => products.filter(p => p.quantity <= p.reorderLevel).length, [products])

  function openAdd() { setEditingId(null); setForm(emptyForm); setModal(true) }
  function openEdit(p) {
    setEditingId(p.id)
    setForm({ name: p.name, sku: p.sku, category: p.category, price: p.price, quantity: p.quantity, reorderLevel: p.reorderLevel })
    setModal(true)
  }

  async function saveProduct(e) {
    e.preventDefault(); setError('')
    const payload = { ...form, price: Number(form.price), quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel) }
    try {
      const response = await fetch(`${API}/products${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.message || (response.status === 409 ? 'This SKU already exists.' : 'Unable to save product.'))
      }
      setModal(false); setForm(emptyForm); await loadData()
    } catch (e) { setError(e.message) }
  }

  async function removeProduct(id) {
    if (!window.confirm('Delete this product?')) return
    try {
      const response = await fetch(`${API}/products/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Unable to delete product.')
      await loadData()
    } catch (e) { setError(e.message) }
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-icon"><Boxes size={22}/></span><span>Stock<span className="brand-accent">Wise</span></span></div>
      <div className="side-label">WORKSPACE</div>
      <div className="nav-item active"><Layers3 size={18}/> Inventory</div>
      <div className="side-note">INVENTORY CONTROL<br/><span>Know your stock. Make smarter decisions.</span></div>
      <div className="sidebar-bottom"><span className="status-dot"/> System workspace <small>v1.0 MVP</small></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><div className="eyebrow">OVERVIEW / INVENTORY</div><h1>Inventory dashboard</h1><p className="muted">Monitor products and keep stock levels under control.</p></div><button className="refresh-btn" onClick={() => loadData()}><RefreshCw size={16}/> Refresh</button></header>
      {error && <div className="error-banner">{error}</div>}
      <section className="stats-grid">
        <Stat icon={<Package/>} label="Total products" value={summary.totalProducts} tone="blue"/>
        <Stat icon={<Boxes/>} label="Units in stock" value={summary.totalUnits} tone="violet"/>
        <Stat icon={<AlertTriangle/>} label="Low stock items" value={summary.lowStockItems} tone="amber"/>
        <Stat icon={<IndianRupee/>} label="Inventory value" value={money(summary.inventoryValue)} tone="green"/>
      </section>
      <section className="panel">
        <div className="panel-head"><div><h2>Product inventory</h2><p className="muted">Manage your product catalogue and stock quantities.</p></div><button className="primary-btn" onClick={openAdd}><Plus size={17}/> Add product</button></div>
        <div className="toolbar"><div className="searchbox"><Search size={17}/><input value={search} placeholder="Search by product name or SKU..." onChange={e => { setSearch(e.target.value); loadData(e.target.value) }}/></div><span className="result-count">{products.length} products shown</span></div>
        <div className="table-wrap"><table><thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>PRICE</th><th>QUANTITY</th><th>STATUS</th><th>ACTIONS</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan="7" className="empty">Loading inventory...</td></tr> : products.length === 0 ? <tr><td colSpan="7" className="empty">No products found. Add your first product.</td></tr> : products.map(p => <tr key={p.id}>
            <td><div className="product-name"><span className="product-avatar"><Package size={17}/></span><strong>{p.name}</strong></div></td>
            <td className="sku">{p.sku}</td><td>{p.category}</td><td>{money(p.price)}</td><td><strong>{p.quantity}</strong><span className="reorder"> / reorder at {p.reorderLevel}</span></td>
            <td>{p.quantity <= p.reorderLevel ? <span className="pill low">Low stock</span> : <span className="pill good">In stock</span>}</td>
            <td><div className="actions"><button title="Edit" onClick={() => openEdit(p)}><Pencil size={16}/></button><button title="Delete" onClick={() => removeProduct(p.id)}><Trash2 size={16}/></button></div></td>
          </tr>)}</tbody></table></div>
        <div className="panel-foot"><span>Showing {products.length} inventory records</span><span>{lowStock} low-stock item(s) in this view</span></div>
      </section>
      <footer>StockWise <span>•</span> Inventory management made clearer.</footer>
    </main>
    {modal && <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && setModal(false)}><form className="modal" onSubmit={saveProduct}>
      <div className="modal-head"><div><h2>{editingId ? 'Edit product' : 'Add new product'}</h2><p className="muted">Enter the product and stock details below.</p></div><button type="button" className="close-btn" onClick={() => setModal(false)}><X/></button></div>
      <label>Product name<input required maxLength="120" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="e.g. Wireless Mouse"/></label>
      <div className="form-row"><label>SKU<input required maxLength="60" value={form.sku} onChange={e => setForm({...form, sku:e.target.value})} placeholder="e.g. ELEC-001"/></label><label>Category<select value={form.category} onChange={e => setForm({...form, category:e.target.value})}><option>Electronics</option><option>Furniture</option><option>Stationery</option><option>Clothing</option><option>Other</option></select></label></div>
      <div className="form-row"><label>Price (₹)<input required min="0" step="0.01" type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})}/></label><label>Quantity<input required min="0" type="number" value={form.quantity} onChange={e => setForm({...form, quantity:e.target.value})}/></label></div>
      <label>Reorder level<input required min="0" type="number" value={form.reorderLevel} onChange={e => setForm({...form, reorderLevel:e.target.value})}/></label>
      <div className="modal-actions"><button type="button" className="secondary-btn" onClick={() => setModal(false)}>Cancel</button><button className="primary-btn" type="submit">{editingId ? 'Save changes' : 'Create product'}</button></div>
    </form></div>}
  </div>
}

function Stat({ icon, label, value, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div><div className="stat-label">{label}</div><div className="stat-value">{value}</div></div></div>
}
