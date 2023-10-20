import React from 'react'

const Button = ({ type, content, className, onClick}) => {
  return (
    <button className={className} onClick={onClick ? onClick : () => {}}> 
        {content}
    </button>
  )
}

export default Button