import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

class SingleEducationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: this.props.item.ID,
            school: this.props.item.school,
            schoolLocation: this.props.item.schoolLocation,
            degree: this.props.item.degree,
            major: this.props.item.major,
            passingYear: this.props.item.passingYear,
            gpa: this.props.item.gpa,
            editFlag: false
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete = () => {
        let data = {
            ID: this.state.ID
        }
        console.log('ID je send karvano 6e', data)
        axios.post('http://localhost:3001/deleteEducationDetails', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    editFlag: false
                })
                console.log('editflag', this.state.editFlag);
            })
            .catch(error => {
                console.log(error);
                console.log('error aave 6e');
            })

    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
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
        // e.preventDefault();
        let data = {
            ID: this.state.ID,
            school: this.state.school,
            schoolLocation: this.state.schoolLocation,
            degree: this.state.degree,
            major: this.state.major,
            passingYear: this.state.passingYear,
            gpa: this.state.gpa
        }
        console.log("data in single edus", data);
        axios.post('http://localhost:3001/updateEducationDetails', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState(state => {
                    state.editFlag = false;
                    return (state);
                })
                console.log('edit flag after update edu', this.state.editFlag);
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {
        let singleEducation = null;
        if (this.state.editFlag === false) {
            console.log('editflag inside false condition', this.state.editFlag);
            singleEducation =
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td>{this.state.school}</td>
                                <td align="right" rowspan="5"><button onClick={this.handleEdit} className="btn btn-primary btn-xs">Edit</button><br />
                                    <button onClick={this.handleDelete} className="btn btn-danger btn-xs">Delete</button>
                                </td>
                            </tr>
                            <tr>
                                <td>{this.state.schoolLocation}</td>
                            </tr>
                            <tr>
                                <td>{this.state.degree} in {this.state.major}</td>
                            </tr>
                            <tr>
                                <td>Gradutaion year: {this.state.passingYear}</td>
                            </tr>
                            <tr>
                                <td>GPA: {this.state.gpa}</td>
                            </tr>
                            <br />
                        </tbody>
                    </table>
                </div>
        } else {
            singleEducation =
                <div>
                    <form className="container">
                        <input
                            type="text"
                            id="school"
                            name="school"
                            placeholder="School"
                            onChange={this.handleChange}
                            required
                            autoFocus />
                        <br />
                        <input
                            type="text"
                            id="schoolLocation"
                            name="schoolLocation"
                            placeholder="Location of School"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            type="text"
                            id="degree"
                            name="degree"
                            placeholder="Degree"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            type="text"
                            id="major"
                            name="major"
                            placeholder="Major"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            type="number"
                            id="passingYear"
                            name="passingYear"
                            placeholder="Year of Graduation"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            type="number"
                            id="gpa"
                            name="gpa"
                            placeholder="GPA"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <button style={{ marginTop: '20px' }} className="btn btn-danger" onClick={this.handleCancel}>Cancel</button>
                        <button style={{ marginTop: '20px', marginLeft: '20px' }} className="btn btn-success" onClick={this.handleSave}>Save</button>
                    </form>
                </div>
        }
        return (
            <div>
                <div key={this.props.item.ID}>
                </div>
                {singleEducation}
            </div>
        );
    }
}

export default SingleEducationDetails;





