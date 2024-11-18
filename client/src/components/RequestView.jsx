import React from "react";

function RequestView({ children }) {
  return (
    <div className="h-[50vh] max-h-[50vh] overflow-scroll flex">{children}</div>
  );
}

export default RequestView;
