import React, { useContext, useState } from 'react'
import AppContext from './context/AppContext'
import WeekContext from './context/WeekContext'
import Day from './Day'

function Week({ startDate, endDate }) {
    const { registrations } = useContext(AppContext)
    const [hover, setHover] = useState(-1)

    // Array to store the title of the days
    const dayTitles = [<th key="0"></th>]

    // For every day of the week...
    for (let x = 0; x < 7; x++) {
        // Create the day's date
        const dayDate = new Date(startDate)
        dayDate.setDate(dayDate.getDate() + x)

        // Use the Intl API to format
        const formattedDayDate = new Intl.DateTimeFormat('nl-NL', {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
        }).format(dayDate)

        // Add to the array
        dayTitles.push(
            <th key={dayDate.getTime()} className="week-cell-header">
                {formattedDayDate}
            </th>
        )
    }

    const formattedStartDate = new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
    }).format(startDate)

    const formattedEndDate = new Intl.DateTimeFormat('nl-NL', {
        day: 'numeric',
        month: 'long',
    }).format(endDate)

    // Array to store the hours
    let hours = []

    // For every hour in a day...
    for (let i = 0; i < 24; i++) {
        // Create a new date that will increase by the hour
        const hourDate = new Date(startDate).setHours(i)

        // Array to store the days
        let days = []

        // Every day starts with a cell that contains the hour notation
        days.push(
            <td key={i} className={`week-hour${hover === i ? ` bg-light` : ``}`}>
                {i}.00 - {i + 1}.00
            </td>
        )

        // For every day in a week...
        for (let j = 0; j < 7; j++) {
            // Create the day date which is derived from the hour date
            const dayDate = new Date(hourDate)
            dayDate.setDate(dayDate.getDate() + j)

            // Find registrations on this date
            const filteredRegistrations = registrations.filter(registration => {
                // Time is stored in the Firestore by seconds.
                // Multiply by 1000 to create a date in milliseconds.
                const registrationDate = new Date(registration.date.seconds * 1000)
                // Return the date if a match is found, else filter
                return registrationDate.getTime() === dayDate.getTime() ? registrationDate : false
            })

            // Render a column for every day
            days.push(
                <Day
                    key={dayDate.getTime()}
                    date={dayDate}
                    hour={i}
                    registrations={filteredRegistrations}
                />
            )
        }

        // Render a row for every hour
        hours.push(<tr key={i}>{days}</tr>)
    }

    return (
        <WeekContext.Provider value={{ setHover }}>
            <h2 className="text-center">{`${formattedStartDate} - ${formattedEndDate}`}</h2>
            <table className="week">
                <thead className="week-header">
                    <tr>{dayTitles}</tr>
                </thead>
                <tbody className="week-body">{hours}</tbody>
            </table>
        </WeekContext.Provider>
    )
}

export default Week