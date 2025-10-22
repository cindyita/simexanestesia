const FormatDate = (dateString, showTime) => {

  const normalizedDate = dateString.endsWith('Z')
    ? dateString
    : dateString.replace(' ', 'T') + 'Z';

  const date = new Date(normalizedDate);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (showTime) {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: userTimeZone,
    });
  } else {
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: userTimeZone,
    });
  }
};

export { FormatDate };
