import React from 'react'
import { useState } from 'react';

import Title from '../components/Title'

const events = [
  {
    title: 'My event',
    allday: true,
    start: new Date(2021, 10, 1),
    end: new Date(2021, 10, 1)
  },
]

const CalendarPage = () => {
    const [allEvents, setAllEvents] = useState(events);  


    return (
    <div className='w-full'>
       <div className='flex items-center mb-4'>
            <Title title='Calendar' />
       </div>
        <div className='w-full'>
       
        </div>
    </div>
  )
}

export default CalendarPage