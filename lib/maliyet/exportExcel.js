import * as XLSX from 'xlsx'
import { calculateProductCost, calculateProfitPercentage, getProductCostParams, calculateFullCost } from './calculations'

export function exportToExcel(materials, products, settings) {
  const wb = XLSX.utils.book_new()

  // Materials sheet
  const matData = materials.map(m => ({
    'Malzeme Adı': m.name,
    'Kategori': m.category || '-',
    'Birim': m.unit,
    'Birim Fiyatı (TL)': m.unitPrice,
  }))
  const matSheet = XLSX.utils.json_to_sheet(matData)
  matSheet['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, matSheet, 'Malzemeler')

  // Products sheet
  const prodData = products.map(p => {
    const rawCost = calculateProductCost(p, materials)
    const params = getProductCostParams(p, settings)
    const cb = calculateFullCost(rawCost, params.wasteRate, params.extraCosts, params.vatRate)
    const profit = p.sellingPrice - cb.totalCost
    const profitPct = calculateProfitPercentage(p.sellingPrice, cb.totalCost)
    return {
      'Ürün Adı': p.name,
      'Kategori': p.category || '-',
      'Reçete Miktarı': p.yield ? `${p.yield} ${p.yieldUnit || 'adet'}` : '-',
      'Hammadde (TL)': Math.round(rawCost * 100) / 100,
      'Fire %': params.wasteRate,
      'Fire (TL)': Math.round(cb.wasteCost * 100) / 100,
      'Ek Giderler (TL)': Math.round(cb.extraCosts * 100) / 100,
      'KDV %': params.vatRate,
      'KDV (TL)': Math.round(cb.vat * 100) / 100,
      'Toplam Maliyet (TL)': Math.round(cb.totalCost * 100) / 100,
      'Satış Fiyatı (TL)': p.sellingPrice,
      'Kar (TL)': Math.round(profit * 100) / 100,
      'Kar %': `%${profitPct.toFixed(1)}`,
    }
  })
  const prodSheet = XLSX.utils.json_to_sheet(prodData)
  prodSheet['!cols'] = [
    { wch: 20 }, { wch: 12 }, { wch: 15 },
    { wch: 14 }, { wch: 8 }, { wch: 12 },
    { wch: 14 }, { wch: 8 }, { wch: 12 },
    { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 10 },
  ]
  XLSX.utils.book_append_sheet(wb, prodSheet, 'Ürünler')

  XLSX.writeFile(wb, `Mezecim_Maliyet_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
