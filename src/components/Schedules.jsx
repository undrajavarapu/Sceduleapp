import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { FaBeer } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import Modal from 'react-bootstrap/Modal';
import TimeDropdown from './TimeDropdown';
import Container from 'react-bootstrap/Container';
import ListDate from './ListDate';

function Schedules() {
  const [count,setCount]=useState(0)
  const [schedules, setSchedules] = useState([]);
  const [state,setData]=useState({
    title:'',description:'',subject:'',frequency:'',repeat:'',time:''
  })

  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
// console.log(schedules)
  useEffect(() => {
    // Fetch data from an API
   axios.get('http://localhost:8080/api/schedule')
      
      .then(
        (result) => 
   
        setSchedules(result.data)
        )
      .catch((error) => console.error('Error fetching data:', error));
  }, [count]); // Empty dependency array means this effect runs once after the initial render
const handleSave = (savedItem) => {
    // Perform save operation (POST or PUT)
  //  console.log('Saving item:', savedItem);
    setCount(prevCount => prevCount + 1);
    handleClose(); // Close the modal
  };

  const handleEdit = (scheduleId,row) => {
    setShow(true)
    setCurrentItem(scheduleId); // Set the item to be edited
    setData(row)
    setType(1)
    const updatedData = {
      title: state.title,
      description: state.description,
      subject: state.subject,
      frequency: state.frequency,
      repeat: state.repeat,
      time: state.time
    };
    setShowModal(true); // Open the modal
    
    // console.log('Editing:',scheduleId);
    // axios.put(`http://localhost:8080/api/schedule/${scheduleId}`,updatedData)
    // .then(result => {
    //   setData({ ...state,...result})
    //   console.log('Editing:', result);
    // })
    // .catch(error => console.error('Error fetching data:', error));
    // Add your edit logic here
  };

  // Function to handle the click event on the delete button
  const handleDelete = (scheduleId) => {
    axios.delete(`http://localhost:8080/api/schedule/${scheduleId}`)
      .then(result => {
        setCount(prevCount => prevCount + 1); // Increment the count
        console.log('Deleting:', result);
      })
      .catch(error => console.error('Error fetching data:', error));
  };
  
  function formatRow(row) {
    let repeatText = row.repeat  ? `${row.repeat} ` : '';

    // Ensure row.time is a number and normalize it to a 24-hour format
    let hour24 = parseInt(row.time, 10) % 24;
    let period = hour24 >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour format
    // Note: converts 0 to 12 for midnight, handles noon correctly
    let hour12 = hour24 % 12;
    hour12 = hour12 === 0 ? 12 : hour12; // Convert 0 to 12 for 12 AM

    // Format the time text
    let timeText = `at ${hour12} ${period}`;

    // Compile and return the formatted string
    return `${row.frequency} ${repeatText} ${timeText}`.trim();
}



  const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Description',
      selector: row => row.description,
      sortable: true,
    },
    {
      name: 'Subject',
      selector: row => row.subject,
      sortable: true,
    },
    {
      name: 'Schedule',
      selector: row => formatRow(row),
      sortable: true,
    },
    {
      name: 'Actions',
      button: true,
      cell: (row) => (
        <>
        
        {/* <Modalv
        show={showModal}
        handleClose={handleClose}
        onSave={handleSave}
        itemToEdit={currentItem}
      /> */}
        <button className="btn" onClick={()=>handleEdit(row.id,row)} style={{ marginRight: '5px' }}><CiEdit /></button>
          <button  className="btn" variant="danger" onClick={() => handleDelete(row.id)}><MdDelete /></button>
        </>),
    },
  ];

  const [show, setShow] = useState(false);
  const [modalshow, setModalShow] = useState(false);

  const handleClose = () => {setShow(false)
  setShowModal(false)};
  const handleShow = () => setShow(true);



  const handlefreqChange = (e) => {
    //setFrequency(e.target.value);
    setData({ ...state, [e.target.name]: e.target.value })
  
  };

  const handlerepeatChange = (e) => {
    setData({ ...state, [e.target.name]: e.target.value })
    // setState("");
    // setCity("");
  };

  const handleSearch = (e) => {
    e.preventDefault()

    const k=e.target.value;

    axios.get(`http://localhost:8080/api/schedule?search=${k}`)
    .then(
      (result) => 
 
      setSchedules(result.data)
      )
    .catch((error) => console.error('Error fetching data:', error));

  };

  const handleChange=(e)=>{
    setData({ ...state, [e.target.name]: e.target.value })
}
const handleTimeReceive = (time) => {
  setData({ ...state, time:(time )})

  
  console.log("Selected Time:", time); 
};
const handleDateReceive =(repeat)=>{
  setData({ ...state, repeat:(repeat )})
}
const handleSubmit=(e)=>{
    //setname(e.target.value)
   // debugger
const k=currentItem;
console.log(k);
    e.preventDefault() 
    if(type==0){
      axios.post('http://localhost:8080/api/schedule',state)
    .then(
      (result)=>
     {

      setCount(prevCount => prevCount + 1); 
      handleClose();
     } 
      //console.log(result)
      )
    .catch((error) => console.error('Error fetching data:', error));
    }

    if(type==1){
      axios.patch(`http://localhost:8080/api/schedule/${k}`,state)
    .then(
      (result)=>
     {

      setCount(prevCount => prevCount + 1); 
      handleClose();
     } 
      //console.log(result)
      )
    .catch((error) => console.error('Error fetching data:', error));
    }
    

}
const [type,setType]=useState(0)

