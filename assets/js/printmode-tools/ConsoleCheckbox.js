const ConsoleCheckbox = ({ checked, id, onChange }) => {
  return (
    <div className="form-check form-check-inline float-end me-0">
      <input type="checkbox" className="form-check-input" id={id} checked={checked} onChange={onChange} />
      <label className="form-check-label" htmlFor={id}>
        <small>Show Console</small>
      </label>
    </div>
  );
};

export default ConsoleCheckbox;
