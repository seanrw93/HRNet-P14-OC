import { Modal, Button } from 'react-bootstrap';

const SuccessModal = ({
  show,
  onHide,
  title = "Alert",
  message,
  buttonText = "Close",
  buttonVariant = "primary",
  headerVariant = "secondary",
  onConfirm,
  className = "mt-3"
}) => {
  const handleClose = () => {
    if (onConfirm) {
      onConfirm();
    }
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} className={className}>
      <Modal.Header className={`bg-${headerVariant} text-white`} closeButton>
        {title}
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant={buttonVariant}>
          {buttonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SuccessModal;