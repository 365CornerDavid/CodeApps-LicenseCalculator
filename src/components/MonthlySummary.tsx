import type { MonthlyCosts } from '../utils/calculations'

interface Props {
  data: MonthlyCosts[]
}

export default function MonthlySummary({ data }: Props) {
  const totalUAL = data.reduce((sum, m) => sum + m.ualCost, 0)
  const totalPAYG = data.reduce((sum, m) => sum + m.paygCost, 0)
  const totalDifference = totalUAL - totalPAYG

  return (
    <div className="box">
      <h2 className="title is-4">📅 Monthly Cost Summary</h2>

      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              <th>
                <abbr title="Month number">Month</abbr>
              </th>
              <th className="has-text-blue">
                <span className="icon-text">
                  <span className="icon">
                    <i>📘</i>
                  </span>
                  <span>UAL Cost</span>
                </span>
              </th>
              <th className="has-text-green">
                <span className="icon-text">
                  <span className="icon">
                    <i>📗</i>
                  </span>
                  <span>PAYG Cost</span>
                </span>
              </th>
              <th>Better Option</th>
              <th>Savings</th>
            </tr>
          </thead>
          <tbody>
            {data.map((month) => {
              const betterOption = month.difference <= 0 ? 'UAL' : 'PAYG'
              const savings = Math.abs(month.difference)
              
              return (
                <tr key={month.month}>
                  <td>
                    <strong>Month {month.month}</strong>
                  </td>
                  <td className="has-text-blue">
                    <strong>${month.ualCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
                  </td>
                  <td className="has-text-green">
                    <strong>${month.paygCost.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
                  </td>
                  <td>
                    <span
                      className={`tag ${
                        betterOption === 'UAL' ? 'is-info' : 'is-success'
                      }`}
                    >
                      {betterOption}
                    </span>
                  </td>
                  <td className="has-text-weight-semibold">
                    ${savings.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="has-background-light">
              <th>
                <strong>Total</strong>
              </th>
              <th className="has-text-blue">
                <strong>
                  ${totalUAL.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </strong>
              </th>
              <th className="has-text-green">
                <strong>
                  ${totalPAYG.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </strong>
              </th>
              <th>
                <span
                  className={`tag ${
                    totalDifference <= 0 ? 'is-info' : 'is-success'
                  } is-light`}
                >
                  <strong>{totalDifference <= 0 ? 'UAL' : 'PAYG'}</strong>
                </span>
              </th>
              <th className="has-text-weight-semibold">
                <strong>
                  ${Math.abs(totalDifference).toLocaleString('en-US', {
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="notification is-light">
        <strong>Summary:</strong>
        <br />
        Over the forecast period, <strong>{totalDifference <= 0 ? 'UAL' : 'PAYG'}</strong> is{' '}
        <strong>${Math.abs(totalDifference).toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>{' '}
        cheaper overall.
      </div>
    </div>
  )
}