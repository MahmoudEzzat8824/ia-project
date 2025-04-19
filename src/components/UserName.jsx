import React from 'react';
import { useState } from 'react';
import Axios from 'axios';
import axios from 'axios';

function UserName() {
    const[name, SetName]  = useState("")
    axios.get()
    return (
        <h1 className='username'>{name}</h1>
    );
}

export default UserName;
