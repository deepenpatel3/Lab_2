import React, { Component } from 'react';
import cookie from "react-cookies";
import { connect } from "react-redux";
import { studentGetBasicDetails, studentUpdateBasicDetails } from "../../js/actions/profileAction";
import axios from 'axios';

class BasicDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePic: "",
            editFlag: false
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillMount() {
        this.props.studentGetBasicDetails();
        let data = {
            SID: cookie.load("SID")
        }
        axios({
            url: 'http://localhost:3001/getProfilePic',
            method: "GET",
            params: data
        })
            .then(response => {
                console.log("student basic details", response.data);
                this.setState({
                    profilePic: response.data
                })
            })
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
    handleSave = () => {
        this.props.studentUpdateBasicDetails({
            SID: cookie.load("SID"),
            name: document.getElementById("name").value,
            city: document.getElementById("city").value,
            school: document.getElementById("school").value
        });
        this.setState({
            editFlag: false
        })
    }
    render() {
        let infoOrForm = null;
        let editButton = null;
        console.log('Rerender with edit flag', this.state.editFlag);
        if (this.state.editFlag === false) {
            infoOrForm =
                <ul style={{ width: '150px' }}>
                    <li className="list-group-item">{this.props.name}</li>
                    <li className="list-group-item">School: {this.props.school}</li>
                    <li className="list-group-item">City: {this.props.city}</li>
                </ul>

            editButton =
                <button onClick={this.handleEdit} type="button" className="btn btn-primary btn-xs">
                    Edit
                </button>
        }
        else {
            infoOrForm =
                <div>
                    <tr>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                placeholder="Name"
                                onChange={this.handleChange}
                                required
                                autoFocus />
                        </td>
                    </tr><br />
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                placeholder="City"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr><br />
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="school"
                                name="school"
                                placeholder="School"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr><br />
                    <tr>
                        <td>
                            <button className="btn btn-danger btn-xs" onClick={this.handleCancel}>Cancel</button>
                            <button style={{ marginLeft: '20px' }} className="btn btn-success btn-xs" onClick={this.handleSave}>Save</button>
                        </td>
                    </tr>
                </div>

        }
        return (
            <div className="container">
                <div style={{ width: '1px solid black' }} className='col-md-6'>
                    <div>
                        <img src={this.state.profilePic} style={{ height: '150px', weight: '100px' }}></img>
                        <form action="http://localhost:3001/updateProfilePic" method="POST" encType='multipart/form-data' >
                            <input style={{ display: "none" }} name='SID' value={cookie.load("SID")}></input>
                            <input type='file' name='profilePic' id='profilePic'></input>
                            <button className='btn btn-primary' type='submit'>Save</button>
                        </form>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div><br />{infoOrForm}</div>
                    <div>{editButton}</div>
                </div>
            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        name: state.StudentProfile.name,
        school: state.StudentProfile.school,
        city: state.StudentProfile.city
    }
}
export default connect(mapStateToProps, { studentGetBasicDetails, studentUpdateBasicDetails })(BasicDetails);