'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { useLocalStorage } from '@/lib/maliyet/useLocalStorage'
import { getMenuItems, syncMenuToMaliyet } from '@/lib/maliyet/menuSync'
import { loadMaliyetData, saveMaliyetData } from '@/lib/maliyet/githubSync'
import Layout from '@/components/maliyet/Layout'
import Dashboard from '@/components/maliyet/Dashboard'
import MaterialList from '@/components/maliyet/MaterialList'
import ProductList from '@/components/maliyet/ProductList'
import ProductDetail from '@/components/maliyet/ProductDetail'
import Settings from '@/components/maliyet/Settings'
import PriceSimulation from '@/components/maliyet/PriceSimulation'
import ProductionReport from '@/components/maliyet/ProductionReport'

export default function MaliyetApp({ onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [materials, setMaterials] = useLocalStorage('materials', [])
  const [products, setProducts] = useLocalStorage('products', [])
  const [categories, setCategories] = useLocalStorage('categories', { materials: [], products: [] })
  const [settings, setSettings] = useLocalStorage('settings', { targetProfitMargin: 0 })
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [selectedProductId, setSelectedProductId] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const initialLoadDone = useRef(false)

  // Uygulama açıldığında remote verileri yükle
  useEffect(() => {
    if (initialLoadDone.current) return
    initialLoadDone.current = true

    loadMaliyetData().then(remoteData => {
      if (remoteData) {
        if (remoteData.products?.length > 0) setProducts(remoteData.products)
        if (remoteData.materials?.length > 0) setMaterials(remoteData.materials)
        if (remoteData.categories) setCategories(remoteData.categories)
        if (remoteData.settings) setSettings(remoteData.settings)
      }
      setDataLoaded(true)
    }).catch(() => {
      setDataLoaded(true)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Menü ürünlerini oku ve fiyat senkronizasyonu yap
  useEffect(() => {
    if (!dataLoaded) return
    const items = getMenuItems()
    setMenuItems(items)
    if (items.length > 0 && products.length > 0) {
      const synced = syncMenuToMaliyet(products)
      if (synced !== products) {
        setProducts(synced)
      }
    }
  }, [dataLoaded]) // eslint-disable-line react-hooks/exhaustive-deps

  // Veri değişikliklerini takip et (ilk yükleme sonrası)
  useEffect(() => {
    if (dataLoaded) setHasChanges(true)
  }, [materials, products, categories, settings]) // eslint-disable-line react-hooks/exhaustive-deps

  // İlk yükleme tamamlandığında hasChanges'ı sıfırla
  useEffect(() => {
    if (dataLoaded) {
      const timer = setTimeout(() => setHasChanges(false), 500)
      return () => clearTimeout(timer)
    }
  }, [dataLoaded])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      await saveMaliyetData({ products, materials, categories, settings })
      setHasChanges(false)
      alert('Veriler kaydedildi! 2-3 dakika içinde tüm cihazlarda görünecek.')
    } catch (err) {
      alert('Kaydetme hatası: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }, [products, materials, categories, settings])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleViewProduct = (productId) => {
    setSelectedProductId(productId)
    setActiveTab('product-detail')
  }

  const handleBackToProducts = () => {
    setSelectedProductId(null)
    setActiveTab('products')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            materials={materials}
            products={products}
            settings={settings}
            onViewProduct={handleViewProduct}
          />
        )
      case 'materials':
        return (
          <MaterialList
            materials={materials}
            setMaterials={setMaterials}
            products={products}
            categories={categories}
            setCategories={setCategories}
          />
        )
      case 'products':
        return (
          <ProductList
            products={products}
            setProducts={setProducts}
            materials={materials}
            categories={categories}
            setCategories={setCategories}
            settings={settings}
            onViewProduct={handleViewProduct}
            menuItems={menuItems}
          />
        )
      case 'product-detail':
        return (
          <ProductDetail
            product={products.find(p => p.id === selectedProductId)}
            materials={materials}
            settings={settings}
            onBack={handleBackToProducts}
          />
        )
      case 'simulation':
        return (
          <PriceSimulation
            materials={materials}
            products={products}
            settings={settings}
          />
        )
      case 'report':
        return (
          <ProductionReport
            materials={materials}
            products={products}
            settings={settings}
          />
        )
      case 'settings':
        return (
          <Settings settings={settings} setSettings={setSettings} />
        )
      default:
        return null
    }
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <Layout activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} toggleTheme={toggleTheme} onLogout={onLogout}
        hasChanges={hasChanges} isSaving={isSaving} onSave={handleSave}>
        {renderContent()}
      </Layout>
    </div>
  )
}
