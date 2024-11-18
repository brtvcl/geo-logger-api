import React from "react";

function Radio({ label, name, id, value }) {
  return (
    <div className="flex items-center mb-4">
      <input
        id={id}
        type="radio"
        value={value}
        name={name}
        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2 "
      />
      <label htmlFor={id} className="ms-2 text-sm font-medium text-gray-900 ">
        {label}
      </label>
    </div>
  );
}

export default Radio;
