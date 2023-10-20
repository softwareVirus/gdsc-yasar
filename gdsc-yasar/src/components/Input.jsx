import React from "react";
import "../style/Input.css"; // Import the CSS file

const Input = ({ className, placeholder, maxLength, name, onChange }) => {
  return (
    <div className={"input-container "+className}>
      <input
        type="text"
        name={name}
        onChange={onChange}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = placeholder)}
        className="input-style"
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </div>
  );
};

export default Input;
