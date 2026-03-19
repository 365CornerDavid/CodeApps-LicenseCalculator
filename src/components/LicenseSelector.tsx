interface Licenses {
  powerAppsPremium: number
  powerAppsPerApp: number
  powerAutomatePremium: number
  powerAutomateProcess: number
  powerAutomateHostedProcess: number
  paygUsers: number
  paygAppsPerUser: number
}

interface Usage {
  cloudFlowsAttended: number
  cloudFlowsUnattended: number
  hostedMachineFlows: number
  appsWithAccess: number
  powerAppsUsers: number
}

interface PaygCapacity {
  initialDbGB: number
  initialFileGB: number
  initialLogGB: number
}

interface Props {
  licenses: Licenses
  usage: Usage
  onLicensesChange: (licenses: Licenses) => void
  onUsageChange: (usage: Usage) => void
  paygInitialCapacity: PaygCapacity
  onPaygCapacityChange: (capacity: PaygCapacity) => void
}

export default function LicenseSelector({
  licenses,
  usage,
  onLicensesChange,
  onUsageChange,
  paygInitialCapacity,
  onPaygCapacityChange,
}: Props) {
  return (
    <div>
      {/* UAL Section */}
      <div className="box ual-section">
        <h2 className="title is-4">
          <span className="tag is-info">UAL</span> User Assigned Licensing
        </h2>

        <div className="columns is-multiline">
          {/* Power Apps Licenses */}
          <div className="column is-6">
            <div className="box is-light">
              <h3 className="title is-5">💻 Power Apps</h3>

              <div className="field">
                <label className="label">Number of Apps with Access</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={usage.appsWithAccess}
                    onChange={(e) =>
                      onUsageChange({
                        ...usage,
                        appsWithAccess: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <p className="help">Number of apps users need access to</p>
              </div>

              <div className="field">
                <label className="label">Number of Users</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={usage.powerAppsUsers}
                    onChange={(e) =>
                      onUsageChange({
                        ...usage,
                        powerAppsUsers: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <p className="help">Total users who need Power Apps access</p>
              </div>

              <div className="field">
                <label className="label">Premium (Unlimited Apps) - $20/user/month</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={licenses.powerAppsPremium}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        powerAppsPremium: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Per App Licenses - $5/user-app/month</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={Math.max(0, usage.powerAppsUsers - licenses.powerAppsPremium) * usage.appsWithAccess}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        powerAppsPerApp: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <p className="help">Auto-calculated: (Users - Premium Users) × Apps = {Math.max(0, usage.powerAppsUsers - licenses.powerAppsPremium)} × {usage.appsWithAccess} = {Math.max(0, usage.powerAppsUsers - licenses.powerAppsPremium) * usage.appsWithAccess}</p>
              </div>
            </div>
          </div>

          {/* Power Automate Licenses */}
          <div className="column is-6">
            <div className="box is-light">
              <h3 className="title is-5">⚙️ Power Automate</h3>

              <div className="field">
                <label className="label">Premium - $15/user/month</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={licenses.powerAutomatePremium}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        powerAutomatePremium: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Process (Unattended) - $150/asset/month</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={licenses.powerAutomateProcess}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        powerAutomateProcess: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Hosted Process - $215/asset/month</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={licenses.powerAutomateHostedProcess}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        powerAutomateHostedProcess: Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        ),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYG Section */}
      <div className="box payg-section">
        <h2 className="title is-4">
          <span className="tag is-success">PAYG</span> Pay-as-you-go
        </h2>

        <div className="columns is-multiline">
          <div className="column is-6">
            <div className="box is-light">
              <h3 className="title is-5">👥 Users & Apps</h3>

              <div className="field">
                <label className="label">PAYG Users - $10/user/app/month</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={licenses.paygUsers}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        paygUsers: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Apps per User</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={licenses.paygAppsPerUser}
                    onChange={(e) =>
                      onLicensesChange({
                        ...licenses,
                        paygAppsPerUser: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                  />
                </div>
              </div>

              <div className="notification is-info is-light">
                <strong>Capacity Meters:</strong>
                <br />
                • 1GB DB and 1GB File free per environment
                <br />
                • Log storage: NO free entitlement (all usage billed)
                <br />
                • Daily measurement × (1/30) × monthly rate
                <br />
                • Overages: $48/GB DB, $2.4/GB File, $12/GB Log
              </div>
            </div>
          </div>

          <div className="column is-6">
            <div className="box is-light">
              <h3 className="title is-5">💾 Initial Capacity (GB)</h3>

              <div className="field">
                <label className="label">Initial DB Size (GB)</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paygInitialCapacity.initialDbGB}
                    onChange={(e) =>
                      onPaygCapacityChange({
                        ...paygInitialCapacity,
                        initialDbGB: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <p className="help">Current database size in GB</p>
              </div>

              <div className="field">
                <label className="label">Initial File Size (GB)</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paygInitialCapacity.initialFileGB}
                    onChange={(e) =>
                      onPaygCapacityChange({
                        ...paygInitialCapacity,
                        initialFileGB: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <p className="help">Current file storage size in GB</p>
              </div>

              <div className="field">
                <label className="label">Initial Log Size (GB)</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paygInitialCapacity.initialLogGB}
                    onChange={(e) =>
                      onPaygCapacityChange({
                        ...paygInitialCapacity,
                        initialLogGB: Math.max(0, parseFloat(e.target.value) || 0),
                      })
                    }
                  />
                </div>
                <p className="help">Current log storage size in GB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="columns">
          <div className="column is-6">
            <div className="box is-light">
              <h3 className="title is-5">⚡ Usage (daily average)</h3>

              <div className="field">
                <label className="label">Cloud Flows (Attended) - $0.60/run</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={usage.cloudFlowsAttended}
                    onChange={(e) =>
                      onUsageChange({
                        ...usage,
                        cloudFlowsAttended: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Cloud Flows (Unattended) - $3.00/run</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={usage.cloudFlowsUnattended}
                    onChange={(e) =>
                      onUsageChange({
                        ...usage,
                        cloudFlowsUnattended: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Hosted Machine Flows - $3.00/run</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="0"
                    value={usage.hostedMachineFlows}
                    onChange={(e) =>
                      onUsageChange({
                        ...usage,
                        hostedMachineFlows: Math.max(0, parseInt(e.target.value) || 0),
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}