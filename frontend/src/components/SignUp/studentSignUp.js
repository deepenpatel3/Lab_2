import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { studentSignup } from '../../js/actions/loginAction';
import { connect } from 'react-redux';
import cookie from 'react-cookies'

class StudentSignUp extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            city: document.getElementById("city").value,
            school: document.getElementById("school").value
        }
        this.props.studentSignup(data);
    }
    render() {
        let redirectVar = null, alertElement = null;
        if (cookie.load("SID")) {
            redirectVar = <Redirect to='/profile' />
        }
        if (this.props.isSignedUp != null && !this.props.isSignedUp) {
            alertElement = <p className='alert alert-danger'>Email Already registered</p>
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
                        required
                        autofocus /><br />
                    <input
                        className='form-control'
                        placeholder="Email"
                        id="email"
                        type="email"
                        name="email"
                        title='Please follow the "characters@characters.domain" (at least 2 characters after the dot) standard for a valid email-id.'
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        required /><br />
                    <input
                        className='form-control'
                        placeholder="Password"
                        type="password"
                        id="password"
                        name="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                        required /><br />
                    <input
                        className='form-control'
                        placeholder="City"
                        type="text"
                        id="city"
                        name="city"
                        required /><br />
                    <input
                        className='form-control'
                        placeholder="School"
                        type="text"
                        id="school"
                        name="school"
                        required /><br />
                    <button className='btn btn-primary btn-xs' type="submit">Sign Up</button>
                    <Link style={{ marginLeft: '10px' }} className='btn btn-primary btn-xs' to='/studentSignIn'>Already have an account?</Link><br /><br />
                    {alertElement}
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isSignedUp: state.Login.isSignedUp
    };
}
export default connect(mapStateToProps, { studentSignup })(StudentSignUp);