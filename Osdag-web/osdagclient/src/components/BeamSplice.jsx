import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BeamSplice.css'; // Import the CSS file
import Dropdown from './Dropdown'; // Import the reusable Dropdown

// --- Mock Data for Dropdowns (Replace with API calls later) ---
const materialOptions = [
  { value: 'E250 (Fe 410W) A', label: 'E250 (Fe 410W) A' },
  { value: 'E300 (Fe 440)', label: 'E300 (Fe 440)' },
  { value: 'E350 (Fe 490)', label: 'E350 (Fe 490)' },
];

const boltGradeOptions = [
  { value: '4.6', label: '4.6' },
  { value: '8.8', label: '8.8' },
  { value: '10.9', label: '10.9' },
];

const boltDiameterOptions = [
  { value: 16, label: '16 mm' },
  { value: 20, label: '20 mm' },
  { value: 24, label: '24 mm' },
];

const plateThicknessOptions = [
    { value: 8, label: '8 mm' },
    { value: 10, label: '10 mm' },
    { value: 12, label: '12 mm' },
    { value: 16, label: '16 mm' },
    { value: 20, label: '20 mm' },
];

// --- Basic SVG Visualization Component ---
const BasicVisualization = ({ data }) => {
  if (!data || data.type !== 'placeholder' || !data.details) {
    return <div className="visualization-placeholder">3D/2D View Area</div>;
  }

  const { plate_dims, bolt_positions, beam_depth } = data.details;
  const plateHeight = plate_dims[1] || 200;
  const plateWidth = plate_dims[0] || 150;
  const viewHeight = Math.max(plateHeight, beam_depth || 0) + 40;
  const viewWidth = plateWidth + 40;

  // Simple scaling/positioning
  const scale = 0.8;
  const offsetX = viewWidth / 2;
  const offsetY = viewHeight / 2;

  return (
    <svg width="100%" height="300" viewBox={`0 0 ${viewWidth} ${viewHeight}`} style={{ border: '1px solid lightgray' }}>
      {/* Plate */}
      <rect
        x={offsetX - (plateWidth * scale) / 2}
        y={offsetY - (plateHeight * scale) / 2}
        width={plateWidth * scale}
        height={plateHeight * scale}
        fill="lightblue"
        stroke="blue"
        strokeWidth="1"
      />
      {/* Bolts */}
      {bolt_positions.map((pos, index) => (
        <circle
          key={index}
          cx={offsetX + pos[0] * scale} // Assuming pos[0] is horizontal offset from center
          cy={offsetY + (pos[1] - plateHeight / 2) * scale} // Assuming pos[1] is vertical offset from top edge
          r={5 * scale} // Fixed radius for representation
          fill="gray"
        />
      ))}
       <text x="10" y="20" fontSize="12">Basic Viz (Placeholder)</text>
    </svg>
  );
};

