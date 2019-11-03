import React from 'react'

// class taken from https://github.com/fedosejev/checkboxes-in-react-16/blob/master/src/components/App.js
// last visited: 02.11.2019

const Checkbox = ({ label, isSelected, onCheckboxChange }) => (
    <div className="form-check">
        <label>
            <input
                type="checkbox"
                name={label}
                checked={isSelected}
                onChange={onCheckboxChange}
                className="form-check-input"
            />
            {label}
        </label>
    </div>
);

export default Checkbox;