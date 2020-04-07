import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
import { studentGetContactInfo, studentUpdateContactInfo } from '../../js/actions/profileAction';
import { connect } from "react-redux";
axios.defaults.withCredentials = true;

class ContactInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editFlag: false
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentDidMount() {
        this.props.studentGetContactInfo();
    }
    handleEdit = () => {
        this.setState({
            editFlag: true
        })
    }
    handleCancel = () => {
        this.setState({
            editFlag: false
        })
    }
    handleSave = (e) => {
        e.preventDefault();
        this.props.studentUpdateContactInfo({
            SID: cookie.load("SID"),
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value
        });
        this.setState({
            editFlag: false
        })
    }

    render() {
        let editButton = null;
        let infoOrForm = null;

        if (this.state.editFlag === false) {
            infoOrForm =
                <ul className="container" >
                    <li className="list-group-item">{this.props.email}</li>
                    <li className="list-group-item">{this.props.phone}</li>
                </ul>

            editButton =
                <button onClick={this.handleEdit} className="btn btn-primary btn-xs">
                    Edit
                </button>
        }
        else {
            infoOrForm =
                <form className="container">
                    <input
                        style={{ marginTop: '20px' }}
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        required
                        autoFocus />
                    <br />
                    <input
                        style={{ marginTop: '20px' }}
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="phone"
                        required />
                    <br />
                    <button style={{ marginTop: '20px' }} className="btn btn-danger btn-xs" onClick={this.handleCancel}>Cancel</button>
                    <button style={{ marginTop: '20px', marginLeft: '20px' }} className="btn btn-success btn-xs" onClick={this.handleSave}>Save</button>
                </form>
        }
        return (
            <div className="container">
                <label for="">Contact Information</label>
                {infoOrForm}
                {editButton}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        email: state.StudentProfile.email,
        phone: state.StudentProfile.phone
    }
}

export default connect(mapStateToProps, { studentGetContactInfo, studentUpdateContactInfo })(ContactInfo);