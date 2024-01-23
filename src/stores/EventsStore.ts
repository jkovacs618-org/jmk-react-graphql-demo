import { observable, action, computed, reaction, makeObservable, runInAction } from "mobx"
import { createContext } from "react"
import EventsService from "../services/EventsService";
import CalendarsService from "../services/CalendarsService";
import { Event, Calendar } from '../interfaces/interfaces';

class EventsStore {
    eventsService: EventsService
    calendarsService: CalendarsService

    events: Event[] = []
    loadingEvents: boolean = false;
    loadingEvent: boolean = false;

    pageNumber: number = 1
    status: string = "initial";
    searchQuery: string = "";
    isAscending: boolean = false;

    calendars: Calendar[] = []
    loadingCalendars: boolean = false

    constructor() {
        this.eventsService = new EventsService();
        this.calendarsService = new CalendarsService();

        makeObservable(this, {
            events: observable,
            calendars: observable,
            pageNumber: observable,
            searchQuery: observable,
            isAscending: observable,
            setSearchQuery: action,
            setEvents: action,
            setCalendars: action,
            // getEventsAsyncREST: action,
            // getCalendarsAsyncREST: action,
            // getEventByIdAsyncREST: action,
            // createEventAsyncREST: action,
            // updateEventAsyncREST: action,
            // deleteEventAsyncREST: action,
            info: computed,
        })

        reaction(() => this.events, () => {
            // TBD
        })
    }

    get info() {
        return {
            total: this.events.length,
        }
    }

    setSearchQuery = (value: string) => {
        this.searchQuery = value;
    }

    setEvents = (newEvents: Event[]) => {
        this.events = newEvents;
    }

    setCalendars = (newCalendars: Calendar[]) => {
        this.calendars = newCalendars;
    }

    getEventsAsyncREST = async () => {
        // console.log('Called getEventsAsync')
        try {
            if (this.loadingEvents) {
                return;
            }
            this.loadingEvents = true;

            const params = {
                searchQuery: this.searchQuery,
                pageNumber: String(this.pageNumber),
                isAscending: this.isAscending ? "1" : "0"
            };
            const response = await this.eventsService.get(params);

            runInAction(() => {
                const eventsList = response.data.eventsList;
                // console.log('response.data.eventsList: ', eventsList);
                this.events = eventsList.events;
                this.loadingEvents = false;
            });

        } catch (error) {
            runInAction(() => {
                this.status = "error";
                this.loadingEvents = false;
            });
        }
    };

    getEventByIdAsyncREST = async (externalId: string) => {
        try {
            // console.log('getEventByIdAsync');
            const response = await this.eventsService.getById(externalId);
            if (typeof response.data.event !== 'undefined') {
                return response.data.event;
            }
            return null;
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
            return null;
        }
    }

    getCalendarsAsyncREST = async () => {
        try {
            if (this.loadingCalendars) {
                return;
            }
            this.loadingCalendars = true;

            const response = await this.calendarsService.get()
            runInAction(() => {
                this.calendars = response.data.calendars;
                this.loadingCalendars = false;
            });
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
            this.loadingCalendars = false;
        }
    };

    createEventAsyncREST = async (event: Event, afterCreateCallback: (() => void)) => {
        if (event.title !== '') {
            try {
                const response = await this.eventsService.post(event);
                if (response.status === 200 || response.status === 201) {
                    runInAction(() => {
                        const newEvent = response.data;
                        this.events.push(newEvent)
                        this.status = "success";
                        afterCreateCallback()
                    })
                }
            } catch (error) {
                runInAction(() => {
                    this.status = "error";
                });
            }
        }
    }

    updateEventAsyncREST = async (event: Event, afterUpdateCallback: (() => void)) => {
        if (event.title !== '') {
            try {
                const externalId = event.externalId
                const response = await this.eventsService.put(event)
                if (response.status === 200) {
                    runInAction(() => {
                        // const updatedEvent = response.data;
                        this.status = "success";

                        this.events = this.events.filter(e => {
                            if(e.externalId === externalId) {
                                return event;
                            }
                            return e;
                        })

                        afterUpdateCallback();
                    })
                }
            } catch (error) {
                runInAction(() => {
                    this.status = "error";
                });
            }
        }
    }

    deleteEventAsyncREST = async (externalId: string) => {
        try {
            const response = await this.eventsService.delete(externalId);
            if (response.status === 200 || response.status === 204) {
                runInAction(() => {
                    this.events = this.events.filter(event => event.externalId !== externalId)
                    this.status = "success";
                })
            }
        } catch (error) {
            runInAction(() => {
                this.status = "error";
            });
        }
    }
}

export default createContext(new EventsStore())