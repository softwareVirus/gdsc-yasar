import React from "react";
import "../style/Input.css"; // Import the CSS file

const Input = ({ className, placeholder, maxLength, name, onChange, type }) => {
  return (
    <div className={"input-container " + className}>
      <input
        autoComplete={false}
        type={type ? type : "text"}
        name={name}
        onChange={onChange}
        onFocus={(e) => (e.target.placeholder = "")}
        onBlur={(e) => (e.target.placeholder = placeholder)}
        className="input-style"
        placeholder={placeholder}
        maxLength={maxLength}
        size={maxLength + 4}
      />
    </div>
  );
};

export default Input;
