import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Root extends Component {
    render() {
        return (
            <div className='container'>
                <div style={{ margin: '50px' }}>
                    <h1>Choose Your Role:</h1>
                    <Link style={{ marginTop: '10px' }} className='btn btn-primary btn-xs' to="/studentSignUp">Student</Link><br />
                    <Link style={{ marginTop: '10px' }} className='btn btn-primary btn-xs' to="/companySignUp">Company</Link>
                </div>
            </div>
        );
    }
}

export default Root;