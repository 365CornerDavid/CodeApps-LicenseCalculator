interface ForecastConfig {
  periodDays: number
  dbGrowthMBPerDay: number
}

interface Props {
  forecast: ForecastConfig
  onForecastChange: (config: ForecastConfig) => void
}

export default function ForecastParameters({
  forecast,
  onForecastChange,
}: Props) {
  return (
    <div className="box">
      <h2 className="title is-4">📊 Forecast Parameters</h2>

      <div className="field">
        <label className="label">Forecast Period (days)</label>
        <div className="control">
          <input
            className="input"
            type="number"
            min="1"
            max="730"
            value={forecast.periodDays}
            onChange={(e) =>
              onForecastChange({
                ...forecast,
                periodDays: Math.max(1, parseInt(e.target.value) || 1),
              })
            }
          />
        </div>
        <p className="help">Evaluation period in days (default: 180)</p>
      </div>

      <div className="field">
        <label className="label">DB Growth (MB/day)</label>
        <div className="control">
          <input
            className="input"
            type="number"
            min="0"
            step="1"
            value={forecast.dbGrowthMBPerDay}
            onChange={(e) =>
              onForecastChange({
                ...forecast,
                dbGrowthMBPerDay: Math.max(0, parseFloat(e.target.value) || 0),
              })
            }
          />
        </div>
        <p className="help">Daily database growth rate</p>
      </div>

      <div className="notification is-light is-info">
        <strong>Total DB at forecast end:</strong>
        <br />
        {(forecast.dbGrowthMBPerDay * forecast.periodDays / 1024).toFixed(2)} GB
      </div>
    </div>
  )
}