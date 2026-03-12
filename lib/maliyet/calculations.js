export function calculateProductCost(product, materials) {
  return product.materials.reduce((total, pm) => {
    const material = materials.find(m => m.id === pm.materialId)
    if (!material) return total
    return total + material.unitPrice * pm.quantity
  }, 0)
}

export function getProductCostParams(product, settings) {
  return {
    wasteRate: product.wasteRate ?? settings?.defaultWasteRate ?? 0,
    extraCosts: product.extraCosts ?? settings?.defaultExtraCosts ?? 0,
    vatRate: product.vatRate ?? settings?.defaultVatRate ?? 0,
  }
}

export function calculateFullCost(rawCost, wasteRate, extraCosts, vatRate) {
  const wasteCost = rawCost * (wasteRate / 100)
  const subtotal = rawCost + wasteCost + extraCosts
  const vat = subtotal * (vatRate / 100)
  const totalCost = subtotal + vat
  return { rawCost, wasteCost, extraCosts, vat, totalCost }
}

export function calculateProfit(sellingPrice, totalCost) {
  return sellingPrice - totalCost
}

export function calculateProfitPercentage(sellingPrice, totalCost) {
  if (totalCost === 0) return 0
  return ((sellingPrice - totalCost) / totalCost) * 100
}

export function calculateUnitCost(totalCost, yieldAmount) {
  if (!yieldAmount || yieldAmount <= 0) return totalCost
  return totalCost / yieldAmount
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount)
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
