import React from 'react'
import "../../pages.css"

// class taken and modified from https://github.com/fedosejev/checkboxes-in-react-16/blob/master/src/components/App.js
// last visited: 02.11.2019

const Checkbox = ({ label, isSelected, onCheckboxChange }) => (
    <div className="configuration-text">
        <label>
            <input
                type="checkbox"
                name={label}
                checked={isSelected}
                onChange={onCheckboxChange}
            /> &nbsp;
            {label}
        </label>
    </div>
);

export default Checkbox;