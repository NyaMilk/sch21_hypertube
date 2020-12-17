import React, { useEffect, useState } from "react";
import { Alert } from "reactstrap";

export const Info = (props) => {
    const [isVisible, setClose] = useState(true);
    const color = props.isSuccess ? 'success' : 'danger';

    useEffect(() => {
        if (isVisible) {
            window.setTimeout(() => {
                setClose(!isVisible);
            }, 5000);
        }
    }, [isVisible]);

    // if (props.info === 'alert')
    return (
        <Alert isOpen={props.info === 'alert' ? isVisible : ''} color={color}>{props.message}</Alert>
    );
    // if (props.info === 'message')
    //     return (
    //         <Alert color={color}>{props.register.infoMsg}</Alert>
    //     );
}