document.querySelectorAll('.day-option').forEach(item => {
  item.addEventListener('click', function() {
    // Remove 'selected' class from all options
    document.querySelectorAll('.day-option').forEach(div => {
      div.classList.remove('selected');
    });
    // Add 'selected' class to clicked option
    this.classList.add('selected');
    // Update hidden input value
    document.getElementById('selectedDay').value = this.getAttribute('data-value');
  });
});


  return (
  
<div className="container" style={{marginLeft:'5%',marginTop:'2%'}}>

<Modal className=" modal-sm" show={show} type={type} onHide={handleClose} backdrop={false} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-18%, -50%)'}}>
  

        <Modal.Body>
        Add Schedule
          <Container>

        <form onSubmit={handleSubmit} className="compact-form">
        <div className="d-flex justify-content-center">
            <label for="title" className="col-form-label col-4">Title:</label>
            <div className="col-8">
            <input type="text"  onChange={handleChange} name="title" value={state.title} />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <label for="description" className="ol-form-label col-4">Description:</label>
            <div className="col-8">
            <textarea onChange={handleChange}  name="description" value={state.description} />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <label for="subject" className="col-form-label col-4">Subject:</label>
            <div className="col-8">
            <input type="text" onChange={handleChange}  name="subject" value={state.subject} />
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <label for="frequency" className="col-form-label col-4">Frequency:</label>
            <div className="col-8">
            <label  Htmlfor="frequency" className="form-label" onChange={handlefreqChange} value={state.frequency}>
          
          <select className="dropdown" name="frequency">
          <option disabled="disabled">----</option>
        <option value="Monthly">Monthly</option>
        <option value="Weekly">Weekly</option>
        <option value="Daily">Daily</option>
      </select>
      </label>
            </div>
          </div>

          <div className="d-flex justify-content-center">
          {state.frequency !== "Daily" && (<label for="frequency"  className="col-form-label col-4 ">Repeat:</label>)}
            <div className="col-8 " style={{ width: '200px', height: '40px' }} >
            {state.frequency !== "Daily" && (
          <label htmlFor="exampleFormControlInput1" className="form-label col-4 ">
            
              {state.frequency === "Monthly" && (
                <select className="form-control  col-8"  name="repeat" onChange={handlerepeatChange} value={state.repeat}>
                <>
                <option disabled="disabled">----</option>
                  <option key="first monday">first monday</option>
                  <option key="last friday">last friday</option>
                </>
                </select>
              )}
              {state.frequency === "Weekly" && (
                <div className="col-8" ><ListDate  onDateReceive={handleDateReceive} /></div>
                // <>
                //   <option key="Monday" value="Monday">M</option>
                //   <option key="Tuesday" value="Tuesday">T</option>
                //   <option key="Wednesday" value="Wednesday">W</option>
                //   <option key="Thursday" value="Thursday">T</option>
                //   <option key="Friday" value="Friday">F</option>
                //   <option key="Saturday" value="Saturday">S</option>
                //   <option key="Sunday" value="Sunday">Su</option>
                // </>
//                 <>
//                 <div id="dayPicker">
//   <div className="day-option" data-value="Monday">M</div>
//   <div className="day-option" data-value="Tuesday">T</div>
//   <div className="day-option" data-value="Wednesday">W</div>
//   <div className="day-option" data-value="Thursday">T</div>
//   <div className="day-option" data-value="Friday">F</div>
//   <div className="day-option" data-value="Saturday">S</div>
//   <div className="day-option" data-value="Sunday">Su</div>
// </div>
// <input type="hidden" id="selectedDay" name="selectedDay"/>

//                 </>
              )}
           
          </label>
        )}
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <label for="currenttime" className="col-form-label col-4">Time:</label>
            <div className="col-8">
                
            <TimeDropdown onDataReceive={handleTimeReceive} />
           
            </div>
          </div> 
  {/* <p>Selected time: {selectedTime}</p> */}
        {/* <button type='submit'>submit</button> */}

        
    </form>
    
    
    </Container>
        
        </Modal.Body>
        
        <div className="d-flex justify-content-end">
    <Button className="m-2" variant="secondary" onClick={handleClose}>
        Cancel
    </Button>
    <Button className="m-2" onClick={handleSubmit}>
        Done
    </Button>
</div>

        
      </Modal>
 {/* <Modalv 
 shouldShow={showModal}
 onRequestClose={() => {
   setshowModal((prev) => !prev);
 }}
 >
 <div>Your Modal</div>

 </Modalv> */}
      <Form >
        <Row>
          <Col  md={4}>
            <Form.Control
              type="text"
              placeholder="Search"
              onChange={handleSearch}
            
            />
          </Col>
          <Col md={{ span: 4, offset: 4 }} > 
          <Button   style=
          {{marginLeft:'80%', backgroundColor: "#391e5a"}} onClick={handleShow}><IoIosAddCircleOutline />Add</Button>
          
          </Col>
          
        </Row>
      </Form>
    {/* <ul>
          {schedules.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul> */}

        <div className="container-fluid " style={{overlowX:'hidden'}}><DataTable
        title="Schedules"
        columns={columns}
        data={schedules}
       
        style={{marginTop:"2%"}}
      /></div>
    {/* {schedules.length ? (
        <ul>
          {schedules.map((item) => (
            <li key={item.id}>{item.title}</li>
          ))}
        </ul>
      ) : (
        <p>Loading data...</p>
      )} */}
    </div>


  );
}


export default Schedules