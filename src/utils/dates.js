export const parseDateObj = (val) => {
  if (!val) return new Date();
  if (typeof val.toDate === 'function') return val.toDate();
  return new Date(val);
};

export const formatDate = (date, lang = 'es') => {
  if (!date) return '';
  const d = parseDateObj(date);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
};

export const formatTime = (date, lang = 'es') => {
  if (!date) return '';
  const d = parseDateObj(date);
  return d.toLocaleTimeString(lang === 'en' ? 'en-US' : 'es-MX', { hour: '2-digit', minute: '2-digit' });
};

export const toISOStringLocal = (d) => {
  const z = n => ('0' + n).slice(-2);
  let off = d.getTimezoneOffset();
  off = Math.abs(off);
  return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + 'T' + z(d.getHours()) + ':' + z(d.getMinutes());
};

export const checkOverlap = (start1, end1, start2, end2) => start1 < end2 && start2 < end1;