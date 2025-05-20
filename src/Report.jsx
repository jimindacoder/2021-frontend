import { useEffect, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';

function Report( {token} ) {
  const [report, setReport] = useState('');
  const [showReport, setShowReport] = useState(false);

  const endOfDayReport = async () => {
    try {
      const response = await axios.get("https://t6r6w5zni9.execute-api.us-east-1.amazonaws.com/v3/despatchAdvice/report", {
				headers: {
					Authorization: token
				}
			});
	
			if (response.status !== 200) {
				alert('Failed to get the report')
			}
			const data = response.data;
      setReport(response.data);
    } catch {
      alert(err.message);
    }
  }

  useEffect(() => {
    endOfDayReport();
  }, [token]);

  return (
    <>
    <Container fluid className="p-0 m-0">
      <div
				className='d-flex justify-content-center align items-center'
				style={{backgroundColor:'#1a1a2e'}}
				>
				<h1 className='display-4 text-center' style={{color: '#f1fafb', marginTop: '5rem', marginBottom: '5rem'}}>
					End of Day Report
				</h1>
			</div>

      {report && (
        <div style={{ maxWidth: '800px', margin: '3rem auto 0 auto' }}>
          <h2 className="text-center"><strong>End Of Day Report</strong></h2>
          <h4>Date: {report.date}</h4>

          <h3>Advices</h3>
          <p>Total Despatch Advices: {report["total despatch"]}</p>
          <p>Earliest Delivery Date: {report["earliest delivery"]}</p>
          <p>Latest Delivery Date: {report["latest delivery"]}</p>
          <p>Number of Advices In Transit: {report["in transit"]}</p>
          <p>Number of Advices Pending: {report["pending"]}</p>
          <p>Number of Advices Packed: {report["packed"]}</p>
          <p>Number of Advices Dispatched: {report["dispatched"]}</p>
          <p>Number of Advices Delivered: {report["delivered"]}</p>

          <h3><strong>Inventory</strong></h3>
          <p>Product(s) with lowest stock: {report["lowest quantity products"].join(", ")}</p>
        </div>
      )}
    </Container>
    </>
  )
}

export default Report;