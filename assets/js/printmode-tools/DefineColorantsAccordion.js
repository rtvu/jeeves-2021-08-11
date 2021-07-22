import DefineColorantsInput from "./DefineColorantsInput";

const DefineColorantsAccordion = () => {
  return (
    <div className="accordion mb-3">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            type="button"
            className="accordion-button collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#customize-colorants-body-1"
          >
            Define Colorants
          </button>
        </h2>
        <div id="customize-colorants-body-1" className="accordion-collapse collapse">
          <div className="accordion-body">
            <div className="row">
              <div className="col-12 col-lg-6">
                <DefineColorantsInput />
              </div>
              <div className="col-12 col-lg-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineColorantsAccordion;
