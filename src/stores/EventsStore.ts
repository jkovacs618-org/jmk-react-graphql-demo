import { observable, action, computed, makeObservable } from 'mobx'
import { createContext } from 'react'
import { Event, Calendar } from '@/interfaces/interfaces'

class EventsStore {
    events: Event[] = []
    calendars: Calendar[] = []

    constructor() {
        makeObservable(this, {
            events: observable,
            calendars: observable,
            setEvents: action,
            setCalendars: action,
            info: computed,
        })
    }

    get info() {
        return {
            total: this.events.length,
        }
    }

    setEvents = (newEvents: Event[]) => {
        this.events = newEvents
    }

    setCalendars = (newCalendars: Calendar[]) => {
        this.calendars = newCalendars
    }

    getDefaultCalendarExternalId = (): string => {
        const defaultCalendar = this.calendars.find((calendar: Calendar) => calendar.isDefault)
        if (defaultCalendar) {
            return defaultCalendar.externalId ?? ''
        }
        return ''
    }
}

export default createContext(new EventsStore())
