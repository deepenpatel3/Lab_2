import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';

export default class StudentSignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            city: '',
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
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            city: this.state.city,
            school: this.state.school
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/studentSignUp', data)
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
            redirectVar = <Redirect to='/studentSignIn' />
        }
        return (
            <div className='container'>
                {redirectVar}
                <form style={{ margin: '50px' }} className='form-group' onSubmit={this.handleSubmit}>
                    <h1>Student Sign Up:</h1>
                    <input
                        className='form-control'
                        placeholder="Name"
                        id="name"
                        type="text"
                        name="name"
                        onChange={this.handleChange}
                        required
                        autofocus /><br />
                    <input
                        className='form-control'
                        placeholder="Email"
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
                        placeholder="City"
                        type="text"
                        id="city"
                        name="city"
                        onChange={this.handleChange}
                        required /><br />
                    <input
                        className='form-control'
                        placeholder="School"
                        type="text"
                        id="school"
                        name="school"
                        onChange={this.handleChange}
                        required /><br />
                    <button className='btn btn-primary btn-xs' type="submit">Sign Up</button>
                    <Link style={{ marginLeft: '10px' }} className='btn btn-primary btn-xs' to='/studentSignIn'>Already have an account?</Link>
                </form>
            </div>
        );
    }
}