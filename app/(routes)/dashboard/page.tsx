import React from 'react'
import WelcomeBanner from './_components/WelcomeBanner'
import FeatureList from './_components/FeatureList'

function Dashboard() {
    return (
        <div>
            {/* welcome banner */}
            <WelcomeBanner/>
            {/* Feature List */}
            <FeatureList/>
        </div>
    )
}

export default Dashboard