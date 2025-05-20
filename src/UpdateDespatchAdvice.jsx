import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal'

function UpdateDespatchAdvice({ token }) {
	const [key, setKey] = useState('');
	const [contactDespatchId, setContactDespatchId] = useState('');
	const [updateName, setUpdateName] = useState('');
	const [updateTelephone, setUpdateTelephone] = useState('');
	const [updateTelefax, setUpdateTelefax] = useState('');
	const [updateEmail, setUpdateEmail] = useState('');
	const [showContact, setShowContact] = useState(false);
	const [showContactForm, setShowContactForm] = useState(false);
	const [initialDetails, setInitialDetails] = useState(null);

	const [addressDespatchId, setAddressDespatchId] = useState('');
	const [streetName, setStreetName] = useState('');
	const [buildingName, setBuildingName] = useState('');
	const [buildingNumber, setBuildingNumber] = useState('');
	const [cityName, setCityName] = useState('');
	const [postalZone, setPostalZone] = useState('');
	const [countrySubentity, setCountrySubentity] = useState('');
	const [addressLine, setAddressLine] = useState('');
	const [country, setCountry] = useState('');
	const [showAddress, setShowAddress] = useState(false);
	const [showAddressForm, setShowAddressForm] = useState(false);
	

	const updateCustomerContact = async () => {
		try {
			const response = await axios.patch(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${contactDespatchId}/updateCustomerContact`,
				{
					Name: updateName,
					Telephone: updateTelephone,
					Telefax: updateTelefax,
					ElectronicMail: updateEmail
				}, {
				headers: {
					Authorization: token,
					'Content-Type': 'application/json'
				}
			}
			);
			setShowContact(true);
			setShowContactForm(false);
			setContactDespatchId('');
		} catch (err) {
			alert(err.message);
		}
	}

	const updateCustomerAddress = async () => {
		try {
			const response = await axios.patch(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${addressDespatchId}/updateCustomerAddress`,
				{
					StreetName: streetName,
					BuildingName: buildingName,
					BuildingNumber: buildingNumber,
					CityName: cityName,
					PostalZone: postalZone,
					CountrySubentity: countrySubentity,
					AddressLine: addressLine,
					Country: country
				}, {
					headers: {
						Authorization: token,
						'Content-Type': 'application/json'
					}
				}
			);
			setShowAddress(true);
			setShowAddressForm(false);
			setAddressDespatchId('')
		} catch (err) {
			alert(err.message);
		}
	}

	const handleOpenModalAndFetchAddress = async () => {
		try {
			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${addressDespatchId}/shipment`, {
				headers: {
					Authorization: token
				}
			});
	
			const xmlString = response.data["Items"];
			const xml = new DOMParser().parseFromString(xmlString, "text/xml");
	
			setStreetName(xml.getElementsByTagName("cbc:StreetName")[0]?.textContent || '');
			setBuildingName(xml.getElementsByTagName("cbc:BuildingName")[0]?.textContent || '');
			setBuildingNumber(xml.getElementsByTagName("cbc:BuildingNumber")[0]?.textContent || '');
			setCityName(xml.getElementsByTagName("cbc:CityName")[0]?.textContent || '');
			setPostalZone(xml.getElementsByTagName("cbc:PostalZone")[0]?.textContent || '');
			setCountrySubentity(xml.getElementsByTagName("cbc:CountrySubentity")[0]?.textContent || '');
			setAddressLine(xml.getElementsByTagName("cbc:Line")[0]?.textContent || '');
			setCountry(xml.getElementsByTagName("cbc:IdentificationCode")[0]?.textContent || '');
	
			setShowAddressForm(true);
		} catch (err) {
			alert("Failed to load shipment address details.");
		}
	};

	const handleOpenModalAndFetchContact = async () => {
  try {
    const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${contactDespatchId}/customer`, {
			headers: {
				Authorization: token
			}
		});
    const xml = new DOMParser().parseFromString(response.data["Customer details"], "text/xml");

    setInitialDetails({
      name: xml.getElementsByTagName("cbc:Name")[0]?.textContent || '',
      telephone: xml.getElementsByTagName("cbc:Telephone")[0]?.textContent || '',
      telefax: xml.getElementsByTagName("cbc:Telefax")[0]?.textContent || '',
      email: xml.getElementsByTagName("cbc:ElectronicMail")[0]?.textContent || ''
    });

    setShowContactForm(true);
  } catch (err) {
    alert("Failed to load.");
  }
};

