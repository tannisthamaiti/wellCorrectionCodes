import React, { useEffect, useState } from 'react';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export default function ProcessingSteps({ files, onComplete }) {
  const [log, setLog] = useState([]);

  const logStep = (msg) => {
    setLog((prev) => [...prev, msg]);
  };

  useEffect(() => {
    async function process() {
      logStep('📂 Files uploaded to folder.');
      await delay(1000);

      logStep('🔔 Ingestion Agent triggered.');
      await delay(1000);

      logStep('🧠 Extracting Formation Tops...');
      await delay(1000);

      try {
        const response = await fetch('https://c465-5-178-113-239.ngrok-free.app/merge-well-formation');
        const result = await response.json();
        if (response.ok) {
          logStep(`✅ Formation data extracted: ${result.rows} rows saved.`);
        } else {
          logStep(`❌ Error extracting formation tops: ${result.message || 'Unknown error'}`);
          return;
        }
      } catch (err) {
        logStep(`❌ API request failed: ${err.message}`);
        return;
      }

      logStep('🗺️ Extracting Coordinates...');
      await delay(1000);

      logStep('📈 Extracting Production Data...');
      await delay(1000);

      logStep('📑 Parsing LAS files...');
      await delay(1000);

      logStep('🧬 Building composite dataset...');
      await delay(1000);

      const finalData = {
        wells: 5,
        logs: ['GR', 'RHOB', 'NPHI'],
        index: 'WellName + Depth',
        source: 'Well + LAS + Formation CSV',
      };

      logStep('✅ Composite dataset ready!');
      onComplete(finalData);
    }

    process();
  }, []);

  return (
    <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '8px' }}>
      <h4>Pipeline Status</h4>
      <ul>
        {log.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
