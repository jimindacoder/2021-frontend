import Container from 'react-bootstrap/Container';


function Dashboard () {
  const name = sessionStorage.getItem('name');

  return (
    <>
      <Container fluid className="p-0 m-0">
        <div
          className='d-flex flex-column justify-content-center align-items-center'
          style={{
            backgroundColor:'#1a1a2e',
            width: '100%'
          }}
          >
          <h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem'}}>
            {`Welcome, ${name || 'Guest'}!`}
          </h1>
          <h3
            className='display-7 text-center'
            style={{
              color: '#f1fafb',
              marginTop: '3rem',
              marginBottom: '4rem',
              marginLeft: '3rem',
              marginRight: '3rem'
            }}>
            Streamlining the despatch process with powerful query tools, inventory management, and easy updates.
          </h3>
        </div>
        
      </Container>
    </>
  );
}

export default Dashboard