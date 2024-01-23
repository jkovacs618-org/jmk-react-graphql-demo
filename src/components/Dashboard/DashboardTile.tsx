import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'

import {
    IconName,
    IconLookup,
    IconDefinition,
    findIconDefinition,
    IconPrefix
  } from '@fortawesome/fontawesome-svg-core'

const DashboardTile: React.FC<{label: string, path: string, prefix: string, icon: string}> = (props) => {
    if (typeof props.prefix === 'undefined') {
        props.prefix = 'fas'
    }
    // Must cast props.icon (string) to IconName (literals, not strings) to avoid TS error.
    // Must cast props.prefix (string) to IconPrefix (literals, not strings) to avoid TS error.
    const iconLookup: IconLookup = { prefix: props.prefix as IconPrefix, iconName: props.icon as IconName }
    const iconDefinition: IconDefinition = findIconDefinition(iconLookup)

    return (
        <Link
            className="tileLink text-gray-600 hover:text-sky-800"
            to={`${props.path}`}
        >
            <div className="dashboard-tile py-6 border border-slate-300 bg-slate-100 hover:bg-sky-50 mr-3 mb-5 w-32 text-center text-xl cursor-pointer">
                <div>
                    <FontAwesomeIcon icon={iconDefinition} className="text-3xl mb-2" />
                </div>
                <div>
                    {props.label}
                </div>
            </div>
        </Link>
    )
}

export default DashboardTile
