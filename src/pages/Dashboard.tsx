import React from 'react'
import DashboardTile from '../components/Dashboard/DashboardTile'

const Dashboard: React.FC = () => {
    return (
        <div className="relative flex flex-col">
            <h2 className="text-3xl text-slate-600 font-bold">Dashboard</h2>

            <div className="flex items-center mt-6">
                <div className="flex gap-4">
                    <DashboardTile path="/family" label="Family" prefix="fas" icon="people-roof" />
                    <DashboardTile
                        path="/events"
                        label="Events"
                        prefix="far"
                        icon="calendar-days"
                    />
                    <DashboardTile
                        path="/services"
                        label="Accounts"
                        prefix="fas"
                        icon="building-user"
                    />
                </div>
            </div>
        </div>
    )
}

export default Dashboard
