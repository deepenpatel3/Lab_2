import React, { Component } from 'react';
import axios from 'axios';
import cookie from "react-cookies";
import { connect } from "react-redux";
import { studentGetBasicDetails } from "../../js/actions/profileAction";

class BasicDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            school: '',
            profilePic: '',
            city: '',
            editFlag: false
        }
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentDidMount() {
        this.props.studentGetBasicDetails();
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
            name: this.state.name,
            dob: this.state.dob,
            city: this.state.city,
            state: this.state.state,
            country: this.state.country,
            degree: this.state.degree,
            major: this.state.major,
            passingYear: this.state.passingYear
        }
        axios.post('http://localhost:3001/updateStudentData', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    editFlag: false
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {
        let infoOrForm = null;
        let editButton = null;

        if (this.state.editFlag === false) {
            infoOrForm =
                <ul style={{ width: '100px' }} className="container" >
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
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="date"
                                id="dob"
                                name="dob"
                                placeholder="Date of Birth(MM/DD/YYYY)"
                                onChange={this.handleChange}
                                required />
                        </td>

                    </tr>
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
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                placeholder="State"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                placeholder="Country"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="degree"
                                name="degree"
                                placeholder="Current Degree"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="text"
                                id="major"
                                name="major"
                                placeholder="Major"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input
                                type="number"
                                id="passingYear"
                                name="passingYear"
                                placeholder="Graduation Year"
                                onChange={this.handleChange}
                                required />
                        </td>
                    </tr>
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
                        <form action="http://localhost:3001/updateProfilePic" method='POST' encType='multipart/form-data' onSubmit={this.refresh}>
                            <input style={{ display: "none" }} name='SID' value={cookie.load("SID")}></input>
                            <input type='file' name='profilePic' id='profilePic'></input>
                            <button className='btn btn-primary' type='submit'>Save</button>
                        </form>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div>{infoOrForm}</div>
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
        city: state.StudentProfile.city,
        profilePicURL: state.StudentProfile.profilePicURL
    }
}
export default connect(mapStateToProps, { studentGetBasicDetails })(BasicDetails);