import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';

class OtherStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            searchFlag: false,
            filteredStudents: [],
            educationDetails: [],
            experience: [],
            userFlag: false,
            clickedStudent: {},
            clickedStudentSkills: []
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.showStudent = this.showStudent.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getStudents', { params: { SID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    students: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })

    }
    handleSearch = (e) => {
        let temp = this.state.students;
        if (e.target.value) {
            this.setState({
                searchFlag: true,
                filteredStudents: temp.filter(student => { return ((student.name.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase())) || (student.school.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase()) || (student.major.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase())))) })
            })
        } else {
            this.setState({
                searchFlag: false
            })
        }
    }
    showStudent = async (student) => {
        this.setState({
            userFlag: true,
            clickedStudent: student
        })
        await axios.get('http://localhost:3001/getSkills', { params: { ID: student.ID } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    clickedStudentSkills: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
        await axios.get('http://localhost:3001/getEducationDetails', { params: { ID: student.ID } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    educationDetails: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
        await axios.get('http://localhost:3001/getExperience', { params: { ID: student.ID } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    experience: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    handleBack = () => {
        this.setState({
            userFlag: false
        })
    }
    render() {
        // console.log('clicked student', this.state.clickedStudent);
        var studentsElement = null, fullElement = null;
        if (this.state.searchFlag) {
            studentsElement = this.state.filteredStudents.map(student => {
                return (
                    <tr>
                        <td >
                            <ul style={{ textAlign: "center" }} className="list-group">
                                <li className="list-group-item"><a style={{ color: 'black' }} href="#" onClick={() => this.showStudent(student)}>{student.name}</a></li>
                                <li className="list-group-item">{student.school}</li>
                                <li className="list-group-item">{student.degree},{student.major}</li>
                                <li className="list-group-item">Graduation Year:{student.passingYear}</li>
                            </ul>
                        </td>
                    </tr>
                )
            })
        } else {
            studentsElement = this.state.students.map(student => {
                return (
                    <tr>
                        <td >
                            <ul style={{ textAlign: "center" }} className="list-group">
                                <li className="list-group-item"><a style={{ color: 'black' }} href="#" onClick={() => this.showStudent(student)}>{student.name}</a></li>
                                <li className="list-group-item">{student.school}</li>
                                <li className="list-group-item">{student.degree},{student.major}</li>
                                <li className="list-group-item">Graduation Year:{student.passingYear}</li>

                            </ul>
                        </td>
                    </tr>
                )
            })
        }
        if (this.state.userFlag) {
            let skillElement = this.state.clickedStudentSkills.map(Skill => {
                return (<li className="list-group-item">{Skill.skill}</li>)
            })
            let educationElement = this.state.educationDetails.map(education => {
                return (
                    <div>
                        <li className="list-group-item">{education.school}</li>
                        <li className="list-group-item">{education.schoolLocation}</li>
                        <li className="list-group-item">{education.degree}</li>
                        <li className="list-group-item">{education.major}</li>
                        <li className="list-group-item">{education.gpa}</li>
                    </div>
                )
            })
            let experienceElement = this.state.experience.map(experience => {
                return (
                    <div>
                        <li className="list-group-item">{experience.title}</li>
                        <li className="list-group-item"> At {experience.companyName}, Located at {experience.location}</li>
                        <li className="list-group-item"> From {experience.startDate} to {experience.endDate}</li>
                        <li className="list-group-item">Description: {experience.description}</li>
                    </div>
                )
            })
            fullElement =
                <div className='container'>
                    <a href="#" onClick={this.handleBack}>Back</a>
                    <div style={{ marginTop: '20px' }} >
                        <div className='col-md-4'>
                            <div style={{ textAlign: 'center' }}>
                                <div className='row'>
                                    <div className='col-4'>
                                        <p>Profile Picture will go here</p>
                                    </div>
                                    <div className='col'>
                                        <ul className="list-group">
                                            <li className="list-group-item">{this.state.clickedStudent.name}</li>
                                            <li className="list-group-item">{this.state.clickedStudent.school}</li>
                                            <li className="list-group-item">{this.state.clickedStudent.degree}</li>
                                            <li className="list-group-item">{this.state.clickedStudent.passingYear}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <ul className="list-group">
                                    <li className="list-group-item">Contact Information:</li>
                                    <li className="list-group-item">{this.state.clickedStudent.email}</li>
                                </ul>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <ul className="list-group">
                                    <li className="list-group-item">Skills:</li>
                                    <li className="list-group-item">{skillElement}</li>
                                </ul>
                            </div>
                        </div>
                        <div className='col-md-8'>
                            <ul className="list-group" style={{ textAlign: 'center' }}>
                                <li className="list-group-item"> Career Objective:</li>
                                <li className="list-group-item">{this.state.clickedStudent.careerObjective}</li>
                            </ul>
                            <ul className="list-group" style={{ marginTop: '20px', textAlign: 'center' }}>
                                <li className="list-group-item"> Education Details:</li>
                                <li className="list-group-item">{educationElement}</li>
                            </ul>
                            <ul className="list-group" style={{ marginTop: '20px', textAlign: 'center' }}>
                                <li className="list-group-item"> Experience Details:</li>
                                <li className="list-group-item">{experienceElement}</li>
                            </ul>
                        </div>
                    </div>
                </div>
        } else {
            fullElement =
                <div className='container'>
                    <h5>Explore Students</h5>
                    <div className='row'>
                        <div className='col'>
                            <div style={{ marginTop: '15px', marginBottom: '15px' }} class="form-inline">
                                <input style={{ width: '100%' }} type="search" onChange={this.handleSearch} class="form-control" placeholder="Search students by name or major..." />
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <table className='table'>
                            <tbody>
                                {studentsElement}
                            </tbody>
                        </table>
                    </div>
                </div>
        }
        return (
            <div className='container'>
                <Navbar />

                {fullElement}
            </div>
        );
    }
}

export default OtherStudents;

