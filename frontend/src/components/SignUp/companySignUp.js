import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

export default class companySignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            companyName: '',
            email: '',
            password: '',
            location: '',
            signedUp: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            companyName: this.state.companyName,
            email: this.state.email,
            password: this.state.password,
            location: this.state.location
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/companySignUp', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    signedUp: true
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {
        let redirectVar = null;
        if (this.state.signedUp) {
            redirectVar = <Redirect to='/companySignIn' />
        }
        return (
            <div className='container'>
                {redirectVar}
                <form style={{ margin: '50px' }} className='form-group' onSubmit={this.handleSubmit}>
                    <h1>Company Sign Up:</h1>
                    <input
                        className='form-control'
                        placeholder="Company Name"
                        id="companyName"
                        type="text"
                        name="companyName"
                        onChange={this.handleChange}
                        required
                        autofocus /><br />
                    <input
                        className='form-control'
                        placeholder="Company Email"
                        id="email"
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        title='Please follow the "characters@characters.domain" (at least 2 characters after the dot) standard for a valid email-id.'
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        required /><br />
                    <input
                        className='form-control'
                        placeholder="Password"
                        type="password"
                        id="password"
                        name="password"
                        onChange={this.handleChange}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required /><br />
                    <input
                        className='form-control'
                        placeholder="Location"
                        type="text"
                        id="location"
                        name="location"
                        onChange={this.handleChange}
                        required /><br />
                    <button className='btn btn-primary btn-xs' type="submit">Sign Up</button>
                    <Link style={{ marginLeft: '10px' }} className='btn btn-primary btn-xs' to='/companySignIn'>Already have an account?</Link>
                </form>
            </div>
        );
    }
}