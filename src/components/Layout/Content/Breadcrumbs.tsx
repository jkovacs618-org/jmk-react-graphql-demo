import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type BreadcrumbLink = {
    path: string
    label: string
}

const Breadcrumbs: React.FC<{ links: BreadcrumbLink[] }> = (props: { links: BreadcrumbLink[] }) => {
    const firstLinks = props.links.slice(0, props.links.length - 1)
    const lastLink = props.links.slice(-1)[0]

    return (
        <div className="text-slate-500 mb-3">
            {firstLinks.map((link, index) => {
                return (
                    <span key={index}>
                        <Link to={link.path}>{link.label}</Link>
                        <FontAwesomeIcon icon="angle-right" className="mx-2" />
                    </span>
                )
            })}
            {lastLink ? <span>{lastLink.label}</span> : ''}
        </div>
    )
}

export default Breadcrumbs
