import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal'

function CreateDespatchAdvice({ token }) {
	const navigate = useNavigate();
	const [advice, setAdvice] = useState('');
	const [despatchId, setDespatchId] = useState('');
	const [showadvice, setShowAdvice] = useState(false);
	const [file, setFile] = useState(null);
	const [despatchXml, setDespatchXml] = useState('');
	const [showXml, setShowXml] = useState(false);

	const handleCloseAdvice = () => setShowAdvice(false);
  const handleShow = () => setShowAdvice(true);
	const handleCloseXml = () => setShowXml(false);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const extractDespatchId = (xml) => {
		const match = xml.match(/<cbc:ID>(.*?)<\/cbc:ID>/);
		return match ? match[1] : 'Unknown ID';
	};

	const createDespatchAdvice = async () => {
		if (!file) {
			alert('Please select a JSON file.');
			return;
		}

		try {
			const fileText = await file.text();
			const jsonData = JSON.parse(fileText);
			const response = await axios.post("https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice",
				jsonData,
				{
					headers: {
					"Content-Type": "application/json",
					"Authorization": token
			},
			});
			
			if (response.status !== 200) {
        alert('Failed to create Despatch Advice.');
        return;
      }
			const data = response.data;
			setAdvice(data);
			handleShow();
		} catch (err) {
  		alert(err.message);
		}
	};

	const despatchAdviceXml = async (id) => {
		try {
			const token = sessionStorage.getItem("token");

			const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/${despatchId}/despatchXML`, {
        headers: {
            Authorization: token
        }
      });

			if (response.status !== 200) {
				alert('Failed to get XML')
			}

			const rawXml = response.data["Despatch Advice XML"];
			const xml = typeof rawXml === 'string' ? rawXml : JSON.stringify(rawXml, null, 2);
			setDespatchXml(xml);
			setShowXml(true);
		} catch (err) {
			alert(err.message);
		}
	}
	
	const downloadXml = () => {
		if (!despatchXml) {
			alert("No XML to download");
			return;
		}

		const blob = new Blob([despatchXml], { type: 'application/xml' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.href = url;
		link.download = `despatch-${despatchId || 'advice'}.xml`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}
	return (
		<>
			<Container fluid className="p-0 m-0">
				<div
          className='d-flex justify-content-center align-items-center'
          style={{backgroundColor:'#1a1a2e'}}
					>
          <h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem', marginBottom: '5rem'}}>
						Create Despatch Advice
					</h1>
        </div>
				<Container className="w-75 mt-5 ms-3">
					<Row className="align-items-end mb-4 mt-5">
						<Col md={7}>
							<Form.Group controlId="formFileLg">
								<Form.Label>Upload order Advice Document in .json format in order to create Despatch Advice</Form.Label>
								<Form.Control type="file" size="lg" onChange={handleFileChange}/>
							</Form.Group>
						</Col>
						<Col>
							<Button variant="outline-secondary" size="lg" style={{ width: '38%' }} onClick={() => createDespatchAdvice()}>
								Create
							</Button>
						</Col>
					</Row>
					<hr style={{ width: '75%', margin: '2rem 0 3rem 0' }} />
					<Form.Label>Despatch Advice in XML format</Form.Label>
					<Row className="align-items-end mb-4">
						<Col md={6}>
							<InputGroup size="lg">
								<InputGroup.Text id="inputGroup-sizing-lg">ID</InputGroup.Text>
								<Form.Control
									value={despatchId}
									onChange={(e) => setDespatchId(e.target.value)}
									aria-label="Large"
									aria-describedby="inputGroup-sizing-sm"
									placeholder='Despatch Advice ID'
								/>
							</InputGroup>
						</Col>
						<Col md={1} className="d-flex align-items-end">
							<Button variant="outline-secondary" size="lg" className="w-100" onClick={() => despatchAdviceXml(despatchId)}>
								Get
							</Button>
						</Col>
						<Col md={3} className="d-flex align-items-end">
							<Button
								variant="outline-secondary"
								size="lg"
								className="w-90"
								onClick={downloadXml}	
							>
								Download XML
							</Button>
						</Col>
					</Row>
				</Container>				
			</Container>
			{advice && (
				<Modal show={showadvice} onHide={handleCloseAdvice}>
					<Modal.Header closeButton>
						<Modal.Title>Despatch Advice ID: {extractDespatchId(advice.DespatchAdviceXML)}</Modal.Title>
					</Modal.Header>				
					<Modal.Body>
					<pre style={{ whiteSpace: 'pre-wrap' }}>{advice.DespatchAdviceXML}</pre>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseAdvice}>
								Close
						</Button>
						</Modal.Footer>
				</Modal>
			)}
			{despatchId && (
				<Modal show={showXml} onHide={handleCloseXml}>
					<Modal.Header closeButton>
						<Modal.Title>Despatch Advice in .XML</Modal.Title>
					</Modal.Header>				
					<Modal.Body>
					<pre style={{ whiteSpace: 'pre-wrap' }}>{despatchXml}</pre>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseXml}>
								Close
						</Button>
						</Modal.Footer>
				</Modal>
			)}
		</>
	)
}

export default CreateDespatchAdvice;