import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal'

function Inventory( {token} ) {
  const [productName, setProductName] = useState('');
  const [key, setKey] = useState('');
  const [nameCreate, setNameCreate] = useState('');
  const [quantityCreate, setQuantityCreate] = useState('');
  const [lotNumberCreate, setLotNumberCreate] = useState('');
  const [descriptionCreate, setDescriptionCreate] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [create, setCreate] = useState('');
  const [product, setProduct] = useState(null);
  const [showProduct, setShowProduct] = useState(false);

  const getProductDetails = async () => {
    try {
      const response = await axios.get(`https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchProduct/${productName}/retrieve`, {
				headers: {
					Authorization: token,
				}
			});

      if (response.status !== 200) {
				alert('Failed to get details')
			}
      const data = response.data;
      console.log('inventroy get: ', data);
      setProduct(data);
      setShowProduct(true);
    } catch (err) {
      alert (err.message);
    }
  }

  const createProduct = async () => {
    try {
      const response = await axios.post("https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchProduct/createProduct",
        {
          body: {
            Name: nameCreate,
            Quantity: quantityCreate,
            Description: descriptionCreate,
            LotNumber: lotNumberCreate,
          }
        } ,{ 
				headers: {
					Authorization: token
				}
        }
			);

      if (response.status !== 200) {
				alert('Failed to get details')
        return;
			}
      
      const data = response.data;
      setCreate(data);
      console.log('product created: ', data);
      setShowCreate(true);
      
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
            Inventory
          </h1>
        </div>
        <Container className="align-items-center mt-4">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
            >
            <Tab eventKey="product-detail" title="Product Details">
            <Form
              className="d-flex flex-column align-items-start gap-4"
              style={{ maxWidth: '400px', margin: '0' }}
            >
              <InputGroup size="lg">
                <InputGroup.Text id="name-get">Product Name</InputGroup.Text>
                  <Form.Control
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder='Product Name'
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                  />
              </InputGroup>
              <Button variant="outline-secondary" onClick={getProductDetails}>
                  Get
              </Button>
            </Form>
            </Tab>

            <Tab eventKey="creaet-product" title="Create">
            <Form
              className="d-flex flex-column align-items-start gap-4"
              style={{ maxWidth: '400px', margin: '0' }}
            >
              <InputGroup size="lg">
                <InputGroup.Text id="name-create">Product Name</InputGroup.Text>
                  <Form.Control
                    value={nameCreate}
                    onChange={(e) => setNameCreate(e.target.value)}
                    placeholder='Product Name'
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                  />
              </InputGroup>
              <InputGroup size="lg">
                <InputGroup.Text id="quantity-create">Quantity</InputGroup.Text>
                  <Form.Control
                    value={quantityCreate}
                    onChange={(e) => setQuantityCreate(e.target.value)}
                    placeholder='Quatity'
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                  />
              </InputGroup>
              <InputGroup size="lg">
                <InputGroup.Text id="description-create">Description</InputGroup.Text>
                  <Form.Control
                    value={descriptionCreate}
                    onChange={(e) => setDescriptionCreate(e.target.value)}
                    placeholder='Description'
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                  />
              </InputGroup>
              <InputGroup size="lg">
                <InputGroup.Text id="lot-number-create">Lot Number</InputGroup.Text>
                  <Form.Control
                    value={lotNumberCreate}
                    onChange={(e) => setLotNumberCreate(e.target.value)}
                    placeholder='Lot Number'
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                  />
              </InputGroup>
              <Button variant="outline-secondary" onClick={createProduct}>
                  Create
              </Button>
            </Form>
            </Tab>
          </Tabs>
        </Container>
      </Container>
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Product created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {create?.body && (
            <div className="p-3 bg-light rounded">
              <p><strong>ID:</strong> {create.body.ID}</p>
              <p><strong>Name:</strong> {create.body.Name}</p>
              <p><strong>Quantity:</strong> {create.body.Quantity}</p>
              <p><strong>Description:</strong> {create.body.Description}</p>
              <p><strong>Lot Number:</strong> {create.body.LotNumber}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Close
          </Button>
				</Modal.Footer>
        </Modal>
        <Modal show={showProduct} onHide={() => setShowProduct(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product?.body ? (
            <div className="p-3 bg-light rounded">
              <p><strong>ID:</strong> {product.body.ID}</p>
              <p><strong>Name:</strong> {product.body.Name}</p>
              <p><strong>Quantity:</strong> {product.body.Quantity}</p>
              <p><strong>Description:</strong> {product.body.Description}</p>
              <p><strong>Lot Number:</strong> {product.body.LotNumber}</p>
            </div>
          ) : (
            <p>No product found</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProduct(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Inventory;