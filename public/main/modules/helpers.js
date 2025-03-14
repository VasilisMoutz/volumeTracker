export function secondsConverter(seconds) {

  const h = Math.floor(seconds / 3600);
  const m = ( Math.floor((seconds % 3600 ) / 60));
  const s = Math.floor((seconds % 3600 ) % 60);
  
  return {
    hours: h,
    minutes: m,
    seconds: s
  }
}

export function monthsConverter(month, form) {

  const isMonth = Number.isInteger(month) && month <= 11 && month >= 0;
  const hasForm = form === 'short' || form === 'long';

  if (!isMonth || !hasForm) {
    return;
  }

  const monthsLong = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };

  const monthsShort = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec'
  };

  return form === 'short' ? monthsShort[month] : monthsLong[month];
}

export async function getProjects(useCache) {

  const url = useCache ? `/api/projects/get?cached=${useCache}` : '/api/projects/get';
  try {
    const response = await fetch(url, {method: 'GET'});
    if (response.ok) {
      const result = await response.json();
      return result;
    }
    else if (response.statusText === 'No token found') {
      location.reload();
    }
    else { 
      console.error('Error:', response.statusText);
    }
  } catch (err) {
    console.log(err);
  }
}