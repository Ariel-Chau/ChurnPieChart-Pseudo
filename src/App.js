import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import ChurnPieChart from './ChurnPieChart';
import './App.css';

const App = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/.xlsx')
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const churnData = processChurnData(jsonData);
        setData(churnData);
      })
      .catch(error => {
        console.error('Error loading Excel file:', error);
      });
  }, []);

  const processChurnData = (data) => {
    let churned = 0;
    let retained = 0;
    const churnColumnIndex = 20;
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[churnColumnIndex] && row[churnColumnIndex].toLowerCase() === 'yes') {
        churned++;
      } else if (row[churnColumnIndex] && row[churnColumnIndex].toLowerCase() === 'no') {
        retained++;
      }
    }
    return [
      { category: 'Churned', value: churned },
      { category: 'Retained', value: retained }
    ];
  };

  const calculatePercentages = (data) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    return data.map(item => ({
      ...item,
      percentage: ((item.value / total) * 100).toFixed(2)
    }));
  };

  const enhancedData = data ? calculatePercentages(data) : [];

  return (
    <div className="app-container">
      <h1>Customer Churn Data</h1>
      {data ? (
        <>
          <div className="chart-container">
            < data={data} />
          </div>
          <div className="percentages">
            {enhancedData.map(item => (
              <div key={item.category}>
                <strong>{item.category}</strong>: {item.percentage}% 
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App;
