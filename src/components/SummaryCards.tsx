import type { ProjectionData } from '../utils/calculations'

interface Props {
  projectionData: ProjectionData
}

export default function SummaryCards({ projectionData }: Props) {
  const totalSavings =
    Math.abs(projectionData.totalUALCost - projectionData.totalPAYGCost).toFixed(2)
  const betterOption =
    projectionData.totalUALCost < projectionData.totalPAYGCost ? 'UAL' : 'PAYG'
  const betterPercentage =
    betterOption === 'UAL'
      ? projectionData.ualBetterPercentage
      : projectionData.paygBetterPercentage

  return (
    <div className="columns">
      <div className="column is-4">
        <div className="box ual-card">
          <p className="heading">UAL Total Cost</p>
          <p className="title is-3 has-text-info">
            ${projectionData.totalUALCost.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="help">
            Better {projectionData.ualBetterPercentage}% of the time
          </p>
        </div>
      </div>

      <div className="column is-4">
        <div className="box payg-card">
          <p className="heading">PAYG Total Cost</p>
          <p className="title is-3 has-text-success">
            ${projectionData.totalPAYGCost.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </p>
          <p className="help">
            Better {projectionData.paygBetterPercentage}% of the time
          </p>
        </div>
      </div>

      <div
        className={`column is-4 box ${
          betterOption === 'UAL'
            ? 'has-background-info-light'
            : 'has-background-success-light'
        }`}
      >
        <p className="heading">Total Savings</p>
        <p className="title is-3">
          ${totalSavings}
        </p>
        <p className="help">
          <strong>{betterOption}</strong> is better ({betterPercentage}% of period)
        </p>
      </div>
    </div>
  )
}