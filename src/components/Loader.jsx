import Spinner from 'react-bootstrap/Spinner';

const Loader = () => {
  return (
    <Spinner 
      animation="border" 
      variant="primary" 
      size="lg" 
      role="status"
      className="d-block mx-auto my-5">
        <span className="visually-hidden">Loading...</span>
    </Spinner>
  )
}

export default Loader;