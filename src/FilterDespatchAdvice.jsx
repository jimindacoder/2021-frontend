import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal'

function FilterDespatchAdvice({ token }) {
	const [key, setKey] = useState('');
	const [earliest, setEarliest] = useState([]);
	const [latest, setLatest] = useState([]);
	const [supplier, setSupplier] = useState('');
	const [idsFromSupplier, setIdsFromSupplier] = useState([]);
	const [supplierCount, setSupplierCount] = useState('');
	const [customerDespatchId, setCustomerDespatchId] = useState('');
	const [parsedCustomerDetails, setParsedCustomerDetails] = useState(null);
	const [shipmentDespatchId, setShipmentDespatchId] = useState('');
	const [shipmentSummary, setShipmentSummary] = useState('');
	const [arrivalDespatchId, setArrivalDespatchId] = useState('');
	const [arrival, setArrival] = useState('');
	
	const getEarliestDate = async () => {
		try {			
			const response = await axios.get("https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/earliestDelivery", {
				headers: {
					Authorization: token
				}
			});

			if (response.status !== 200) {
				alert('Failed to get lists')
			}
		const data = response.data;
		setEarliest(data);
		} catch (err) {
			alert(err.message);
		}
	}

	const getLatestDate = async () => {
		try {
			const token = sessionStorage.getItem("token");
			
			const response = await axios.get("https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/latestDelivery", {
				headers: {
					Authorization: token
				}
			});

			if (response.status !== 200) {
				alert('Failed to get lists')
			}
			const data = response.data;
			setLatest(data);
		} catch (err) {
			alert(err.message);
		}
	}

	const getSupplier = async () => {
		try {
			const encodedSupplier = encodeURIComponent(supplier);

			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/supplier?Supplier=${encodedSupplier}`, {
				headers: {
					Authorization: token
				}
			});

			if (response.status !== 200) {
				alert('Failed to get suppliers')
			}
			const data = response.data;
			setIdsFromSupplier(data.despatchAdvices.despatchAdvicesIDs);
			setSupplierCount(data.count);
		} catch (err) {
			alert(err.message);
		}
	}

	const getCustomerDetails = async () => {
		try {
			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${customerDespatchId}/customer`, {
				headers: {
					Authorization: token
				}
			});

			const data = response.data;

			if (data["Customer details"]) {
				const parsed = parseCustomerDetails(data["Customer details"]);
				setParsedCustomerDetails(parsed);
			}

		} catch (err) {
			alert(err.message);
		}
	}

	const getShipment = async () => {
		try {
			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${shipmentDespatchId}/shipment`, {
				headers: {
					Authorization: token
				}
			});

			const xmlString = response.data["Items"];
			const xml = new DOMParser().parseFromString(xmlString, "text/xml");

			const getText = (tag) => xml.getElementsByTagName(tag)[0]?.textContent || '';

			const summary = [
				`Street: ${getText("cbc:StreetName")}`,
				`Building Name: ${getText("cbc:BuildingName")}`,
				`Building Number: ${getText("cbc:BuildingNumber")}`,
				`City: ${getText("cbc:CityName")}`,
				`Postal Zone: ${getText("cbc:PostalZone")}`,
				`Subentity: ${getText("cbc:CountrySubentity")}`,
				`Address Line: ${getText("cbc:Line")}`,
				`Country: ${getText("cbc:IdentificationCode")}`,
				`Delivery Period: ${getText("cbc:StartDate")} ~ ${getText("cbc:EndDate")} (${getText("cbc:StartTime")} ~ ${getText("cbc:EndTime")})`
			].join('\n');
			

    	setShipmentSummary(summary);
		} catch (err) {
			alert(err.message);
		}
	}

	const getShipmentArrival = async () => {
		try {
			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${arrivalDespatchId}/shipment-arrival`, {
				headers: {
					Authorization: token
				}
			});

			const xmlString = response.data["requestedDelivery"];
			const xml = new DOMParser().parseFromString(xmlString, "text/xml");

			const getText = (tag) => xml.getElementsByTagName(tag)[0]?.textContent || '';
			
			const summary = [
				`Start Date: ${getText("cbc:StartDate")}`,
				`Start Time: ${getText("cbc:StartTime")}`,
				`End Date: ${getText("cbc:EndDate")}`,
				`End Time: ${getText("cbc:EndTime")}`,
			].join('\n');

			setArrival(summary);

		} catch(err) {
			alert(err.message);
		}
	}

	const parseCustomerDetails = (xmlString) => {
		const parser = new DOMParser();
		const xml = parser.parseFromString(xmlString, "text/xml");
	
		return {
			name: xml.getElementsByTagName("cbc:Name")[0]?.textContent || '',
			telephone: xml.getElementsByTagName("cbc:Telephone")[0]?.textContent || '',
			telefax: xml.getElementsByTagName("cbc:Telefax")[0]?.textContent || '',
			email: xml.getElementsByTagName("cbc:ElectronicMail")[0]?.textContent || '',
		};
	};

	useEffect(() => {
		switch (key) {
			case "earliest":
				getEarliestDate();
				break;
			case "latest":
				getLatestDate();
				break;
			default:
				break;
		}
  }, [key]);

	return (
		<>
		
		<Container fluid className="p-0 m-0">
			<div
				className='d-flex justify-content-center align-items-center'
				style={{backgroundColor:'#1a1a2e'}}
				>
				<h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem', marginBottom: '5rem'}}>
					Filter Despatch Advices
				</h1>
			</div>
			<Container className="align-items-center mt-4">
				<Tabs
				id="controlled-tab-example"
				activeKey={key}
				onSelect={(k) => setKey(k)}
				className="mb-3"
				>
				<Tab eventKey="oreder-reference" title="Order Reference">
					Tab content for Home
				</Tab>
				<Tab eventKey="shipment" title="Shipment">
					<InputGroup size="lg" className="mb-3 w-50">
						<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
						<Form.Control
							value={shipmentDespatchId}
							onChange={(e) => setShipmentDespatchId(e.target.value)}
							placeholder="Enter despatch ID"
						/>
						<Button variant="outline-secondary" onClick={getShipment}>Search</Button>
					</InputGroup>
					{shipmentSummary && (
						<pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
							{shipmentSummary}
						</pre>
					)}	
				</Tab>

				<Tab eventKey="shipment-arrival" title="Shipment Arrival">
					<InputGroup size="lg" className="mb-3 w-50">
						<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
						<Form.Control
							value={arrivalDespatchId}
							onChange={(e) => setArrivalDespatchId(e.target.value)}
							placeholder="Enter despatch ID"
						/>
						<Button variant="outline-secondary" onClick={getShipmentArrival}>Search</Button>
					</InputGroup>
					{shipmentSummary && (
						<pre className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
							{arrival}
						</pre>
					)}	
				</Tab>
				<Tab eventKey="country-date" title="Country & Date">
					Tab content for Profile
				</Tab>
				<Tab eventKey="earliest" title="Earliest Date">
					{earliest?.despatchAdvices?.despatchAdvicesIDs?.length > 0 ? (
						<div>
							<p className="mt-3"><strong>{earliest.count}</strong></p>
							<ul className="list-group w-25">
								{earliest.despatchAdvices.despatchAdvicesIDs.map((id, index) => (
									<li key={index} className="list-group-item">{id}</li>
								))}
							</ul>
						</div>
						) : (
						<p className="text-muted mt-3">Loading.</p>
					)}
				</Tab>
				<Tab eventKey="latest" title="Latest Date">
					{latest?.despatchAdvices?.despatchAdvicesIDs?.length > 0 ? (
						<div>
							<p className="mt-3"><strong>{latest.count}</strong></p>
							<ul className="list-group w-25">
								{latest.despatchAdvices.despatchAdvicesIDs.map((id, index) => (
									<li key={index} className="list-group-item">{id}</li>
								))}
							</ul>
						</div>
						) : (
						<p className="text-muted mt-3">Loading.</p>
					)}
				</Tab>
				<Tab eventKey="supplier" title="Supplier">
					<InputGroup size="lg" className="mb-3 w-50">
						<InputGroup.Text id="inputGroup-sizing-lg">Supplier</InputGroup.Text>
						<Form.Control
							value={supplier}
							onChange={(e) => setSupplier(e.target.value)}
							aria-label="Large"
							aria-describedby="inputGroup-sizing-sm"
							placeholder='Supplier'
						/>
						<Button variant="outline-secondary" onClick={getSupplier}>
							Search
						</Button>
					</InputGroup>
						{idsFromSupplier.length > 0 && (
              <>
                <p className="mt-3"><strong>{supplierCount}</strong></p>
								<ul className="list-group" style={{ width: '20%', marginBottom: '30px'}}>
									{idsFromSupplier.map((id, index) => (
										<li key={index} className="list-group-item">{id}</li>
									))}
								</ul>
              </>
            )}
				</Tab>
				<Tab eventKey="customer" title="Customer">
					<InputGroup size="lg" className="mb-3 w-50">
						<InputGroup.Text id="inputGroup-sizing-lg">Despatch ID</InputGroup.Text>
						<Form.Control
							value={customerDespatchId}
							onChange={(e) => setCustomerDespatchId(e.target.value)}
							aria-label="Large"
							aria-describedby="inputGroup-sizing-sm"
							placeholder='Despatch ID'
						/>
						<Button variant="outline-secondary" onClick={getCustomerDetails}>
							Search
						</Button>
					</InputGroup>
					{parsedCustomerDetails && (
						<div className="mt-3 w-50">
							<h5>Customer Details:</h5>
							<ul className="list-group">
								<li className="list-group-item"><strong>Name:</strong> {parsedCustomerDetails.name}</li>
								<li className="list-group-item"><strong>Telephone:</strong> {parsedCustomerDetails.telephone}</li>
								<li className="list-group-item"><strong>Telefax:</strong> {parsedCustomerDetails.telefax}</li>
								<li className="list-group-item"><strong>Email:</strong> {parsedCustomerDetails.email}</li>
							</ul>
						</div>
					)}
				</Tab>
    		</Tabs>
			</Container>

			</Container>
			
		</>
	)
}

export default FilterDespatchAdvice