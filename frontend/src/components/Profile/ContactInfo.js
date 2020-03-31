import React, { Component } from 'react';
import axios from 'axios';
import cookie from 'react-cookies';
axios.defaults.withCredentials = true;

class ContactInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editFlag: false,
            email: '',
            phone: ''
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    componentDidMount() {
        axios.get('http://localhost:3001/getContactInfo', { params: { SID: cookie.load("SID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('contact details', response.data)
                this.setState({
                    email: response.data[0].email,
                    phone: response.data[0].phone
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    handleEdit = () => {
        this.setState({
            editFlag: true
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleCancel = () => {
        this.setState({
            editFlag: false
        })
    }
    handleSave = () => {
        let data = {
            SID: cookie.load("SID"),
            email: this.state.email,
            phone: this.state.phone
        }
        axios.post('http://localhost:3001/updateContactInfo', data)
            .then(response => {
                console.log("Status Code : ", response.status);
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        let editButton = null;
        let infoOrForm = null;


        if (this.state.editFlag === false) {
            infoOrForm =
                <ul className="container" >
                    <li className="list-group-item">{this.state.email}</li>
                    <li className="list-group-item">{this.state.phone}</li>
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
                        onChange={this.handleChange}
                        required
                        autoFocus />
                    <br />
                    <input
                        style={{ marginTop: '20px' }}
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="phone"
                        onChange={this.handleChange}
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


export default ContactInfo;