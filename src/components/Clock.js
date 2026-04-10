import React, { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // CLEANUP FUNCTION — prevents memory leak on unmount
    return () => clearInterval(interval);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  const hours = pad(time.getHours());
  const minutes = pad(time.getMinutes());
  const seconds = pad(time.getSeconds());

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  return (
    <div className="clock-display">
      <div className="clock-time">
        {hours}:{minutes}:<span style={{ opacity: 0.6 }}>{seconds}</span>
      </div>
      <div className="clock-date">{dateStr}</div>
    </div>
  );
}

export default Clock;
