import React, { useState } from 'react';
import { Input, Modal } from 'antd';
import spacingIMG from '../assets/spacing_3.png';
import capacityIMG1 from '../assets/L_shear1.png';
import capacityIMG2 from '../assets/L.png';

const placeholderOutput = {
  Bolt: [
    { label: "Gauge Distance (mm)", val: 0 },
    { label: "Diameter (mm)", val: 0 },
    { label: "Property Class", val: 0 },
    { label: "Bolt Columns (nos)", val: 0 },
    { label: "Bolt Rows (nos)", val: 0 },
    { label: "Bolt Force (kN)", val: 0 },
    { label: "Bolt Value (kN)", val: 0 },
    { label: "Spacing", val: 0 },
    { label: "Section Details", val: 0 },
    { label: "Capacity", val: 0 }
  ],
  Cleat: [
    { label: "Cleat Angle Designation", val: 0 },
    { label: "Shear Yielding Capacity (kN)", val: 0 },
    { label: "Block Shear Capacity (kN)", val: 0 },
    { label: "Moment Demand (kNm)", val: 0 },
    { label: "Moment Capacity (kNm)", val: 0 },
    { label: "Bolt Columns (nos)", val: 0 },
    { label: "Bolt Rows (nos)", val: 0 },
    { label: "Bolt Force (kN)", val: 0 }
  ],
  Plate: [
    { label: "Height (mm)", val: 0 },
  ]
};

const CleatAngleOutputDock = ({ output }) => {
  const [spacingModel, setSpacingModel] = useState(false);
  const [capacityModel, setCapacityModel] = useState(false);

  const handleDialogSpacing = (value) => {
    if (value === 'Spacing') {
      setSpacingModel(true);
    } else if (value === 'Capacity') {
      setCapacityModel(true);
    } else {
      setSpacingModel(false);
      setCapacityModel(false);
    }
  };

  return (
    <div>
      <h5>Output Dock</h5>
      <div className="subMainBody scroll-data">
        {output && Object.keys(output).length ? (
          Object.keys(output).map((key, index) => (
            <>
              <div key={index}>
                <h3>{key}</h3>
                <div>
                  {Object.values(output[key]).map((elm, index1) => {
                    return (
                      <div key={index1} className="component-grid">
                        <div>
                          <h4>{elm.label}</h4>
                        </div>
                        <div>
                          <Input
                            type="text"
                            style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                            name={`${key}_${elm.label}`}
                            value={elm.val}
                            disabled
                          />
                        </div>
                        {index1 === Object.values(output[key]).length - 1 && (
                          <>
                            <div>
                              <h4>{key === "Bolt" ? "Spacing" : "Capacity"}</h4>
                            </div>
                            <div>
                              <Input
                                className="btn"
                                type="button"
                                value={key === "Bolt" ? "Spacing" : "Capacity"}
                                onClick={() => handleDialogSpacing(key === "Bolt" ? "Spacing" : "Capacity")}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              {key === "Bolt" && (
                <div style={{ marginTop: '7px', marginBottom: '7px' }}>
                  <h4>Section Details</h4>
                  <div className="component-grid">
                    <div>
                      <h4>Capacity</h4>
                    </div>
                    <div>
                      <Input
                        className="btn"
                        type="button"
                        value={"Capacity"}
                        onClick={() => handleDialogSpacing("Capacity")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          ))
        ) : (
          <div>
            {Object.keys(placeholderOutput).map((key, index) => (
              <>
                <div key={index}>
                  <h3>{key}</h3>
                  <div>
                    {Object.values(placeholderOutput[key]).map((elm, index1) => (
                      <div key={index1} className="component-grid" style={{ userSelect: 'none' }}>
                        <div>
                          <h4>{elm.label}</h4>
                        </div>
                        <div>
                          <Input
                            type="text"
                            style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                            name={`${key}_${elm.label}`}
                            value={' '}
                            disabled
                          />
                        </div>
                        {index1 === Object.values(placeholderOutput[key]).length - 1 && (
                          <>
                            <div>
                              <h4>{key === "Bolt" ? "Spacing" : "Capacity"}</h4>
                            </div>
                            <div>
                              <Input
                                className="btn"
                                type="button"
                                value={key === "Bolt" ? "Spacing" : "Capacity"}
                                disabled
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {key === "Plate" && (
                  <div style={{ marginTop: '7px', marginBottom: '7px' }}>
                    <h4>Section Details</h4>
                    <div className="component-grid">
                      <div>
                        <h4>Capacity</h4>
                      </div>
                      <div>
                        <Input className="btn" type="button" value={"Capacity"} disabled />
                      </div>
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </div>

      {/* Spacing */}
      <Modal visible={spacingModel} onCancel={() => setSpacingModel(false)} footer={null} width={'100vh'}>
        <>
          <div style={{ textAlign: 'center' }}>
            <h3>Spacing Details</h3>
          </div>
          <div>
            <p style={{ padding: '20px' }}>
              Note: Representative image for Spacing Details - 3 x 3 pattern considered
            </p>
          </div>
          <div className="spacing-main-body">
            <div className="spacing-left-body">
              {["Pitch Distance (mm)", "End Distance (mm)", "Gauge Distance (mm)", "Edge Distance (mm)"].map(
                (label) => (
                  <div key={label}>
                    <h4>{label}</h4>
                    <Input
                      type="text"
                      style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                      readOnly={true}
                      value={output && output.Bolt && output.Bolt.find((val) => val.label === label)?.val || "0"}
                    />
                  </div>
                )
              )}
            </div>
            <div className="spacing-right-body">
              <img src={spacingIMG} alt="SpacingImage" />
            </div>
          </div>
        </>
      </Modal>

      {/* Capacity */}
      <Modal
        visible={capacityModel}
        onCancel={() => setCapacityModel(false)}
        footer={null}
        width={'120vh'}
        style={{ maxHeight: '800px', overflow: 'auto' }}
      >
        <>
          <div style={{ textAlign: 'center' }}>
            <h3>Capacity Details</h3>
          </div>
          <div>
            <p style={{ padding: '20px' }}>
              Note: Representative image for Failure Pattern (Half Plate) - 2 x 3 Bolt pattern considered
            </p>
          </div>
          <div className="Capacity-main-body">
            {["Failure due Shear in Plate", "Failure due Tension in Plate", "Section 3"].map((section, idx) => (
              <div key={idx}>
                <div className="Capacity-sub-body-title">
                  <h4>{section}</h4>
                </div>
                <div className="Capacity-sub-body">
                  <div className="Capacity-left-body">
                    {["Shear Yielding Capacity (kN)", "Rupture Capacity (kN)", "Block Shear Capacity (kN)"].map((label) => (
                      <div key={label}>
                        <h4>{label}</h4>
                        <Input
                          type="text"
                          style={{ color: 'rgb(0 0 0 / 67%)', fontSize: '12px', fontWeight: '500' }}
                          readOnly={true}
                          value={output && output.Plate && output.Plate.find((val) => val.label === label)?.val || "0"}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="Capacity-right-body">
                    {idx === 0 && <img src={capacityIMG1} alt="capacityIMG1" />}
                    {idx === 1 && <img src={capacityIMG2} alt="capacityIMG2" />}
                    {idx === 2 && <h5>Block Shear Pattern</h5>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </Modal>
    </div>
  );
};

export default CleatAngleOutputDock;
