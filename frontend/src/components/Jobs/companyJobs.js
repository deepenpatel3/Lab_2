import React, { Component } from 'react';
import CompanyNavbar from '../Navbar/companyNavbar';
import axios from 'axios';
import cookie from "react-cookies";
import { Link, Redirect } from "react-router-dom";

class CompanyJobs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobsArray: [],
            firstJob: {},
            postFlag: false,
            registeredStudents: [],
            studentsFlag: false
        }
        this.showJob = this.showJob.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.postJob = this.postJob.bind(this);
        this.changeAppStatus = this.changeAppStatus.bind(this);
    }
    componentDidMount() {
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/getCompanyJobs', { params: { CID: localStorage.getItem("CID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    jobsArray: response.data
                })
                this.setState({
                    firstJob: this.state.jobsArray[0]
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    showJob = (job) => {
        this.setState({
            firstJob: job
        })
    }
    handlePost = () => {
        this.setState({
            postFlag: true
        })
    }
    handleCancel = () => {
        this.setState({
            postFlag: false
        })
    }
    postJob = () => {
        let data = {
            CID: localStorage.getItem("CID"),
            companyName: localStorage.getItem("name"),
            title: document.getElementById('title').value,
            postingDate: document.getElementById('postingDate').value,
            deadline: document.getElementById('deadline').value,
            location: document.getElementById('location').value,
            salary: document.getElementById('salary').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
        }
        console.log('data entered', data);
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/postJob', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    postFlag: false
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    getStudents = () => {
        let ID = this.state.firstJob.ID;
        axios.defaults.withCredentials = true;
        axios.get('http://localhost:3001/getAppliedStudents', { params: { ID: ID } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('registered students', response.data);
                this.setState({
                    registeredStudents: response.data,
                    studentsFlag: true
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    changeAppStatus = (student) => {
        let data = {
            JID: this.state.firstJob.ID,
            SID: student.ID,
            status: document.getElementById(student.ID).value
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/changeAppStatus', data)
            .then(response => {
                console.log("Status Code : ", response.status);
            })
            .catch(error => {
                console.log(error);
            })
    }
    render() {
        let jobElement = null, jobOrForm = null, studentsElement = null, redirectVar = null, errorElement = null;
        if (!cookie.load('CID')) {
            redirectVar = <Redirect to="/companySignIn" />;
        }
        if (this.state.jobsArray.length > 0) {
            jobElement = this.state.jobsArray.map(job => {
                return (
                    <div className="container">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <button onClick={() => this.showJob(job)} className="btn">
                                            <ul style={{ textAlign: 'left' }}>
                                                <li>{job.title}</li>
                                                <li>{job.category}</li>
                                            </ul>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            })
            if (this.state.studentsFlag) {
                studentsElement = this.state.registeredStudents.map(student => {
                    return (
                        <ul>
                            <li><Link to={{
                                pathname: "/otherStudent",
                                state: {
                                    student: student,
                                    path: '/companyJobs'
                                }
                            }} style={{ color: 'black', float: 'left' }}>{student.name}</Link>
                                <label style={{ marginLeft: '15px', float: 'left' }} for="currentStatus"> Current Status:</label>
                                <p style={{ float: 'left' }} id='currentStatus'>{student.status}</p>

                                <a href={student.resume} style={{ color: 'black', float: 'left', marginLeft: '15px' }} className='btn btn-default'>Resume</a>
                                <label style={{ marginLeft: '15px', float: 'left' }} for="status"> Change Status:</label>
                                <select id={student.ID} required>
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Declined">Declined</option>
                                </select>
                                <button className='btn btn-success btn-xs' onClick={() => this.changeAppStatus(student)}>Save</button>
                            </li>
                        </ul >
                    )
                })
            } else {
                console.log("student flag:", this.state.studentsFlag)
                studentsElement = <button className='btn btn-primary btn-xs' onClick={this.getStudents}>Applied Students</button>
            }
            if (this.state.postFlag) {
                jobOrForm =
                    <div>
                        <form className="form-group">
                            <input className="form-control" type='text' id='title' placeholder='Job title' required autoFocus></input>
                            <input className="form-control" type='date' id='postingDate' placeholder='Posting Date' required></input>
                            <input className="form-control" type='date' id='deadline' placeholder='Application Deadline' required></input>
                            <input className="form-control" type='text' id='location' placeholder='Location' required></input>
                            <input className="form-control" type='number' id='salary' placeholder='Salary' required></input>
                            <input className="form-control" type='text' id='description' placeholder='Job Description' required></input>
                            <label for="category">Category:</label>
                            <select className="form-control" id="category" required>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="On Campus">On Campus</option>
                                <option value="Internship">Internship</option>
                            </select>
                            <button style={{ marginTop: '10px' }} className='btn btn-success btn-xs' onClick={this.postJob}>Post</button>
                            <button style={{ marginTop: '10px' }} className='btn btn-default btn-xs' onClick={this.handleCancel}>Cancel</button>
                        </form>
                    </div>
            } else {
                jobOrForm =
                    <div>
                        <button className='btn btn-primary btn-xs' style={{ float: 'right' }} onClick={this.handlePost}>Post a Job</button>
                        <div className="row">
                            <div className="col">
                                <h1>{this.state.firstJob.title}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>{this.state.firstJob.category}</p>
                            </div>
                            <div className="col">
                                <p>{this.state.firstJob.location}</p>
                            </div>
                            <div className="col">
                                <p>{this.state.firstJob.salary}</p>
                            </div>
                            <div className="col">
                                <p>{this.state.firstJob.postingDate}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>Applications close on {this.state.firstJob.deadline}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>Job Description:  {this.state.firstJob.description}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {studentsElement}
                            </div>
                        </div>
                    </div>
            }
        } else {
            errorElement = <h3>Post the First Job</h3>
            jobOrForm =
                <div>
                    <form className="form-group">
                        Job title: <input className="form-control" type='text' id='title' required autoFocus></input>
                        Posting Date: <input className="form-control" type='date' id='postingDate' required></input>
                        Application Deadline: <input className="form-control" type='date' id='deadline' required></input>
                        Location: <input className="form-control" type='text' id='location' required></input>
                        Salary: <input className="form-control" type='number' id='salary' required></input>
                        Job Description: <input className="form-control" type='text' id='description' required></input>
                        Category:
                        <select className="form-control" id="category" required>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="On Campus">On Campus</option>
                            <option value="Internship">Internship</option>
                        </select>
                        <button style={{ marginTop: '10px' }} className='btn btn-success btn-xs' onClick={this.postJob}>Post</button>
                        <button style={{ marginTop: '10px' }} className='btn btn-default btn-xs' onClick={this.handleCancel}>Cancel</button>
                    </form>
                </div>
        }
        return (
            <div className='container'>
                {redirectVar}
                <CompanyNavbar />
                <h5>Job Postings</h5>
                <div style={{ marginTop: '20px' }} className='row'>
                    <div className='col-4'>
                        {jobElement}
                        {errorElement}
                    </div>
                    <div className='col-8'>
                        {jobOrForm}
                    </div>
                </div>
            </div>
        );
    }
}

export default CompanyJobs;