import { Link } from 'react-router'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const NotFound = () => {
  return (
    <Container className="my-4 d-flex flex-column align-items-stretch">
      <Row>
        <Col lg={10} className="mx-auto text-center">
          <h1 className="display-1">404</h1>
          <h2>Page not found</h2>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg={10} className="mx-auto text-center">
            <Link to="/">Home</Link>
        </Col>
      </Row>
    </Container>
  )
}

export default NotFound;