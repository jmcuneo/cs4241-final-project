import React, {ReactElement} from 'react';
import Homepage from "../routes/Homepage";

function LoginCheck(props: { component: ReactElement }) {

    console.log(localStorage.getItem("accessToken"));
    return (
        <>
        {
            localStorage.getItem("accessToken") === null ?
                <Homepage /> :
                props.component
        }
        </>
    );
}

export default LoginCheck;
