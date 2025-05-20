import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

function GetAllAdvices({ token }) {
	const [allIds, setAllIds] = useState([]);
	const [despatchId, setDespatchId] = useState('');
	const [itemsXml, setItemsXml] = useState(''); 

	const getAllIds = async () => {
		try {
			const response = await axios.get("https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice", {
				headers: {
					Authorization: token
				}
			});
	
			if (response.status !== 200) {
				alert('Failed to get IDs')
			}
			
			const data = response.data;
			setAllIds(data.despatchAdvices.despatchAdvicesIDs); 

		} catch (err) {
			alert(err.message);
		}
	}

	const getListAllItems = async () => {
		try {
			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${despatchId}/items`, {
				headers: {
					Authorization: token
				}
			});

			if (response.status !== 200) {
        alert('Failed to get a list of items');
        return;
      }

			const parser = new DOMParser();
			const xmlDoc = parser.parseFromString(response.data.Items, 'text/xml');
			const itemElements = xmlDoc.getElementsByTagName('Item');
	
			const parsedItems = Array.from(itemElements).map(item => ({
				name: item.getElementsByTagName('cbc:Name')[0]?.textContent || '',
				description: item.getElementsByTagName('cbc:Description')[0]?.textContent || '',
				buyerId: item.getElementsByTagName('cac:BuyersItemIdentification')[0]?.getElementsByTagName('cbc:ID')[0]?.textContent || '',
				sellerId: item.getElementsByTagName('cac:SellersItemIdentification')[0]?.getElementsByTagName('cbc:ID')[0]?.textContent || '',
				lotNumber: item.getElementsByTagName('cbc:LotNumberID')[0]?.textContent || '',
				expiryDate: item.getElementsByTagName('cbc:ExpiryDate')[0]?.textContent || '',
			}));
	
			setItemsXml(parsedItems);
		} catch (err) {
		}
	};

	return (
		<Container fluid className="p-0 m-0">
			<div
				className='d-flex justify-content-center align items-center'
				style={{backgroundColor:'#1a1a2e'}}
				>
				<h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem', marginBottom: '5rem'}}>
					Get All Despatch Advices
				</h1>
			</div>
			<Container className="w-75 mt-5">
    <Row>
			<Col md={4} style={{ marginLeft: '-10px' }}>
				{/* Get All IDs row */}
				<Row className="align-items-center mb-4">
					<Col xs="auto"><h4 className="mb-0">All Despatch Advice IDs</h4></Col>
					<Col><Button variant="primary" onClick={getAllIds}>Get</Button></Col>
				</Row>

				{/* Despatch ID input row */}
				<Form.Label>Get Items for Specific ID</Form.Label>
				<Row className="align-items-center">
					<Col style={{ paddingRight: 0 }}>
						<InputGroup style={{ height: '50px', width: '250px' }}>
							<InputGroup.Text>ID</InputGroup.Text>
							<Form.Control
								value={despatchId}
								onChange={(e) => setDespatchId(e.target.value)}
								placeholder="Despatch Advice ID"
							/>
						</InputGroup>
					</Col>
					<Col xs="auto" style={{ paddingLeft: '2px' }}>
						<Button variant="primary" onClick={getListAllItems}>Get</Button>
					</Col>
				</Row>
			</Col>

      <Col md={8}>
        <Row>
          {/* ID list */}
          <Col md={6}>
            {allIds.length > 0 && (
              <div
                style={{
                  maxHeight: '300px',
                  overflowY: 'auto',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '1rem',
                  background: '#fff',
                }}
              >
                <h5>Despatch Advice IDs:</h5>
                <ul className="list-group">
                  {allIds.map((id, index) => (
                    <li key={index} className="list-group-item">{id}</li>
                  ))}
                </ul>
              </div>
            )}
          </Col>

          {/* Items XML */}
          <Col md={6}>
					{Array.isArray(itemsXml) && itemsXml.length > 0 && (
						<div
							style={{
								background: '#f8f9fa',
								border: '1px solid #ddd',
								borderRadius: '8px',
								padding: '1rem',
								maxHeight: '300px',
								overflowY: 'auto',
							}}
						>
							<h5>Items:</h5>
							<ul className="list-group">
								{itemsXml.map((item, index) => (
									<li key={index} className="list-group-item">
										<strong>Name:</strong> {item.name}<br />
										<strong>Description:</strong> {item.description}<br />
										<strong>Buyer ID:</strong> {item.buyerId}<br />
										<strong>Seller ID:</strong> {item.sellerId}<br />
										<strong>Lot Number:</strong> {item.lotNumber}<br />
										<strong>Expiry Date:</strong> {item.expiryDate}
									</li>
								))}
							</ul>
						</div>
					)}
          </Col>
        </Row>
      </Col>
    </Row>
  </Container>
</Container>
		
	)
}

export default GetAllAdvices;