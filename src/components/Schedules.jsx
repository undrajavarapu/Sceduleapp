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

  return (
  
<div className="container" style={{marginLeft:'5%',marginTop:'2%'}}>

<Modal show={show} type={type} onHide={handleClose} backdrop={false} style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-18%, -50%)'}}>
  
        <h5>Add Schedule</h5>
        <Modal.Body>
          <Container>

        <form onSubmit={handleSubmit}>

        <Row>
        <Col xs={4}>title:</Col>
        <Col xs={8} mb-1><input  type='text' onChange={handleChange} name='title' value={state.title}/></Col>
        
        </Row>
        <Row>
        <Col xs={4}>description:</Col>
        <Col mb-1><textarea onChange={handleChange} name='description' value={state.description}/></Col>
        
        </Row>
        <Row>
        <Col xs={4}>subject:</Col>
        <Col xs={8} mb-1><input type='text' onChange={handleChange} name='subject' value={state.subject}/></Col>
        
        </Row>
        <Row>
        <Col xs={4}>Frequency:</Col>
        <Col xs={8} mb-1>
        <label Htmlfor="frequency" class="form-label" onChange={handlefreqChange} value={state.frequency}>
          
          <select name="frequency">
        <option value="Monthly">Monthly</option>
        <option value="Weekly">Weekly</option>
        <option value="Daily">Daily</option>
      </select>
      </label>
          </Col>
        
        </Row>
        <Row>
        <Col xs={4}>Repeat:</Col>
        <Col xs={8} mb-1>{state.frequency !== "Daily"&&(
      <label Htmlfor="exampleFormControlInput1" class="form-label" onChange={handlerepeatChange} value={state.repeat}>
      <select name="repeat">
      {state.frequency === "Monthly" && (
          <><option key="first monday">first monday</option><option key="last friday">last friday</option></>
        )}
        {state.frequency === "Weekly" && (
          <><option key="Monday" value="Monday">M</option><option key="Tuesday"
          value="Tuesday">T</option><option key="Wednesday"
          value="Wednesday">W</option><option key="Thursday"
          value="Thursday">T</option>
          <option key="Friday"
          value="Friday">F</option><option key="Saturday"
          value="Saturday">S</option><option key="Sunday"
          value="Sunday">Su</option></>
        )}
        
      </select></label>)}</Col>
        
        </Row>
        
        
        <Row>
        <Col xs={4}><label Htmlfor="currenttime" class="form-label"  value={state.time}>time</label></Col>
        <Col xs={8} mb-1><TimeDropdown onDataReceive={handleTimeReceive} /></Col>
        
        </Row>
      
      
  
  
  {/* <p>Selected time: {selectedTime}</p> */}
        {/* <button type='submit'>submit</button> */}

        
    </form>
    <div class="col col-lg-12" style={{marginLeft:"45%"}}>
    <Button className="m-3 " variant="secondary" onClick={handleClose} >
            Cancel
          </Button>
          <Button className="m-3" onClick={handleSubmit}>
            Done
          </Button>
    </div>
    
    </Container>
        
        </Modal.Body>
        {/* <Modal.Footer>
          
        </Modal.Footer> */}
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