const BeamSplice = () => {
  const [formData, setFormData] = useState({
    // Member Details
    connectivity: 'Beam-Beam',
    supporting_section: 'ISMB300',
    supported_section: 'ISMB300',
    material: 'E250 (Fe 410W) A',
    // Load Details
    shear_force: 100,
    axial_force: 0,
    moment: 0,
    // Plate Details
    plate_thickness: 10,
    // Bolt Details
    bolt_type: 'Bearing',
    bolt_grade: '8.8',
    bolt_diameter: 20,
    bolt_hole_type: 'Standard',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Can store string or object
  const [result, setResult] = useState(null); // Stores the structured response


  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let parsedValue = value;

    if (type === 'number') {
        // Prevent negative numbers, allow empty string for clearing
        const numValue = parseFloat(value);
        if (value === '' || (!isNaN(numValue) && numValue >= 0)) {
            parsedValue = value === '' ? '' : numValue; // Keep empty string or use non-negative number
        } else if (!isNaN(numValue) && numValue < 0) {
             // If negative, ignore the change or set to 0 (here we ignore)
             // Or optionally: parsedValue = 0;
             return; // Prevent state update for invalid negative input
        }
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  // Reset form and results
  const handleReset = () => {
      setFormData({
        connectivity: 'Beam-Beam', supporting_section: 'ISMB300', supported_section: 'ISMB300',
        material: 'E250 (Fe 410W) A', shear_force: 100, axial_force: 0, moment: 0,
        plate_thickness: 10, bolt_type: 'Bearing', bolt_grade: '8.8', bolt_diameter: 20,
        bolt_hole_type: 'Standard',
      });
      setError(null);
      setResult(null);
      setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Prepare data in the format expected by the backend
    // Use dot notation as seemingly expected by Osdag structure
    const backendData = {
        "Module": "Beam Splice End Plate", // This should match an ID Osdag recognizes
        "Load.Shear": formData.shear_force,
        "Load.Axial": formData.axial_force,
        "Load.Moment": formData.moment,
        "Member.Supporting_Section.Designation": formData.supporting_section,
        "Member.Supported_Section.Designation": formData.supported_section,
        "Material": formData.material,
        "Connectivity": formData.connectivity,
        "Bolt.Type": formData.bolt_type,
        "Bolt.Grade": formData.bolt_grade,
        "Bolt.Diameter": formData.bolt_diameter,
        "Bolt.Bolt_Hole_Type": formData.bolt_hole_type,
        "Connector.Plate.Thickness": formData.plate_thickness, // Adjust key if needed
        // Add other necessary fields based on actual Osdag module requirements
        // e.g., "Detailing.Gap", "Weld.Fab" etc.
    };

    console.log("Sending to backend:", backendData);

    try {
      const response = await axios.post('/api/beam-splice-design/', backendData);
      setResult(response.data); // Store the structured response
      console.log("Backend Response:", response.data);
      // Error state is reset here
      setError(null);
    } catch (err) {
      console.error("API Error:", err);
      if (err.response) {
          // Handle structured validation errors or other backend errors
          if (err.response.data && err.response.data.status === 'Validation Error') {
              setError({ type: 'validation', errors: err.response.data.errors });
          } else {
              setError({ type: 'api', message: err.response.data?.errors || err.response.data?.detail || err.message || 'An API error occurred.'});
          }
      } else {
          // Network or other errors
          setError({ type: 'network', message: err.message || 'A network error occurred.' });
      }
      setResult(null); // Clear previous results on error
    } finally {
      setIsLoading(false);
    }
  };

  // --- Input Group Components (Optional but good for structure) ---
  const InputGroup = ({ title, children }) => (
    <div className="input-group">
      <h4>{title}</h4>
      {children}
    </div>
  );

  const FormRow = ({ label, children, fieldName }) => (
     <div className="form-row">
        <label htmlFor={fieldName}>{label}:</label>
        {children}
        {/* Placeholder for field-specific validation error */}
        {error && error.type === 'validation' && error.errors && error.errors[fieldName] && (
            <span className="validation-error">{error.errors[fieldName].join(', ')}</span>
        )}
      </div>
  );

  // --- Helper to display results nicely ---
  const RenderResults = ({ results }) => {
      if (!results) return null;
      return (
          <div className="results-summary">
              {Object.entries(results).map(([key, value]) => (
                  <div key={key} className="result-item">
                      <span className="result-key">{key.replace(/_/g, ' ').replace(/kn|mm/g, '').replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="result-value">{value} {key.includes('kn') ? 'kN' : key.includes('mm') ? 'mm' : ''}</span>
                  </div>
              ))}
          </div>
      );
  };

  return (
    <div className="module-container">
      <h2 className="module-title">Beam Splice: End Plate Connection</h2>
      <div className="module-content">
        {/* --- Left Column: Input --- */}
        <div className="column column-input">
          <form onSubmit={handleSubmit} className="input-form">
            {/* Wrap Input Groups in a scrollable div */}
            <div className="input-groups-container">
                <InputGroup title="Member Details">
                  {/* Using the reusable Dropdown component */}
                   <Dropdown
                     label="Material"
                     name="material"
                     value={formData.material}
                     options={materialOptions}
                     onChange={handleInputChange}
                   />
                  {/* Add Dropdowns/Inputs for Section selection here */}
                   <FormRow label="Supporting Section" fieldName="Member.Supporting_Section.Designation">
                     <input type="text" id="supporting_section" name="supporting_section" value={formData.supporting_section} onChange={handleInputChange} />
                   </FormRow>
                   <FormRow label="Supported Section" fieldName="Member.Supported_Section.Designation">
                     <input type="text" id="supported_section" name="supported_section" value={formData.supported_section} onChange={handleInputChange} />
                   </FormRow>
                </InputGroup>
    
                <InputGroup title="Load Details (Factored)">
                  <FormRow label="Shear Force (kN)" fieldName="Load.Shear">
                    <input type="number" id="shear_force" name="shear_force" value={formData.shear_force} onChange={handleInputChange} min="0" />
                  </FormRow>
                   <FormRow label="Axial Force (kN)" fieldName="Load.Axial">
                     <input type="number" id="axial_force" name="axial_force" value={formData.axial_force} onChange={handleInputChange} min="0" />
                  </FormRow>
                   <FormRow label="Moment (kNm)" fieldName="Load.Moment">
                     <input type="number" id="moment" name="moment" value={formData.moment} onChange={handleInputChange} min="0" />
                  </FormRow>
                </InputGroup>
    
                <InputGroup title="End Plate Details">
                   <Dropdown
                      label="Thickness (mm)"
                      name="plate_thickness"
                      value={formData.plate_thickness}
                      options={plateThicknessOptions}
                      onChange={handleInputChange}
                    />
                </InputGroup>
    
                 <InputGroup title="Bolt Details">
                   {/* Bolt Type Dropdown */}
                   <Dropdown
                     label="Grade"
                     name="bolt_grade"
                     value={formData.bolt_grade}
                     options={boltGradeOptions}
                     onChange={handleInputChange}
                   />
                   <Dropdown
                     label="Diameter (mm)"
                     name="bolt_diameter"
                     value={formData.bolt_diameter}
                     options={boltDiameterOptions}
                     onChange={handleInputChange}
                   />
                </InputGroup>
            </div> {/* End scrollable div */}

            {/* Action buttons outside the scrollable area but inside the form/column */}
            <div className="form-actions">
                <button type="submit" className="button-design" disabled={isLoading}>
                    {isLoading ? 'Designing...' : 'Design'}
                </button>
                <button type="reset" className="button-reset" onClick={handleReset}>Reset</button>
            </div>

            {/* Display General API or Network Errors */}
            {error && error.type !== 'validation' && <div className="error-message">Error: {error.message}</div>}

          </form>
        </div>

        {/* --- Middle Column: Visualization --- */}
        <div className="column column-visualization">
          <h4>Visualization</h4>
          <BasicVisualization data={result?.visualization_data} />
        </div>

        {/* --- Right Column: Output --- */}
        <div className="column column-output">
          <h4>Output</h4>
           <div className="output-placeholder">
               {isLoading && <p>Calculating...</p>}
               {result && result.status === 'Success' && (
                    <div className="success-message">Design Status: {result.message}</div>
               )}
               {result && result.status === 'Fail' && (
                   <div className="error-message">Design Status: {result.message}</div>
               )}
               {result && result.results && <RenderResults results={result.results} />}
               {!isLoading && !result && !error && <p>Enter inputs and click Design.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default BeamSplice;