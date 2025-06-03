export default function DigitalTwin() {
    return (
      <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", background: "#f0f0f0" }}>
        {/* Header */}
        <div style={{ padding: "1rem", fontSize: "1.5rem", fontWeight: "bold" }}>
          Well Vizualization
        </div>
  
        {/* Main content: split into 60% left, 40% right */}
        <div style={{ flex: 1, display: "flex" }}>
          {/* Left side: placeholder for 3D or video */}
          <div style={{ flex: 6, background: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <video width="95%" height="95%" controls>
                <source src="SeismicSection3D.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            </div>
  
          {/* Right side: info panel */}
          <div style={{ flex: 4, background: "#fafafa", padding: "1rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {/* Info table */}
            <div>
              <h3>Layer zone</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td>Shale Volume</td><td style={{ textAlign: "left" }}>26.3%</td></tr>
                  <tr><td>Water Saturation</td><td style={{ textAlign: "left" }}>50.6%</td></tr>
                  <tr><td>Total Porosity</td><td style={{ textAlign: "left" }}>28.8%</td></tr>
                  <tr><td>Effective Porosity</td><td style={{ textAlign: "left" }}>18.9%</td></tr>
                  <tr><td>Lithology type</td><td style={{ textAlign: "left", fontWeight: "bold" }}>Upper Donovan</td></tr>
                  <tr><td>Depth</td><td style={{ textAlign: "left" }}>2980.5 m</td></tr>
                </tbody>
              </table>
  
              <h3 style={{ marginTop: "1.5rem" }}>Effective Porosity</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr><td>No of cores</td><td style={{ textAlign: "left" }}>3</td></tr>
                  <tr><td>Depth of Core</td><td style={{ textAlign: "left" }}>1789.8, 2134.5</td></tr>
                  <tr><td>Core Properties</td><td style={{ textAlign: "left" }}>3enwd-</td></tr>
                </tbody>
              </table>
            </div>
  
            {/* Load Graph Button */}
            <div>
              <button style={{ width: "100%", padding: "0.75rem", background: "black", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                LOAD GRAPH
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  