import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import BasicDetails from './BasicDetails';
import ContactInfo from './ContactInfo';
import CareerObjective from './CareerObjective';
import EducationDetails from './EducationDetails';
import Experience from './Experience';
import Skills from './Skills';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let redirectVar = null;
        if (!cookie.load("SID")) {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div className="container">
                {redirectVar}
                <Navbar />
                <div className='col-md-4'>
                    <div style={{ border: '1px dotted black' }}> <BasicDetails /> </div>
                    {/* <div style={{ border: '1px dotted black' }}> <ContactInfo /> </div>
                    <div style={{ border: '1px dotted black' }}> <Skills /> </div> */}
                </div>
                {/* <div className='col-md-8'>
                    <div style={{ border: '1px dotted black' }}><CareerObjective /></div>
                    <div style={{ border: '1px dotted black' }}><EducationDetails /></div>
                    <div style={{ border: '1px dotted black' }}><Experience /></div>
                </div> */}
            </div>
        );
    }
}

export default Profile;