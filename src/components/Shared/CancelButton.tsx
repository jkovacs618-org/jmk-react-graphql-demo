import React from 'react'
import { Link } from 'react-router-dom'

const CancelButton: React.FC<{label?: string, path: string}> = (props: {label?: string, path: string}) => {
    return (
        <Link to={props.path}> 
            <button
                type="submit"
                className="rounded-md bg-gray-500 hover:bg-gray-400 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 ml-4"
            >
                {props.label ? props.label : 'Cancel'}
            </button>
        </Link>
    )
}

export default CancelButton
