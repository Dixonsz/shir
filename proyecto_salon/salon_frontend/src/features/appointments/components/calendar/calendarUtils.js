export function getBusinessHoursRange(settings) {
  const parseTime = (time, fallbackHour, fallbackMinute) => {
    if (!time) return { hour: fallbackHour, minute: fallbackMinute };

    const [hour, minute] = String(time).split(':').map(Number);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return { hour: fallbackHour, minute: fallbackMinute };
    }

    return { hour, minute };
  };

  const start = parseTime(settings?.businessHours?.start, 9, 0);
  const end = parseTime(settings?.businessHours?.end, 18, 30);

  return {
    minTime: new Date(1970, 0, 1, start.hour, start.minute),
    maxTime: new Date(1970, 0, 1, end.hour, end.minute),
  };
}

export function buildCalendarEvents(appointments, clients, members, statusFilter) {
  return appointments
    .filter((appointment) => statusFilter === 'all' || appointment.status === statusFilter)
    .map((appointment) => {
      const client = clients.find((item) => item.id === appointment.client_id);
      const member = members.find((item) => item.id === appointment.member_id);
      const start = new Date(appointment.scheduled_date);

      return {
        id: appointment.id,
        title: client ? client.name : 'Cliente desconocido',
        start,
        end: new Date(start.getTime() + 60 * 60 * 1000),
        resource: appointment,
        status: appointment.status,
        memberName: member ? `${member.first_name} ${member.last_name}` : 'Sin asignar',
      };
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function normalizeDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

export function getDayEvents(events, date) {
  return events.filter((event) => isSameDay(event.start, date));
}
