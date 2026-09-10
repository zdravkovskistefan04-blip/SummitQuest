export function calculateTrailStats(completedTrails = []) {
  const totalDistanceKm = completedTrails.reduce((total, trail) => {
    const distance = Number.parseFloat(String(trail.distance || trail.distanceKm || 0).replace(',', '.'))
    return total + (Number.isFinite(distance) ? distance : 0)
  }, 0)

  return {
    completedCount: completedTrails.length,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1))
  }
}
