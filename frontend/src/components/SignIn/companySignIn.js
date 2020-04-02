import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from "react-redux"
import cookie from 'react-cookies';
import { companyLogin } from '../../js/actions/loginAction';

class companySignIn extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }
        this.props.companyLogin(data);
    }
    render() {
        let redirectVar = null, alertElement = null;
        if (cookie.load("CID")) {
            redirectVar = <Redirect to="/companyProfile" />
        }
        if (this.props.isLoggedIn != null && !this.props.isLoggedIn) {
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
                        required /><br />
                    <button className='btn btn-primary btn-xs' type="submit">Sign In</button><br /><br />
                    {alertElement}
                </form>
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoggedIn: state.Login.isLoggedIn
    };
}
export default connect(mapStateToProps, { companyLogin })(companySignIn);
