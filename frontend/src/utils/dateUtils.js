
export function formatDateDDMMYYYY(dateStr) {
  if (!dateStr) return 'TBD';
  const s = dateStr.trim();
  if (s.toLowerCase() === 'completed') return 'Completed';
  if (s.toLowerCase() === 'pending') return 'Pending';
  if (s.toLowerCase() === 'in progress') return 'In Progress';
  if (s.toLowerCase() === 'tbd') return 'TBD';

  const match = s.match(/^(\d{4}-\d{2}-\d{2})(?:\s*\((.*?)\))?$/);
  if (match) {
    const [_, datePart, tod] = match;
    const [year, month, day] = datePart.split('-');
    const formattedDate = `${day}/${month}/${year}`;
    return tod && tod !== 'Any Time' ? `${formattedDate} (${tod})` : formattedDate;
  }

  try {
    let cleanStr = s;
    let suffix = '';
    const suffixMatch = s.match(/\((.*?)\)$/);
    if (suffixMatch) {
      cleanStr = s.replace(/\s*\(.*?\)$/, '');
      const tod = suffixMatch[1];
      suffix = tod && tod !== 'Any Time' ? ` (${tod})` : '';
    } else if (s.includes(', ')) {
      const timeMatch = s.match(/,\s*(\d{2}:\d{2}\s*[APM]{2})/i);
      if (timeMatch) {
        cleanStr = s.replace(/,\s*\d{2}:\d{2}\s*[APM]{2}/i, '');
        suffix = `, ${timeMatch[1]}`;
      }
    }

    const timestamp = Date.parse(cleanStr);
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}${suffix}`;
    }
  } catch (e) {
    // ignore
  }

  return dateStr;
}

export function parseEstimatedArrival(estimatedArrival) {
  if (!estimatedArrival || estimatedArrival.toLowerCase() === 'completed' || estimatedArrival.toLowerCase() === 'tbd') {
    return { date: '', timeOfDay: 'Any Time' };
  }

  let datePart = '';
  let timeOfDay = 'Any Time';

  const match = estimatedArrival.match(/^(.*?)(?:\s*\((Morning|Afternoon|Evening|Any Time)\))?$/i);
  if (match) {
    let rawDate = match[1].trim();
    if (match[2]) {
      timeOfDay = match[2];
    }

    const ddmm = rawDate.match(/^(\d{2})[\s\/]+(\d{2})[\s\/]+(\d{4})$/);
    if (ddmm) {
      datePart = `${ddmm[3]}-${ddmm[2]}-${ddmm[1]}`;
    } else {
      const parsed = Date.parse(rawDate);
      if (!isNaN(parsed)) {
        const d = new Date(parsed);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        datePart = `${y}-${m}-${day}`;
      }
    }
  }

  return { date: datePart, timeOfDay };
}
