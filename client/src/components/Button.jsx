import React from 'react'
import clsx from 'clsx'

const Button = ({icon, className, label, type, onClick = () =>  //button component
    {}}) => {
    return (
        <button
            type={type || "button"}
            className={clsx("px-3 py-2 outline-none", className)} //button class
            onClick={onClick}
            >
            <span>{label}</span>
            {icon && icon}
        </button>
        );
}; 

export default Button;