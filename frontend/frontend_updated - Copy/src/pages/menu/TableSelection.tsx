import React from 'react';
import { Table, AlertCircle } from 'lucide-react';

const TableSelection = ({ tableNumber, error, handleTableSelect }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl w-full">
        <div className="flex items-center justify-center mb-6">
          <Table className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Select Your Table</h2>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[...Array(25)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handleTableSelect(index + 1)}
              className="bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors rounded-lg py-3 text-lg font-bold"
            >
              {index + 1}
            </button>
          ))}
        </div>
        <p className="text-gray-600 text-center text-sm">
          Please select your table number to proceed with ordering
        </p>
      </div>
    </div>
  );
};

export default TableSelection;
