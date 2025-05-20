import { useState} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal'



function Status( {token} ) {
  const [status, setStatus] = useState('');
  const [key, setKey] = useState('');
  const [despatchId, setDespatchId] = useState('');
  const [updateDespatchId, setUpdateDespatchId] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const [showNewStatus, setShowNewStatus] = useState(false);


  const getStatus = async () => {
    try {
      const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${despatchId}/retrieveStatus`, {
        headers: {
          Authorization: token
        }
      });

      const data = response.data;
      setStatus(data["Despatch Status"]);
      console.log(data);
      setShowStatus(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const updateStatus = async () => {
    try {
      const response = await axios.patch(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${updateDespatchId}/changeStatus`,
        {
          Status: newStatus,
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = response.data;
      setNewStatus(data.Status);
      setShowNewStatus(true);
    } catch (err) {
      alert(err.message);
    }
  }


  return (
    <>
      <Container fluid className="p-0 m-0">
      <div
        className='d-flex justify-content-center align-items-center'
        style={{backgroundColor:'#1a1a2e'}}
        >
        <h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem', marginBottom: '5rem'}}>
          Status
        </h1>
      </div>

      <Container className="align-items-center mt-4">
					<Tabs
						id="controlled-tab-example"
						activeKey={key}
						onSelect={(k) => setKey(k)}
						className="mb-3"
						>
					<Tab eventKey="get-status" title="Get Status">
						<InputGroup size="lg" className="mb-3 w-50">
							<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
							<Form.Control
								value={despatchId}
								onChange={(e) => setDespatchId(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
								placeholder='Despatch ID'
							/>
						</InputGroup>
						<Button variant="outline-secondary" onClick={getStatus}>
							Enter
						</Button>
					</Tab>
						
						<Tab eventKey="update-status" title="Update Status">
							<InputGroup size="lg" className="mb-3 w-50">
								<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
								<Form.Control
									value={updateDespatchId}
									onChange={(e) => setUpdateDespatchId(e.target.value)}
									aria-label="Large"
									aria-describedby="inputGroup-sizing-sm"
									placeholder='Despatch ID'
								/>
							</InputGroup>
							<Button variant="outline-secondary" onClick={() => setShowNewStatus(true)}>
								Enter
							</Button>
						</Tab>
					</Tabs>
				</Container>
			</Container>

      <Modal show={showStatus} onHide={() => setShowStatus(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Current Staus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Despatch Advice ID:</strong> {despatchId}</p>
        <p><strong>Status:</strong> {status || 'Loading...'}</p>
      </Modal.Body>
      </Modal>

      <Modal show={showNewStatus} onHide={() => setShowNewStatus(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update Staus</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Select
        aria-label="Select new status"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
        className="mb-3 w-50"
      >
        <option value="">-- Select Status --</option>
        <option value="Pending">Pending</option>
        <option value="Packed">Packed</option>
        <option value="Dispatched">Dispatched</option>
        <option value="In transit">In transit</option>
        <option value="Delivered">Delivered</option>
        <option value="Returned">Returned</option>
      </Form.Select>
        <Button
          variant="primary"
          onClick={async () => {
            await updateStatus();
            setShowNewStatus(false);
            alert('Status updated successfully!');
          }}
          disabled={!newStatus}
        >
          Confirm Update
        </Button>
      </Modal.Body>
      </Modal>
    </>
  )
} 

export default Status;