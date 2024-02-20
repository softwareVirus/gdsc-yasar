import React from 'react'

const Button = ({ type, content, className, onClick, disabled}) => {
  return (
    <button className={className} onClick={onClick ? onClick : () => {}} disabled={disabled}> 
        {content}
    </button>
  )
}

export default Button