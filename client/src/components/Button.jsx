import React from "react";

function Button({ children, variant = "default", ...props }) {
  const variants = {
    default:
      "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded",
    secondary:
      "border border-green-500 hover:bg-green-200 text-green-500 font-bold py-2 px-4 rounded",
  };
  return (
    <button {...props} className={`${variants[variant]} ${props.className}`}>
      {children}
    </button>
  );
}

export default Button;
