const Modal = ({ title, onClose, children }) => (
  <>
    <div className="modal d-block" tabIndex="-1" role="dialog" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop show" />
  </>
)

export default Modal