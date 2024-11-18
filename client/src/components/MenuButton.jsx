import React from "react";

function MenuButton({ options, selected, onSelect }) {
  return (
    <div className="inline-flex h-full flex-col bg-gray-50">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`${
            selected === option.value ? "bg-blue-200" : ""
          } cursor-pointer p-4`}
        >
          {option.title}
        </div>
      ))}
    </div>
  );
}

export default MenuButton;
