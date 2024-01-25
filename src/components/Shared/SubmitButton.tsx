import React from 'react'

export type BreadcrumbLink = {
    path: string
    label: string
}

const SubmitButton: React.FC<{ label: string }> = (props: { label: string }) => {
    return (
        <button
            type="submit"
            className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
        >
            {props.label ? props.label : 'Submit'}
        </button>
    )
}

export default SubmitButton
