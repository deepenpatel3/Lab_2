import React, { Component } from 'react';
import CompanyNavbar from '../Navbar/companyNavbar';
import axios from 'axios';
import cookie from "react-cookies";
import { Link, Redirect } from "react-router-dom";
axios.defaults.withCredentials = true;

class CompanyEvents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eventArray: [],
            firstEvent: {},
            registeredStudents: [],
            addEventFlag: false,
            studentsFlag: false
        }
        this.addEvent = this.addEvent.bind(this);
        this.showEvent = this.showEvent.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handlePost = this.handlePost.bind(this);
        this.getStudents = this.getStudents.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getEventOfCompany', { params: { CID: localStorage.getItem("CID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    eventArray: response.data
                })
                this.setState({
                    firstEvent: (this.state.eventArray)[0]
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    addEvent = () => {
        this.setState({
            addEventFlag: true
        })
    }
    showEvent = (event) => {
        this.setState({
            firstEvent: event
        })
    }
    handleCancel = () => {
        this.setState({
            addEventFlag: false
        })
    }
    handlePost = () => {
        let data = {
            CID: localStorage.getItem("CID"),
            company: localStorage.getItem("companyName"),
            name: document.getElementById('eventName').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            time: document.getElementById('time').value,
            date: document.getElementById('date').value,
            eligibility: document.getElementById('eligibility').value
        }
        axios.post('http://localhost:3001/postEvent', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    addEventFlag: false
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    getStudents = () => {
        let ID = this.state.firstEvent.ID;
        axios.get('http://localhost:3001/getRegisteredStudents', { params: { ID: ID } })
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
    render() {
        let eventOrForm = null, studentsElement = null, eventElement = null, redirectVar = null, errorElement = null;
        // if (!cookie.load('CID')) {
        //     redirectVar = <Redirect to="/companySignIn" />;
        // }
        if (this.state.eventArray.length > 0) {
            if (this.state.studentsFlag) {
                studentsElement = this.state.registeredStudents.map(student => {
                    return (
                        <ul>
                            <li><Link to={{
                                pathname: "/otherStudent",
                                state: {
                                    student: student,
                                    path: '/companyEvents'
                                }
                            }} style={{ color: 'black' }}>{student.name}</Link></li>
                        </ul>
                    )
                })
            } else {
                console.log("student flag:", this.state.studentsFlag)
                studentsElement = <button className='btn btn-primary btn-xs' onClick={this.getStudents}>Registered Students</button>
            }
            if (this.state.addEventFlag) {
                eventOrForm =
                    <div>
                        <form className="form-group">
                            <input className="form-control" type='text' id='eventName' placeholder='Event Title' required autoFocus />
                            <input className="form-control" type='text' id='location' placeholder='Venue' required />
                            <input className="form-control" type='text' id='description' placeholder='What is the event about?...' required />
                            <input className="form-control" type='time' id='time' placeholder='Time' required />
                            <input className="form-control" type='date' id='date' placeholder='Date' required />
                            <input className="form-control" type='text' id='eligibility' placeholder='Eligibility' required />
                            <button style={{ marginTop: '10px' }} className='btn btn-success btn-xs' onClick={this.handlePost}>Post</button>
                            <button style={{ marginTop: '10px' }} className='btn btn-default btn-xs' onClick={this.handleCancel}>Cancel</button>
                        </form>
                    </div>
            } else {
                eventOrForm =
                    <div>
                        <button style={{ float: 'right' }} className='btn btn-primary btn-xs' onClick={this.addEvent} >Post an Event</button>
                        <div className="row">
                            <div className="col">
                                <h1>{this.state.firstEvent.name}</h1>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>{this.state.firstEvent.location}</p>
                            </div>
                            <div className="col">
                                <p>{this.state.firstEvent.date}</p>
                            </div>
                            <div className="col">
                                <p>{this.state.firstEvent.time}</p>
                            </div>
                            <div className="col">
                                <p>{this.state.firstEvent.eligibility}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <p>Event Description:  {this.state.firstEvent.description}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                {studentsElement}
                            </div>
                        </div>
                    </div>
            }
            eventElement = this.state.eventArray.map(event => {
                return (
                    <div className="container">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <button onClick={() => this.showEvent(event)} className="btn">
                                            <ul style={{ textAlign: 'left' }}>
                                                <li>{event.name}</li>
                                                <li>{event.date}</li>
                                            </ul>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            })
        } else {
            errorElement = <h3>Post the First Event</h3>
            eventOrForm =
                <div>
                    <form className="form-group">
                        Event Title: <input className="form-control" type='text' id='eventName' required autoFocus />
                        Venue: <input className="form-control" type='text' id='location' required />
                        Description:<input className="form-control" type='text' id='description' required />
                        Time: <input className="form-control" type='time' id='time' required />
                        Date:<input className="form-control" type='date' id='date' required />
                        Eligibility: <input className="form-control" type='text' id='eligibility' required />
                        <button style={{ marginTop: '10px' }} className='btn btn-success btn-xs' onClick={this.handlePost}>Post</button>
                        <button style={{ marginTop: '10px' }} className='btn btn-default btn-xs' onClick={this.handleCancel}>Cancel</button>
                    </form>
                </div>
        }
        return (
            <div>
                <div className='container'>
                    {redirectVar}
                    < CompanyNavbar />
                    <h5>Events</h5>
                    <br />
                    {/* <button style={{ float: 'right' }} className='btn btn-primary btn-xs' onClick={this.addEvent} >Post an Event</button> */}
                    <div className='row'>
                        <div className='col-4'>
                            {eventElement}
                            {errorElement}
                        </div>
                        <div className='col-8'>
                            {eventOrForm}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CompanyEvents;