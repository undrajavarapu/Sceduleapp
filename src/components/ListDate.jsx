import React, { useState } from 'react';


function ListDate({onDateReceive}) {
    const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [selectedDays, setSelectedDays] = useState([]);

    const toggleDaySelection = (day) => {
        if (selectedDays.includes(day)) {
            // If the day is already selected, remove it from the array
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            // Otherwise, add the day to the array
            setSelectedDays([...selectedDays, day]);
        }
        onDateReceive(selectedDays.toString());
    };

    // Inline styles
    const ulStyle = {
        display: 'flex',
        listStyleType: 'none',
        padding: 0,
    };

    
    

    const liStyle = (day) => ({
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '24px',
        height: '24px',
        margin: '5px',
        borderRadius: '60%',
        borderWidth: '1px', // Set the border width
        borderStyle: 'solid', // Set the border style
        borderColor: '#3C1E5A1A', // Set the border color
        backgroundColor: selectedDays.includes(day) ? '#000000' : '#FFFFFF', // Changes color if selected
        fontSize: '0.8rem',
        cursor: 'pointer',
    });
    
    

    return (
        <div value={selectedDays}>
        <ul style={ulStyle}>
            {dates.map(day => (
                <li key={day} style={liStyle(day)} onClick={() => toggleDaySelection(day)}>
                    {day.substring(0, 2)}
                </li>
            ))}
        </ul>
        </div>
    );
}

export default ListDate