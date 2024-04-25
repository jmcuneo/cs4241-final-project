import React, { useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from 'prop-types';

function AddGuest(){
    return(
        <div>
            <Popup trigger=
                       {<button> Add Guest </button>}
                   modal nested>
                {
                    close => (
                        <div className='modal'>
                            <div className='content'>
                                <input type="text"><input/>
                            </div>
                            <div>
                                <button onClick=
                                            {() => close()}>
                                    Back
                                </button>
                                <button onSubmit={}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
)
}

export default AddGuest;