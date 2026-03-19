import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts'
import type { ProjectionData, DailyCosts } from '../utils/calculations'

interface Props {
  projectionData: ProjectionData
}

export default function CostComparison({ projectionData }: Props) {
  // Sample every Nth day for chart readability
  const sampleRate = Math.max(1, Math.ceil(projectionData.daily.length / 50))
  const chartData = projectionData.daily
    .filter((_, i) => i % sampleRate === 0)
    .map((d) => ({
      day: d.day,
      UAL: d.ualCost,
      PAYG: d.paygCost,
      dbUsedGB: d.dbUsedGB,
    }))

  return (
    <div>
      {/* Break-even Point */}
      {projectionData.breakEvenDay && (
        <div className="box has-background-warning-light">
          <h3 className="title is-5">📍 Break-even Point</h3>
          <p>
            Better option changes around <strong>day {projectionData.breakEvenDay}</strong> of
            the forecast period
          </p>
        </div>
      )}

      {/* Daily Cost Chart */}
      <div className="box">
        <h3 className="title is-5">📈 Daily Cost Comparison</h3>
        <p className="help has-text-grey">
          Shows daily licensing costs. Note: Daily cost crossovers may differ from cumulative break-even points.
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Daily Cost ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => `$${Number(value).toFixed(2)}`}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="UAL"
              stroke="#3273dc"
              strokeWidth={2}
              isAnimationActive={false}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="PAYG"
              stroke="#48c774"
              strokeWidth={2}
              isAnimationActive={false}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Cumulative Cost Chart */}
      <div className="box">
        <h3 className="title is-5">💰 Cumulative Cost Over Time</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={buildCumulativeData(projectionData.daily, sampleRate)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'Total Cost ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value) => `$${Number(value).toFixed(2)}`}
              labelFormatter={(label) => `Day ${label}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="UALCumulative"
              stroke="#3273dc"
              strokeWidth={2}
              name="UAL Cumulative"
              isAnimationActive={false}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="PAYGCumulative"
              stroke="#48c774"
              strokeWidth={2}
              name="PAYG Cumulative"
              isAnimationActive={false}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function buildCumulativeData(
  daily: DailyCosts[],
  sampleRate: number
) {
  let ualSum = 0
  let paygSum = 0

  return daily
    .map((d, i) => {
      ualSum += d.ualCost
      paygSum += d.paygCost
      return {
        day: d.day,
        UALCumulative: Math.round(ualSum * 100) / 100,
        PAYGCumulative: Math.round(paygSum * 100) / 100,
        index: i
      }
    })
    .filter((_, i) => i % sampleRate === 0)
}