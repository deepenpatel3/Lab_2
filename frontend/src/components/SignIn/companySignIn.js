import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';


class companySignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            loggedIn: false,
            msg: ''
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
            email: this.state.email,
            password: this.state.password
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/companySignIn', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    loggedIn: true
                })
                localStorage.setItem("CID", response.data[0].ID);
                localStorage.setItem("name", response.data[1].companyName);
            })
            .catch(error => {
                console.log(error);
                this.setState({
                    msg: "Login Failed."
                })
                this.setState({
                    loggedIn: false
                })
            })
    }
    render() {
        let redirectVar = null, alertElement = null;
        if (cookie.load("CID")) {
            redirectVar = <Redirect to="/companyProfile" />
        }
        if (this.state.msg) {
            alertElement = <p className='alert alert-danger'>{this.state.msg}</p>
        }
        return (
            <div className='container'>
                {redirectVar}
                <form style={{ margin: '50px' }} className='form-group' onSubmit={this.handleSubmit}>
                    <h1>Company Sign In:</h1>
                    <input
                        className='form-control'
                        placeholder="Company Email"
                        id="email"
                        type="email"
                        name="email"
                        onChange={this.handleChange}
                        title='Please follow the "characters@characters.domain" (at least 2 characters after the dot) standard for a valid email-id.'
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        required
                        autoFocus /><br />
                    <input
                        className='form-control'
                        placeholder="Password"
                        type="password"
                        id="password"
                        name="password"
                        onChange={this.handleChange}
                        required /><br />
                    <button className='btn btn-primary btn-xs' type="submit">Sign In</button><br /><br />
                    {alertElement}
                </form>
            </div >
        );
    }
}

export default companySignIn;
