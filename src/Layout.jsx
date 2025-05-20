import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useNavigate, Outlet } from 'react-router-dom';

function Layout() {
	const navigate = useNavigate();
	const name = sessionStorage.getItem('name');

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
					<Container>
						<Navbar.Brand href="#home">Shiplink - Smart Despatch</Navbar.Brand>
						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="me-auto">
								<Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice')}>Create</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice/filter')}>Filter</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice/update')}>Update</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice/list')}>All Advices</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice/update/status')}>Status</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice/product')}>Inventory</Nav.Link>
								<Nav.Link onClick={() => navigate('/despatchAdvice/delete')}>Delete</Nav.Link>
							</Nav>
							<Navbar.Text className='ms-auto'>
								Signed in as: <a href="#login">{name || 'guest'}</a>
							</Navbar.Text>
						</Navbar.Collapse>
					</Container>
				</Navbar>

				<div className="w-100">
  				<Outlet />
				</div>
    </>
  );
}

export default Layout;