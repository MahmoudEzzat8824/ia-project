import React, { useState } from 'react';

function EditButton({ onSave }) {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        if (onSave) {
            onSave(inputValue);
        }
        setIsEditing(false);
        setInputValue('');
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <button
                className='EditButton'
                onClick={handleEditClick}
            >
                Edit
            </button>
            {isEditing && (
                <>
                    <input
                        className='editProfileTextBox'
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Enter new value"
                    />
                    <button
                        className='SaveEditButton'
                        onClick={handleSaveClick}
                    >
                        Save
                    </button>
                </>
            )}
        </>
    );
    
}

export default EditButton;