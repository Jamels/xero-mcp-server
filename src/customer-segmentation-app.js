// App.js
import React from 'react';
import CustomerSegmentation from './components/CustomerSegmentation';
import './App.css';

function App() {
  return (
    <div className="App">
      <CustomerSegmentation />
    </div>
  );
}

export default App;

// components/CustomerSegmentation.js
import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import customerData from '../data/customerData';

const CustomerSegmentation = () => {
  // State for view mode
  const [viewMode, setViewMode] = useState('spending');
  const [selectedSegment, setSelectedSegment] = useState(null);
  
  // Select which segments to display based on view mode
  const getSegmentData = () => {
    switch(viewMode) {
      case 'spending':
        return customerData.spendingSegments;
      case 'frequency':
        return customerData.frequencySegments;
      case 'industry':
        return customerData.industrySegments;
      case 'payment':
        return customerData.paymentSegments;
      default:
        return customerData.spendingSegments;
    }
  };

  // Render customer list for the selected segment
  const renderCustomerList = (segment) => {
    return (
      <div className="mt-2 p-4 bg-gray-50 rounded-md max-h-60 overflow-y-auto">
        <h4 className="font-medium mb-2">Customers in this segment:</h4>
        <ul className="list-disc pl-5">
          {segment.customers.map((customer, index) => (
            <li key={index} className="mb-1">{customer}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Customer Segmentation Analysis</h1>
      
      <div className="mb-6">
        <div className="flex space-x-2 mb-4 flex-wrap">
          <button 
            onClick={() => setViewMode('spending')}
            className={`px-4 py-2 rounded-md mb-2 ${viewMode === 'spending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            By Spending
          </button>
          <button 
            onClick={() => setViewMode('frequency')}
            className={`px-4 py-2 rounded-md mb-2 ${viewMode === 'frequency' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
          >
            By Purchase Frequency
          </button>
          <button 
            onClick={() => setViewMode('industry')}
            className={`px-4 py-2 rounded-md mb-2 ${viewMode === 'industry' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
          >
            By Industry
          </button>
          <button 
            onClick={() => setViewMode('payment')}
            className={`px-4 py-2 rounded-md mb-2 ${viewMode === 'payment' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
          >
            By Payment Behavior
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {viewMode === 'spending' && 'Customer Segments by Spending'}
            {viewMode === 'frequency' && 'Customer Segments by Purchase Frequency'}
            {viewMode === 'industry' && 'Customer Segments by Industry'}
            {viewMode === 'payment' && 'Customer Segments by Payment Behavior'}
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getSegmentData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  onClick={(data) => setSelectedSegment(data.name)}
                >
                  {getSegmentData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} customers`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Segment Details</h2>
          {getSegmentData().map((segment, index) => (
            <div 
              key={index} 
              className="mb-4 p-3 border-l-4 rounded cursor-pointer hover:bg-gray-50"
              style={{ borderLeftColor: segment.color }}
              onClick={() => setSelectedSegment(selectedSegment === segment.name ? null : segment.name)}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{segment.name}</h3>
                <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                  {segment.value} customers
                </span>
              </div>
              {(selectedSegment === segment.name) && renderCustomerList(segment)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Top Customers by Total Spending</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={customerData.topCustomers}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ value: 'Amount (AUD)', angle: -90, position: 'insideLeft' }} 
              />
              <Tooltip formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Enterprise Clients (>$5000):</strong> Make up a small portion of our customer base but contribute significantly to revenue. These clients require personalized service and strategic relationship management.
          </li>
          <li>
            <strong>Regular Monthly Clients:</strong> Form our stable revenue base. Focus on retaining these clients with consistent service quality and account management.
          </li>
          <li>
            <strong>Government/Education Sector:</strong> Represents high-value, stable contracts but with longer procurement cycles. Requires specialized compliance knowledge.
          </li>
          <li>
            <strong>Payment Behavior:</strong> Most customers pay on time, but there's an opportunity to improve collections for delayed payment segments.
          </li>
          <li>
            <strong>Cross-Selling Opportunities:</strong> Mid-market clients show potential for expanded services based on their current spending patterns.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerSegmentation;

// data/customerData.js
const customerData = {
  // Customer spending segments based on total invoice amounts
  spendingSegments: [
    { name: 'Enterprise (>$5000)', value: 5, color: '#1e40af', customers: ['DIISR - Small Business Services', 'Ridgeway University', 'ABC Furniture', 'Maddox Publishing Group'] },
    { name: 'Mid-Market ($1000-$5000)', value: 4, color: '#3b82f6', customers: ['Bayside Club', 'Truxton Property Management', 'Boom FM', 'PC Complete'] },
    { name: 'Small Business ($500-$1000)', value: 7, color: '#93c5fd', customers: ['Basket Case', 'Central Copiers', 'City Limousines', 'Rex Media Group', 'Yarra Transport', 'Hamilton Smith Pty', 'Port Phillip Freight'] },
    { name: 'Occasional (<$500)', value: 6, color: '#dbeafe', customers: ['Noah Pocklington', 'Melrose Parking', 'Qantas', 'Gateway Motors', 'MCO Cleaning Services', 'Capital Cab Co', 'PowerDirect'] }
  ],

  // Customer frequency segments based on purchasing patterns
  frequencySegments: [
    { name: 'Regular (Monthly)', value: 6, color: '#15803d', customers: ['DIISR - Small Business Services', 'Hamilton Smith Pty', 'Yarra Transport', 'Port Phillip Freight', 'Rex Media Group', 'Truxton Property Management'] },
    { name: 'Periodic (Quarterly)', value: 4, color: '#22c55e', customers: ['Bayside Club', 'City Limousines', 'Ridgeway University', 'Boom FM'] },
    { name: 'Occasional', value: 8, color: '#86efac', customers: ['ABC Furniture', 'PC Complete', 'Maddox Publishing Group', 'Basket Case', 'MCO Cleaning Services', 'PowerDirect', 'Central Copiers', 'Gateway Motors'] },
    { name: 'One-time', value: 4, color: '#dcfce7', customers: ['Noah Pocklington', 'Melrose Parking', 'Qantas', 'Capital Cab Co'] }
  ],

  // Industries based on customer types
  industrySegments: [
    { name: 'Government/Education', value: 2, color: '#7e22ce', customers: ['DIISR - Small Business Services', 'Ridgeway University'] },
    { name: 'Professional Services', value: 5, color: '#a855f7', customers: ['Hamilton Smith Pty', 'Boom FM', 'Rex Media Group', 'Maddox Publishing Group', 'Truxton Property Management'] },
    { name: 'Transport/Logistics', value: 4, color: '#c084fc', customers: ['Yarra Transport', 'Port Phillip Freight', 'City Limousines', 'Gateway Motors'] },
    { name: 'Retail/Hospitality', value: 4, color: '#e9d5ff', customers: ['ABC Furniture', 'Basket Case', 'Bayside Club', 'Central Copiers'] },
    { name: 'Utilities/Facilities', value: 3, color: '#faf5ff', customers: ['MCO Cleaning Services', 'PowerDirect', 'PC Complete'] },
    { name: 'Other', value: 3, color: '#d1d5db', customers: ['Noah Pocklington', 'Melrose Parking', 'Qantas', 'Capital Cab Co'] }
  ],

  // Payment behavior segments
  paymentSegments: [
    { name: 'Early Payment', value: 5, color: '#b91c1c', customers: ['Qantas', 'Gateway Motors', 'Melrose Parking', 'ABC Furniture', 'Hamilton Smith Pty'] },
    { name: 'On-time Payment', value: 7, color: '#ef4444', customers: ['Port Phillip Freight', 'Rex Media Group', 'Yarra Transport', 'DIISR - Small Business Services (some invoices)', 'Truxton Property Management', 'Maddox Publishing Group'] },
    { name: 'Partial Payment', value: 3, color: '#fca5a5', customers: ['City Limousines', 'Central Copiers', 'DIISR - Small Business Services (some invoices)'] },
    { name: 'Delayed Payment', value: 6, color: '#fee2e2', customers: ['Bayside Club', 'Ridgeway University', 'PC Complete', 'Basket Case', 'MCO Cleaning Services', 'PowerDirect', 'Capital Cab Co'] }
  ],

  // Top customers based on spending
  topCustomers: [
    { name: 'DIISR - Small Business Services', amount: 18011.6 },
    { name: 'ABC Furniture', amount: 6930 },
    { name: 'Ridgeway University', amount: 6187.5 },
    { name: 'Maddox Publishing Group', amount: 4620 },
    { name: 'Bayside Club', amount: 3564 },
    { name: 'PC Complete', amount: 2166.99 },
    { name: 'Boom FM', amount: 1650 },
    { name: 'Truxton Property Management', amount: 1181.25 },
    { name: 'City Limousines', amount: 1760 },
    { name: 'Central Copiers', amount: 1063.56 }
  ],

  // Raw invoice data (sample format)
  invoices: [
    {
      id: 'ORC1041',
      contactId: '860b99a9-0958-4c8d-a98f-bb1f092b16bb',
      contactName: 'DIISR - Small Business Services',
      date: '2025-04-03',
      dueDate: '2025-04-27',
      amount: 4200,
      status: 'AUTHORISED'
    },
    {
      id: 'ORC1040',
      contactId: '3e776c4b-ea9e-4bb1-96be-6b0c7a71a37f',
      contactName: 'Bayside Club',
      date: '2025-04-01',
      dueDate: '2025-04-15',
      amount: 3200,
      status: 'AUTHORISED'
    },
    // Additional invoices would be included here
  ]
};

export default customerData;

// App.css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f3f4f6;
  color: #374151;
}

.App {
  text-align: left;
}

/* package.json */
{
  "name": "customer-segmentation-dashboard",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "recharts": "^2.5.0",
    "web-vitals": "^2.1.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "tailwindcss": "^3.3.1"
  }
}

/* README.md */
# Customer Segmentation Dashboard

This React application provides visualizations of customer segmentation based on purchasing behavior from Xero data.

## Features

- View customer segments by spending levels
- View customer segments by purchase frequency
- View customer segments by industry
- View customer segments by payment behavior
- View top customers by total spending
- Insights about customer behavior

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Dependencies

- React 18
- Recharts (for data visualization)
- Tailwind CSS (for styling)

## Data Structure

Customer data is stored in the `data/customerData.js` file, structured as:

- spendingSegments: Customer segments based on spending levels
- frequencySegments: Customer segments based on purchase frequency
- industrySegments: Customer segments based on industry
- paymentSegments: Customer segments based on payment behavior
- topCustomers: List of top customers by spending
- invoices: Raw invoice data (sample)

## How to Use

- Click on the different segment buttons to switch between views
- Click on a segment in the list to view customers in that segment
- Hover over chart elements to see tooltips with more information
