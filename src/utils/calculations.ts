interface Licenses {
  powerAppsPremium: number
  powerAppsPerApp: number
  powerAutomatePremium: number
  powerAutomateProcess: number
  powerAutomateHostedProcess: number
  paygUsers: number
  paygAppsPerUser: number
}

interface ForecastConfig {
  periodDays: number
  dbGrowthMBPerDay: number
}

interface Usage {
  cloudFlowsAttended: number
  cloudFlowsUnattended: number
  hostedMachineFlows: number
  appsWithAccess: number // Number of apps that users have access to
  powerAppsUsers: number // Total users who need access to Power Apps
}

interface PaygCapacity {
  initialDbGB: number // User-defined initial DB size
  initialFileGB: number
  initialLogGB: number
}

export interface DailyCosts {
  day: number
  dbUsedGB: number
  ualCost: number
  paygCost: number
  difference: number
  bettterOption: 'UAL' | 'PAYG'
}

export interface ProjectionData {
  daily: DailyCosts[]
  totalUALCost: number
  totalPAYGCost: number
  breakEvenDay: number | null
  ualBetterPercentage: number
  paygBetterPercentage: number
  monthlyBreakdown: MonthlyBreakdown[]
}

export interface MonthlyCosts {
  month: number
  ualCost: number
  paygCost: number
  difference: number
}

export interface CostBreakdown {
  powerApps: number
  database: number
  powerAutomate: number
}

export interface MonthlyBreakdown {
  month: number
  ual: CostBreakdown
  payg: CostBreakdown
}

// Licensing pricing
const LICENSES = {
  powerAppsPremium: { price: 20, db: 250, file: 2000, unlimited_apps: true },
  powerAppsPerApp: { price: 5, db: 50, file: 400, apps_per_lic: 1 },
  powerAutomatePremium: { price: 15, db: 250, file: 2000 },
  powerAutomateProcess: { price: 150, db: 50, file: 200 },
  powerAutomateHostedProcess: { price: 215, db: 50, file: 200 },
}

const TENANT_BASE = {
  db: 20 * 1024, // MB
  file: 20 * 1024,
  log: 2 * 1024,
}

const PAYG_PRICING = {
  appPerUser: 10, // Monthly cost per user per app
  dbFreeGB: 1, // Free DB capacity per environment
  fileFreeGB: 1, // Free file capacity per environment
  logFreeGB: 1, // Free log capacity per environment
  dbMeter: 48, // $ per GB over free tier
  fileMeter: 2.4, // $ per GB over free tier
  logMeter: 12, // $ per GB over free tier
  cloudFlowAttended: 0.6, // $ per run
  cloudFlowUnattended: 3.0, // $ per run
  hostedFlow: 3.0, // $ per run
}

// Default initial sizes for PAYG capacity
const DEFAULT_PAYG_INITIAL: PaygCapacity = {
  initialDbGB: 1.13,
  initialFileGB: 0.1,
  initialLogGB: 0.05,
}

