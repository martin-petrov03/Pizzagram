import React from 'react';

function Error(props) {
    return(        
        <div>
            <h3 className="error-message">{props.error}</h3>
            <br/>
        </div>        
    );
}

export default Error;