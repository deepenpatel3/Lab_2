import React, { Component } from 'react';
import CompanyNavbar from '../Navbar/companyNavbar';
import axios from 'axios';
import cookie from "react-cookies";
import { Redirect } from 'react-router-dom';

class CompanyProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyData: {},
            contactFlag: false,
            companyEditFlag: false
        }
        this.editContact = this.editContact.bind(this);
        this.updateContact = this.updateContact.bind(this);
        this.handleCompanyEdit = this.handleCompanyEdit.bind(this);
        this.updateCompanyDetails = this.updateCompanyDetails.bind(this);
    }
    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/getCompanyDetails', { params: { CID: localStorage.getItem("CID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    companyData: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    updateContact = () => {
        let data = { email: document.getElementById('email').value, phone: document.getElementById('phone').value, password: document.getElementById('pswd').value, CID: localStorage.getItem("CID") }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/updateCompanyContact', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    contactFlag: false
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    editContact = () => {
        this.setState({
            contactFlag: true
        })
    }
    handleCancel = () => {
        this.setState({
            contactFlag: false,
            companyEditFlag: false
        })
    }
    handleCompanyEdit = () => {
        this.setState({
            companyEditFlag: true
        })
    }
    updateCompanyDetails = (e) => {
        let data = { companyName: document.getElementById('companyName').value, location: document.getElementById('location').value, description: document.getElementById('description').value, CID: localStorage.getItem("CID") }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/updateCompanyDetails', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    companyEditFlag: false
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    render() {
        let contactOrForm = null, companyOrForm = null, redirectVar = null;
        if (!cookie.load('CID')) {
            redirectVar = <Redirect to="/companySignIn" />;
        }
        if (this.state.contactFlag) {
            contactOrForm =
                <div>
                    <form className="form-group">
                        <input className="form-control" type='text' id='email' name='email' placeholder='Enter your email' required autoFocus />
                        <input className="form-control" type='text' id='phone' name='phone' placeholder='Enter your phone' required />
                        <input className="form-control" type='password' id='pswd' name='pswd' placeholder='Enter password' required />
                        <button style={{ marginTop: '10px' }} className='btn btn-success btn-xs' onClick={this.updateContact}>Save</button>
                        <button style={{ marginTop: '10px' }} className='btn btn-default btn-xs' onClick={this.handleCancel}>Cancel</button>
                    </form>
                </div>

        } else {
            contactOrForm =
                <div>
                    <div className='row'>
                        <div className='col' style={{ marginTop: '3px' }}>
                            <label>Contact US at:</label>
                        </div>
                        <div className='col'>
                            <button className='btn btn-default btn-xs' onClick={this.editContact}>Edit</button>
                        </div>
                    </div>
                    <h5>Email: {this.state.companyData.length > 0 ? this.state.companyData[0].email : null}</h5>
                    <h5>Phone: {this.state.companyData.length > 0 ? this.state.companyData[0].phone : null}</h5>
                </div>
        }
        if (this.state.companyEditFlag) {
            companyOrForm =
                <div>
                    <form className="form-group">
                        <input className="form-control" type='text' id='companyName' placeholder='Enter Company name' required autoFocus />
                        <input className="form-control" type='text' id='location' placeholder='Location' required />
                        <input className="form-control" type='text' id='description' placeholder='Descrption' required />
                        <button style={{ marginTop: '10px' }} className='btn btn-success btn-xs' onClick={this.updateCompanyDetails}>Save</button>
                        <button style={{ marginTop: '10px' }} className='btn btn-default btn-xs' onClick={this.handleCancel}>Cancel</button>
                    </form>
                </div>
        } else {
            companyOrForm =
                <div>
                    <div className='row'>
                        <div className='col'>
                            <h1>{this.state.companyData.length > 0 ? this.state.companyData[0].companyName : null}</h1>
                        </div>
                        <div className='col'>
                            <button className='btn btn-default btn-xs' onClick={this.handleCompanyEdit}>Edit</button>
                        </div>
                    </div>
                    <div style={{ marginTop: '10px' }}><h5>{this.state.companyData.length > 0 ? this.state.companyData[0].location : null}</h5></div>
                    <div style={{ marginTop: '20px' }}>
                        <label>Description:</label>
                        <h4>{this.state.companyData.length > 0 ? this.state.companyData[0].description : null}</h4>
                    </div>
                </div>
        }
        return (
            <div className='container'>
                {redirectVar}
                <CompanyNavbar />
                <div style={{ textAlign: 'center' }} className='col-md-5'>
                    <div className='row'>
                        <div style={{ marginTop: '5px' }} className='col-5'>
                            <label>Profile Picture will go here.</label>

                        </div>
                        <div style={{ marginTop: '6px', textAlign: 'left' }} className='col-7'>
                            {contactOrForm}
                        </div>
                    </div>
                </div>
                <div className='col-md-7'>
                    {companyOrForm}
                </div>
            </div>
        );
    }
}

export default CompanyProfile;