export function calculateCosts(
  licenses: Licenses,
  forecast: ForecastConfig,
  usage: Usage,
  paygInitialCapacity: PaygCapacity = DEFAULT_PAYG_INITIAL
): ProjectionData {
  const daily: DailyCosts[] = []
  let ualTotalCost = 0
  let paygTotalCost = 0
  let ualBetterDays = 0

  // Check if UAL has premium licenses (triggers tenant base capacity)
  const hasPremiumLicense =
    licenses.powerAppsPremium > 0 || licenses.powerAutomatePremium > 0

  // Calculate daily costs
  for (let day = 1; day <= forecast.periodDays; day++) {
    const dbUsedGB = (forecast.dbGrowthMBPerDay * day) / 1024

    // ===== UAL COST CALCULATION =====
    let ualCost = 0

    // Base licenses (monthly costs divided by 30 for daily)
    ualCost += (licenses.powerAppsPremium * LICENSES.powerAppsPremium.price) / 30
    // Power Apps Per App: (total Power Apps users - premium users) × apps with access
    const perAppUsers = Math.max(0, usage.powerAppsUsers - licenses.powerAppsPremium)
    ualCost += (perAppUsers * usage.appsWithAccess * LICENSES.powerAppsPerApp.price) / 30
    ualCost += (licenses.powerAutomatePremium * LICENSES.powerAutomatePremium.price) / 30
    ualCost += (licenses.powerAutomateProcess * LICENSES.powerAutomateProcess.price) / 30
    ualCost += (licenses.powerAutomateHostedProcess * LICENSES.powerAutomateHostedProcess.price) / 30

    // Tenant base capacity (only if premium license exists) - no additional cost
    // Database overage (only if using premium licenses and over 20GB)
    let dbOverageGB = 0
    if (hasPremiumLicense && dbUsedGB > TENANT_BASE.db / 1024) {
      dbOverageGB = dbUsedGB - TENANT_BASE.db / 1024
      ualCost += dbOverageGB * 2.4 // $2.4 per GB overages (daily)
    }

    // ===== PAYG COST CALCULATION =====
    let paygCost = 0

    // Per app per user cost (monthly divided by 30 for daily)
    paygCost += (licenses.paygUsers * licenses.paygAppsPerUser * PAYG_PRICING.appPerUser) / 30

    // Capacity overages - Microsoft PAYG billing method
    // Daily measurement: (usage - free entitlement) × (1/30) × monthly rate
    const totalDbGB = paygInitialCapacity.initialDbGB + dbUsedGB
    const totalFileGB = paygInitialCapacity.initialFileGB + (dbUsedGB * 0.1) // Assuming file usage scales with DB
    const totalLogGB = paygInitialCapacity.initialLogGB + (dbUsedGB * 0.05) // Assuming log usage scales with DB

    // Database: overage above 1GB free, billed daily as fraction of monthly rate
    const paygDbOverageGB = Math.max(0, totalDbGB - PAYG_PRICING.dbFreeGB)
    paygCost += paygDbOverageGB * (1/30) * PAYG_PRICING.dbMeter

    // File: overage above 1GB free, billed daily as fraction of monthly rate
    const fileOverageGB = Math.max(0, totalFileGB - PAYG_PRICING.fileFreeGB)
    paygCost += fileOverageGB * (1/30) * PAYG_PRICING.fileMeter

    // Log: NO free entitlement, all usage billed daily as fraction of monthly rate
    paygCost += totalLogGB * (1/30) * PAYG_PRICING.logMeter

    // Flow runs (per day)
    paygCost += usage.cloudFlowsAttended * PAYG_PRICING.cloudFlowAttended
    paygCost += usage.cloudFlowsUnattended * PAYG_PRICING.cloudFlowUnattended
    paygCost += usage.hostedMachineFlows * PAYG_PRICING.hostedFlow

    // Daily costs
    ualCost = Math.round(ualCost * 100) / 100
    paygCost = Math.round(paygCost * 100) / 100

    ualTotalCost += ualCost
    paygTotalCost += paygCost

    if (ualCost <= paygCost) {
      ualBetterDays++
    }

    daily.push({
      day,
      dbUsedGB: Math.round(dbUsedGB * 100) / 100,
      ualCost,
      paygCost,
      difference: Math.round((ualCost - paygCost) * 100) / 100,
      bettterOption: ualCost <= paygCost ? 'UAL' : 'PAYG',
    })
  }

  // Find break-even point (first day where cumulative costs actually cross)
  let breakEvenDay: number | null = null
  let ualCumulative = 0
  let paygCumulative = 0
  let previousUALBetter: boolean | null = null
  
  for (let i = 0; i < daily.length; i++) {
    ualCumulative += daily[i].ualCost
    paygCumulative += daily[i].paygCost
    
    const currentUALBetter = ualCumulative <= paygCumulative
    
    // Break-even is when the better option changes (skip first day to establish baseline)
    if (previousUALBetter !== null && currentUALBetter !== previousUALBetter && breakEvenDay === null) {
      breakEvenDay = i + 1
    }
    
    previousUALBetter = currentUALBetter
  }

  const ualBetterPercentage = Math.round((ualBetterDays / forecast.periodDays) * 100)
  const paygBetterPercentage = 100 - ualBetterPercentage

  // Calculate monthly cost breakdown
  const monthlyBreakdown: MonthlyBreakdown[] = []
  for (let month = 0; month < Math.ceil(forecast.periodDays / 30); month++) {
    const monthStartDay = month * 30
    const monthEndDay = Math.min((month + 1) * 30, forecast.periodDays)
    const monthData = daily.slice(monthStartDay, monthEndDay)

    // UAL breakdown for this month
    let ualPowerApps = 0
    let ualDatabase = 0
    let ualPowerAutomate = 0

    // PAYG breakdown for this month
    let paygPowerApps = 0
    let paygDatabase = 0
    let paygPowerAutomate = 0

    // Calculate UAL components for this month
    const monthDbUsedGB = monthData.length > 0 ? monthData[monthData.length - 1].dbUsedGB : 0

    // UAL Power Apps
    ualPowerApps += (licenses.powerAppsPremium * LICENSES.powerAppsPremium.price) / 30 * monthData.length
    const perAppUsers = Math.max(0, usage.powerAppsUsers - licenses.powerAppsPremium)
    ualPowerApps += (perAppUsers * usage.appsWithAccess * LICENSES.powerAppsPerApp.price) / 30 * monthData.length

    // UAL Power Automate
    ualPowerAutomate += (licenses.powerAutomatePremium * LICENSES.powerAutomatePremium.price) / 30 * monthData.length
    ualPowerAutomate += (licenses.powerAutomateProcess * LICENSES.powerAutomateProcess.price) / 30 * monthData.length
    ualPowerAutomate += (licenses.powerAutomateHostedProcess * LICENSES.powerAutomateHostedProcess.price) / 30 * monthData.length

    // UAL Database overage
    if (hasPremiumLicense && monthDbUsedGB > TENANT_BASE.db / 1024) {
      ualDatabase = (monthDbUsedGB - TENANT_BASE.db / 1024) * 2.4 * monthData.length
    }

    // Calculate PAYG components for this month
    // PAYG Power Apps
    paygPowerApps += (licenses.paygUsers * licenses.paygAppsPerUser * PAYG_PRICING.appPerUser) / 30 * monthData.length

    // PAYG Power Automate (flows)
    paygPowerAutomate += (usage.cloudFlowsAttended * PAYG_PRICING.cloudFlowAttended) * monthData.length
    paygPowerAutomate += (usage.cloudFlowsUnattended * PAYG_PRICING.cloudFlowUnattended) * monthData.length
    paygPowerAutomate += (usage.hostedMachineFlows * PAYG_PRICING.hostedFlow) * monthData.length

    // PAYG Database capacity
    const avgMonthDbGB = monthData.length > 0 ?
      monthData.reduce((sum, d) => sum + (paygInitialCapacity.initialDbGB + d.dbUsedGB), 0) / monthData.length : 0
    const avgMonthFileGB = monthData.length > 0 ?
      monthData.reduce((sum, d) => sum + (paygInitialCapacity.initialFileGB + (d.dbUsedGB * 0.1)), 0) / monthData.length : 0
    const avgMonthLogGB = monthData.length > 0 ?
      monthData.reduce((sum, d) => sum + (paygInitialCapacity.initialLogGB + (d.dbUsedGB * 0.05)), 0) / monthData.length : 0

    paygDatabase += Math.max(0, avgMonthDbGB - PAYG_PRICING.dbFreeGB) * (1/30) * PAYG_PRICING.dbMeter * monthData.length
    paygDatabase += Math.max(0, avgMonthFileGB - PAYG_PRICING.fileFreeGB) * (1/30) * PAYG_PRICING.fileMeter * monthData.length
    paygDatabase += Math.max(0, avgMonthLogGB - PAYG_PRICING.logFreeGB) * (1/30) * PAYG_PRICING.logMeter * monthData.length

    monthlyBreakdown.push({
      month: month + 1,
      ual: {
        powerApps: Math.round(ualPowerApps * 100) / 100,
        database: Math.round(ualDatabase * 100) / 100,
        powerAutomate: Math.round(ualPowerAutomate * 100) / 100,
      },
      payg: {
        powerApps: Math.round(paygPowerApps * 100) / 100,
        database: Math.round(paygDatabase * 100) / 100,
        powerAutomate: Math.round(paygPowerAutomate * 100) / 100,
      },
    })
  }

  return {
    daily,
    totalUALCost: Math.round(ualTotalCost * 100) / 100,
    totalPAYGCost: Math.round(paygTotalCost * 100) / 100,
    breakEvenDay,
    ualBetterPercentage,
    paygBetterPercentage,
    monthlyBreakdown,
  }
}