import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CostBreakdown {
  powerApps: number
  database: number
  powerAutomate: number
}

interface MonthlyBreakdown {
  month: number
  ual: CostBreakdown
  payg: CostBreakdown
}

interface Props {
  data: MonthlyBreakdown[]
}

export default function CostBreakdownChart({ data }: Props) {
  // Transform data for stacked bar chart
  const chartData = data.map(month => ({
    month: `Month ${month.month}`,
    'UAL - Power Apps': month.ual.powerApps,
    'UAL - Database': month.ual.database,
    'UAL - Power Automate': month.ual.powerAutomate,
    'PAYG - Power Apps': month.payg.powerApps,
    'PAYG - Database': month.payg.database,
    'PAYG - Power Automate': month.payg.powerAutomate,
  }))

  return (
    <div className="box">
      <h2 className="title is-4">📊 Monthly Cost Breakdown</h2>
      <p className="help has-text-grey">
        Detailed breakdown showing where licensing costs come from for each option
      </p>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value) => `$${Number(value).toFixed(2)}`}
          />
          <Legend />
          {/* UAL bars */}
          <Bar dataKey="UAL - Power Apps" stackId="ual" fill="#3273dc" />
          <Bar dataKey="UAL - Database" stackId="ual" fill="#209cee" />
          <Bar dataKey="UAL - Power Automate" stackId="ual" fill="#92c5f0" />
          {/* PAYG bars */}
          <Bar dataKey="PAYG - Power Apps" stackId="payg" fill="#48c774" />
          <Bar dataKey="PAYG - Database" stackId="payg" fill="#23d160" />
          <Bar dataKey="PAYG - Power Automate" stackId="payg" fill="#9ce6a6" />
        </BarChart>
      </ResponsiveContainer>

      <div className="content is-small mt-4">
        <div className="columns">
          <div className="column">
            <h4 className="has-text-blue">📘 UAL Components</h4>
            <ul>
              <li><strong>Power Apps:</strong> Premium user licenses</li>
              <li><strong>Database:</strong> Overage costs (above tenant base)</li>
              <li><strong>Power Automate:</strong> Premium user licenses</li>
            </ul>
          </div>
          <div className="column">
            <h4 className="has-text-green">📗 PAYG Components</h4>
            <ul>
              <li><strong>Power Apps:</strong> Per user per app consumption</li>
              <li><strong>Database:</strong> Storage capacity costs</li>
              <li><strong>Power Automate:</strong> Per run consumption</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}