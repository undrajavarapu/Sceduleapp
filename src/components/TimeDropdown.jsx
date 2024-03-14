import React, { useState, useEffect } from 'react';

function TimeDropdown({onDataReceive}) {
  const [currentTime, setCurrentTime] = useState('');
console.log(currentTime)
  useEffect(() => {
    const d = new Date();
    const hour = d.getHours();
    const meridiem = hour >= 12 ? "pm" : "am";
    const formattedHour = ((hour + 11) % 12 + 1);
    setCurrentTime(`${formattedHour}:00 ${meridiem}`);
  }, []);

  function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      // Determine the meridiem
      const meridiem = hour < 12 ? "am" : "pm";
  
      // Format the hour for display
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12; // Adjust display for 12 AM and 12 PM
  
      // Create the display string
      const displayString = `${displayHour}:00 ${meridiem}`;
  
      // Create the value string, potentially converting PM times to 24-hour format
      let valueHour = hour;
      if (meridiem === "pm" && displayHour !== 12) {
          valueHour = displayHour + 12; // Adjust for PM times, except for 12 PM which is already correct
      } else if (meridiem === "am" && displayHour === 12) {
          valueHour = 0; // Adjust for 12 AM to represent 0 hours in 24-hour format
      }
      const valueString = `${valueHour}:00`;
  
      options.push(<option key={hour} value={valueString}>{displayString}</option>);
    }
    return options;
  }
  

  const handleChange = (e) => {
    const selectedTime = e.target.value;
    setCurrentTime(selectedTime); // Update local state
    onDataReceive(selectedTime); // Send the updated time back to the parent component
  };
  return (
    <select value={currentTime} onChange={handleChange}>
      {generateTimeOptions()}
    </select>
  );
}

export default TimeDropdown;
