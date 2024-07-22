import React, { useState, useEffect } from 'react';
import FullCalendar, { EventInput } from '@fullcalendar/react';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import rrulePlugin from '@fullcalendar/rrule';
import { AtandenceDataModel } from './attanfance-sheet';
import { useData } from '@/context/admin/fetchDataContext';

// Function to generate a random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Helper function to format time strings to ISO datetime strings
const formatTimeToDateTime = (timeString: string, date: string) => {
  if (!timeString) return null;
  const [hours, minutes] = timeString.split(':');
  if (!hours || !minutes) return null;
  const dateTime = new Date(`${date}T${hours}:${minutes}:00`);
  return dateTime.toISOString();
};

// Function to map days to RRule compatible weekdays
const mapDayToRRule = (day: string) => {
  const daysMap: { [key: string]: number } = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6,
  };
  return daysMap[day];
};

const generateRecurringEvents = (startDateTime: string, endDateTime: string, day: string, room: string, subject: string) => {
  const events = [];
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);

  const recurrenceEndDate = new Date('2025-06-20');

  while (startDate <= recurrenceEndDate) {
    const event: EventInput = {
      title: subject,
      resourceId: room.trim(),  // Ensure this matches the resources' ids
      start: new Date(startDate),
      end: new Date(endDate),
      backgroundColor: getRandomColor(),
    };
    events.push(event);

    // Move to the same day in the next week
    startDate.setDate(startDate.getDate() + 7);
    endDate.setDate(endDate.getDate() + 7);
  }

  return events;
};

const VerticalResourceView = () => {
  const { classes } = useData();
  const [events, setEvents] = useState<EventInput[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventInput | null>(null);
  const [openCard, setOpenCard] = useState(false);

  // Define resources with exact IDs
  const resources = [
    { id: 'room 1', title: 'Room 1' },
    { id: 'room 2', title: 'Room 2' },
    { id: 'room 3', title: 'Room 3' },
    { id: 'room 4', title: 'Room 4' },
    { id: 'room 5', title: 'Room 5' },
    { id: 'room 6', title: 'Room 6' },
  ];

  useEffect(() => {
    const fetchAndFormatData = async () => {
      console.log('Fetched classes:', classes); // Log the fetched data

      // Use a default date if necessary
      const todayDate = new Date().toISOString().split('T')[0]; // Use today's date

      const formattedEvents = classes.flatMap((classItem) => {
        // Extract groups array
        const groups = classItem.groups || [];
        return groups.flatMap((group) => {
          const { day, start, end, room, subject } = group;

          // Basic validation
          if (!start || !end || !room || !subject) {
            console.error('Missing required event properties:', group);
            return []; // Skip this event if any required property is missing
          }

          // Convert time strings to ISO datetime strings
          const startDateTime = formatTimeToDateTime(start, todayDate);
          const endDateTime = formatTimeToDateTime(end, todayDate);

          if (!startDateTime || !endDateTime) {
            console.error(`Invalid time for event: ${group}`, { start, end });
            return []; // Skip this event if time is invalid
          }

          console.log('Event data:', { title: subject, resourceId: room, start: startDateTime, end: endDateTime });

          return generateRecurringEvents(startDateTime, endDateTime, day, room, subject);
        });
      });

      console.log('Formatted events:', formattedEvents); // Log the formatted events

      setEvents(formattedEvents);
    };

    fetchAndFormatData();
  }, [classes]);

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event);
    setOpenCard(true); // Open the sheet
  };

  return (
    <div>
      <FullCalendar
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'resourceDayGridMonth,resourceTimeGridWeek,resourceTimeGridDay',
        }}
        plugins={[resourceDayGridPlugin, resourceTimeGridPlugin, rrulePlugin]}
        initialDate={new Date()}
        initialView='resourceTimeGridWeek'
        groupByResource={true}
        resources={resources}
        dayMaxEventRows={true}
        editable={true}
        droppable={true}
        events={events}
        slotMinTime="07:00:00"
        slotMaxTime="21:00:00"
        scrollTime="07:00:00" // Set initial scroll time
        resourceAreaWidth="150px" // Adjust resource area width for better horizontal scrolling
        contentHeight="auto" // Set content height to auto for flexibility
        views={{
          resourceTimeGridWeek: {
            scrollable: true, // Enable horizontal scrolling for the week view
            columnHeaderFormat: { weekday: 'short', day: 'numeric' } // Custom format for day title
          }
        }}
        eventClick={handleEventClick} // Add event click handler
      />
      {selectedEvent && (
        <AtandenceDataModel
          open={openCard}
          setOpen={setOpenCard}
          teacher={selectedEvent.extendedProps} // Pass the extendedProps to the sheet
        />
      )}
    </div>
  );
};

export default VerticalResourceView;
