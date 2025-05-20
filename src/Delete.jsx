import { useState} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

function Delete( {token} ) {
  const [reason, setReason] = useState('');
  const [despatchId, setDespatchId] = useState('');
  const [showReason, setShowReason] = useState(false);

  const deleteDespatchAdvice = async () => {
    try {
      await axios.delete(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${despatchId}`,
        {
          data: { Reason: reason },
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      );
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
            Delete
          </h1>
        </div>
        <div className="d-flex flex-column align-items-center mt-4">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <InputGroup size="lg">
              <InputGroup.Text id="inputGroup-sizing-lg">ID</InputGroup.Text>
              <Form.Control
                value={despatchId}
                onChange={(e) => setDespatchId(e.target.value)}
                aria-label="Large"
                aria-describedby="inputGroup-sizing-lg"
                placeholder='Despatch Advice ID'
              />
            </InputGroup>
            <br/ >
            <Button variant="outline-secondary" size="lg" className="w-100" onClick={() => setShowReason(true)}>
              Delete
            </Button>
          </div>
        </div>
      </Container>

      <Modal show={showReason} onHide={() => setShowReason(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select Reason</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form.Select
        aria-label="Select reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mb-3 w-100"
      >
        <option value="">-- Select Reason --</option>
        <option value="Order was cancelled by the customer">Order was cancelled by the customer</option>
        <option value="Despatch advice was created in error">Despatch advice was created in error</option>
        <option value="Incorrect shipping details in the despatch advice">Incorrect shipping details in the despatch advice</option>
        <option value="Incorrect items or quantities listed in the despatch advice">Incorrect items or quantities listed in the despatch advice</option>
        <option value="Duplicate despatch advice created">Duplicate despatch advice created</option>
        <option value="Supplier or warehouse error during fulfillment">Supplier or warehouse error during fulfillment</option>
        <option value="Order merged with another shipment">Order merged with another shipment</option>
        <option value="Order returned to warehouse before shipping">Order returned to warehouse before shipping</option>
        <option value="System integration error caused invalid despatch generation">System integration error caused invalid despatch generation</option>
        <option value="Other">Other</option>
      </Form.Select>
        <Button
          variant="primary"
          onClick={async () => {
            await deleteDespatchAdvice();
            setShowReason(false);
            alert('Deleted successfully!');
          }}
          disabled={!reason}
        >
          Confirm Delete
        </Button>
      </Modal.Body>
      </Modal>
    </>
  )
}

export default Delete;