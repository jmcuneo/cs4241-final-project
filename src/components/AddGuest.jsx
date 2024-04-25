import React, { useState, useRef } from 'react';
import Popup from 'reactjs-popup';

function AddGuest(){
    const handleSubmit = (e) => {
        e.preventDefault();
        //add to database
    }

    return(
        <div>
            <Popup trigger={<button> Add Guest </button>} modal nested>
                {close => (
                    <div className='modal'>
                        <div className='content'>
                            <form onSubmit={handleSubmit}>
                                <input type="text" />
                                <button onClick={() => close()}>Back</button>
                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    </div>
                )}
            </Popup>
        </div>
    )
}

export default AddGuest;