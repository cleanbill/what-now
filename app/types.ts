
export type Eater = {
    uuid: string,
    name: string
}

export type Ingredient = {
    uuid: string,
    name: string,
}

export type Order = {
    uuid: string,
    name: string,
    description: string,
    ingredients: Array<Ingredient>
}

export type Cover = {
    order: Order,
    eater: Eater
}

export type Meal = {
    uuid: string,
    name: string
    from: Date,
    to: Date,
    seats: Array<Cover>
}

export enum EventType {
    Gig = "Gig",
    Event = "Event",
    Task = "Task",
    Hobbie = "Hobbie",
    Meal = "Meal"
}

export const TYPE_COLOURS: Record<string, string> = {
    [EventType.Meal]: '#3b82f6',   // Bold Blue
    [EventType.Task]: '#fbbf24',   // Amber Yellow
    [EventType.Hobbie]: '#a855f7',  // Vibrant Purple
    [EventType.Gig]: '#f43f5e',    // Rose Red
    [EventType.Event]: '#10b981',  // Emerald Green
};


export enum Period {
    Day = "Day",
    Week = "Week",
    Month = "Month",
    Year = "Year"
}

export type Repeat = {
    period: Period,
    qty: number
}

export type DayEvent = {
    uuid: string,
    type: EventType,
    name: string,
    description: string,
    url: string,
    from: Date,
    to: Date,
    complete: Date | null,
    repeat: Repeat | null,
    notes: []
}
1
export enum DayName {
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
    Sunday = "Sunday"
}

export type Day = {
    uuid: string,
    name: DayName,
    intent: string,
    meals: Array<Meal>
    events: Array<DayEvent>
}

export enum SetupPhase {
    INTENT = 'INTENT',
    MEALS = 'MEALS',
    EVENTS = 'EVENTS',
    REVIEW = 'REVIEW'
}

// Defaults

export const Monday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Monday,
    intent: "Adjust",
    meals: [],
    events: []
}

export const Tuesday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Tuesday,
    intent: "Hobbie",
    meals: [],
    events: []
}
export const Wednesday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Wednesday,
    intent: "Admin",
    meals: [],
    events: []
}

export const Thursday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Thursday,
    intent: "Training",
    meals: [],
    events: []
}
export const Friday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Friday,
    intent: "Fun",
    meals: [],
    events: []
}

export const Saturday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Saturday,
    intent: "Explore",
    meals: [],
    events: []
}

export const Sunday: Day = {
    uuid: crypto.randomUUID(),
    name: DayName.Sunday,
    intent: "Plan",
    meals: [],
    events: []
}

export const defaultWeek = [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]