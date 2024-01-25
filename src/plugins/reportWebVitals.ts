// Ref: https://github.com/GoogleChrome/web-vitals
// Ref: https://web.dev/articles/vitals

import { ReportCallback } from 'web-vitals'

const reportWebVitals = (onPerfEntry: ReportCallback) => {
    if (onPerfEntry) {
        import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
            onCLS(onPerfEntry)
            onFID(onPerfEntry)
            onFCP(onPerfEntry)
            onLCP(onPerfEntry)
            onTTFB(onPerfEntry)
        })
    }
}

export default reportWebVitals
