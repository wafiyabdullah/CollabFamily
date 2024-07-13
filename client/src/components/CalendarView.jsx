import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import ModalWrapper from './ModalWrapper'; // Import ModalWrapper component

const CalendarView = ({ tasks, open, setOpen }) => {
  const [hoveredTask, setHoveredTask] = useState(null); // State to track hovered task

  const tileClassName = ({ date }) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const today = moment().format('YYYY-MM-DD');
    return formattedDate === today ? 'cursor-pointer' : null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const dayTasks = tasks.filter(task => moment(task.datelines).format('YYYY-MM-DD') === formattedDate);

      return (
        <ul>
          {dayTasks.map(task => (
            <li
              key={task._id}
              className={`text-xs ${task.status === 'Complete' || task.status === 'Paid' ? 'text-green-500' : 'text-red-500'}`}
              onMouseEnter={() => setHoveredTask(task)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              {task.title}
            </li>
          ))}
        </ul>
      );
    }
  };

  const renderTooltip = () => {
    if (!hoveredTask) return null;

    return (
      <div className="absolute z-10 bg-white p-2 border rounded shadow-md">
        <p><strong>Title:</strong> {hoveredTask.title}</p>
        <p><strong>Priority:</strong> {hoveredTask.priority}</p>
        <p><strong>Deadlines:</strong> {moment(hoveredTask.datelines).format('MMMM Do, YYYY')}</p>
        <p><strong>Description:</strong> {hoveredTask.description || (hoveredTask.amount ? `RM ${hoveredTask.amount}` : '')}</p>
        <p><strong>Created By:</strong> {hoveredTask.created_by.username}</p>
      </div>
    );
  };

  // Inline styles for the calendar
  const calendarStyles = {
    width: '350px',
    maxWidth: '100%',
    background: 'white',
    border: '1px solid #a0a096',
    fontFamily: 'Arial, Helvetica, sans-serif',
    lineHeight: '1.125em',
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className='relative flex pt-3 pb-3 center bg-white'>
        <h3 className='font-semibold text-lg mb-4'>Calendar View</h3>
        <Calendar
          tileClassName={tileClassName}
          tileContent={tileContent}
          style={calendarStyles} // Apply inline styles to Calendar component
        />
        {renderTooltip()}
      </div>
    </ModalWrapper>
  );
};

export default CalendarView;
