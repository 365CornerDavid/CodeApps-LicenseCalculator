import { useState, useMemo } from 'react'
import type { MonthlyCosts } from './utils/calculations'
import 'bulma/css/bulma.css'
import './App.css'
import { calculateCosts } from './utils/calculations'
import ForecastParameters from './components/ForecastParameters'
import LicenseSelector from './components/LicenseSelector'
import CostComparison from './components/CostComparison'
import MonthlySummary from './components/MonthlySummary'
import CostBreakdownChart from './components/CostBreakdownChart'
import SummaryCards from './components/SummaryCards'

interface ForecastConfig {
  periodDays: number
  dbGrowthMBPerDay: number
}

function App() {
  const [forecast, setForecast] = useState<ForecastConfig>({
    periodDays: 180,
    dbGrowthMBPerDay: 10,
  })

  const [licenses, setLicenses] = useState({
    powerAppsPremium: 0,
    powerAppsPerApp: 0,
    powerAutomatePremium: 0,
    powerAutomateProcess: 0,
    powerAutomateHostedProcess: 0,
    paygUsers: 0,
    paygAppsPerUser: 1,
  })

  const [usage, setUsage] = useState({
    cloudFlowsAttended: 0,
    cloudFlowsUnattended: 0,
    hostedMachineFlows: 0,
    appsWithAccess: 1,
    powerAppsUsers: 0,
  })

  const [paygInitialCapacity, setPaygInitialCapacity] = useState({
    initialDbGB: 1.13,
    initialFileGB: 0.1,
    initialLogGB: 0.05,
  })

  const projectionData = useMemo(
    () => calculateCosts(licenses, forecast, usage, paygInitialCapacity),
    [licenses, forecast, usage, paygInitialCapacity]
  )

  const monthlyCosts = useMemo(
    () => {
      const monthly: MonthlyCosts[] = []
      for (let month = 0; month < Math.ceil(forecast.periodDays / 30); month++) {
        const monthStartDay = month * 30
        const monthEndDay = Math.min((month + 1) * 30, forecast.periodDays)
        const monthData = projectionData.daily.slice(monthStartDay, monthEndDay)
        
        const ualCost = monthData.reduce((sum, d) => sum + d.ualCost, 0)
        const paygCost = monthData.reduce((sum, d) => sum + d.paygCost, 0)

        monthly.push({
          month: month + 1,
          ualCost: Math.round(ualCost * 100) / 100,
          paygCost: Math.round(paygCost * 100) / 100,
          difference: Math.round((ualCost - paygCost) * 100) / 100,
        })
      }
      return monthly
    },
    [projectionData, forecast.periodDays]
  )

  return (
    <div className="app-container">
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Power Platform Licensing Cost Calculator
            </h1>
            <p className="subtitle">
              Compare User Assigned Licensing (UAL) vs Pay-as-you-go (PAYG)
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-3">
              <ForecastParameters
                forecast={forecast}
                onForecastChange={setForecast}
              />
            </div>

            <div className="column is-9">
              <LicenseSelector
                licenses={licenses}
                usage={usage}
                onLicensesChange={setLicenses}
                onUsageChange={setUsage}
                paygInitialCapacity={paygInitialCapacity}
                onPaygCapacityChange={setPaygInitialCapacity}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SummaryCards projectionData={projectionData} />
        </div>
      </section>

        <section className="section">
        <div className="container">
          <CostBreakdownChart data={projectionData.monthlyBreakdown} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MonthlySummary data={monthlyCosts} />
        </div>
      </section>

  

        <section className="section">
        <div className="container">
          <CostComparison projectionData={projectionData} />
        </div>
      </section>
    </div>
  )
}

export default App
