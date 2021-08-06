import DefineMaskset from "./DefineMaskset";

const DefineMasksetAccordion = () => {
  return (
    <div className="accordion mb-3">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            type="button"
            className="accordion-button collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#customize-maskset-body-1"
          >
            Define Maskset
          </button>
        </h2>
        <div id="customize-maskset-body-1" className="accordion-collapse collapse">
          <div className="accordion-body">
            <DefineMaskset />
            {/* <DefineMasksetChart />
            <div className="row">
              <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <DefineMaskset />
              </div>
              <div className="col-12 col-lg-6">
                <DefineMasksetConsole />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineMasksetAccordion;