useEffect(() => {
  if (showContactForm && initialDetails) {
    setUpdateName(initialDetails.name);
    setUpdateTelephone(initialDetails.telephone);
    setUpdateTelefax(initialDetails.telefax);
    setUpdateEmail(initialDetails.email);
  }
}, [showContactForm]);
	
  return (
		<>
			<Container fluid className="p-0 m-0">
				<div
					className='d-flex justify-content-center align-items-center'
					style={{backgroundColor:'#1a1a2e'}}
					>
					<h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem', marginBottom: '5rem'}}>
						Update Customer Details
					</h1>
				</div>
				<Container className="align-items-center mt-4">
					<Tabs
						id="controlled-tab-example"
						activeKey={key}
						onSelect={(k) => setKey(k)}
						className="mb-3"
						>
					<Tab eventKey="customer-contact" title="Customer Contact">
						<InputGroup size="lg" className="mb-3 w-50">
							<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
							<Form.Control
								value={contactDespatchId}
								onChange={(e) => setContactDespatchId(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
								placeholder='Despatch ID'
							/>
						</InputGroup>
						<Button variant="outline-secondary" onClick={handleOpenModalAndFetchContact}>
							Enter
						</Button>
					</Tab>
						
						<Tab eventKey="customer-address" title="Customer Address">
							<InputGroup size="lg" className="mb-3 w-50">
								<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
								<Form.Control
									value={addressDespatchId}
									onChange={(e) => setAddressDespatchId(e.target.value)}
									aria-label="Large"
									aria-describedby="inputGroup-sizing-sm"
									placeholder='Despatch ID'
								/>
							</InputGroup>
							<Button variant="outline-secondary" onClick={handleOpenModalAndFetchAddress}>
								Enter
							</Button>
						</Tab>
					</Tabs>
				</Container>
			</Container>

			<Modal show={showContactForm} onHide={() => setShowContactForm(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Update Customer Contact</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Name</InputGroup.Text>
							<Form.Control
								value={updateName}
								onChange={(e) => setUpdateName(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Telephone</InputGroup.Text>
							<Form.Control
								value={updateTelephone}
								onChange={(e) => setUpdateTelephone(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Telefax</InputGroup.Text>
							<Form.Control
								value={updateTelefax}
								onChange={(e) => setUpdateTelefax(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Electronic Mail</InputGroup.Text>
							<Form.Control
								value={updateEmail}
								onChange={(e) => setUpdateEmail(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<Button variant="outline-secondary" onClick={updateCustomerContact}>
							Update
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
          <Button variant="secondary" onClick={() => setShowContactForm(false)}>
              Close
          </Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showContact} onHide={() => setShowContact(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Updated!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Customer contact is successfully updated.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowContact(false)}>
						close
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showAddressForm} onHide={() => setShowAddressForm(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Update Customer Address</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Street Name</InputGroup.Text>
							<Form.Control
								value={streetName}
								onChange={(e) => setStreetName(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Building Name</InputGroup.Text>
							<Form.Control
								value={buildingName}
								onChange={(e) => setBuildingName(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Building Number</InputGroup.Text>
							<Form.Control
								value={buildingNumber}
								onChange={(e) => setBuildingNumber(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">City Name</InputGroup.Text>
							<Form.Control
								value={cityName}
								onChange={(e) => setCityName(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Postal Zone</InputGroup.Text>
							<Form.Control
								value={postalZone}
								onChange={(e) => setPostalZone(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Country Subentity</InputGroup.Text>
							<Form.Control
								value={countrySubentity}
								onChange={(e) => setCountrySubentity(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Address Line</InputGroup.Text>
							<Form.Control
								value={addressLine}
								onChange={(e) => setAddressLine(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<InputGroup size="lg" className="mb-3 w-70">
							<InputGroup.Text id="inputGroup-sizing-lg">Country</InputGroup.Text>
							<Form.Control
								value={country}
								onChange={(e) => setCountry(e.target.value)}
								aria-label="Large"
								aria-describedby="inputGroup-sizing-sm"
							/>
						</InputGroup>
						<Button variant="outline-secondary" onClick={updateCustomerAddress}>
							Update
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddress(false)}>
              Close
          </Button>
				</Modal.Footer>
			</Modal>
			<Modal show={showAddress} onHide={() => setShowAddress(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Updated!</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Customer address is successfully updated.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShowAddress(false)}>
						close
					</Button>
				</Modal.Footer>
			</Modal>
		
		</>


	);
}

export default UpdateDespatchAdvice;