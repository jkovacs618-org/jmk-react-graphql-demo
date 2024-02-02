import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const AlertBox: React.FC<{ message: string; onClose: () => void }> = (props: {
    message: string
    onClose: () => void
}) => {
    return (
        <div
            className="p-4 my-2 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 relative flex"
            role="alert"
        >
            <div className="flex-col">{props.message}</div>
            <div className="flex-col ml-auto">
                <a onClick={props.onClose}>
                    <FontAwesomeIcon
                        icon="times"
                        className="text-lg text-red-800 font-bold cursor-pointer"
                    ></FontAwesomeIcon>
                </a>
            </div>
        </div>
    )
}

export default AlertBox
