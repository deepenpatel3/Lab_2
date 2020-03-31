import React, { Component } from 'react';
import CompanyNavbar from '../Navbar/companyNavbar';
import axios from 'axios';
import { Link, Redirect } from "react-router-dom";
import cookie from "react-cookies";

class OtherStudent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            student: this.props.location.state.student,
            path: this.props.location.state.path,
            Skills: [],
            educationDetails: [],
            experience: []
        }
    }
    async componentDidMount() {
        await axios.get('http://localhost:3001/getSkills', { params: { ID: this.state.student.ID } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    Skills: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
        await axios.get('http://localhost:3001/getEducationDetails', { params: { ID: this.state.student.ID } })
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
        await axios.get('http://localhost:3001/getExperience', { params: { ID: this.state.student.ID } })
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
    render() {
        let redirectVar = null;
        if (!cookie.load('CID')) {
            redirectVar = <Redirect to="/companySignIn" />;
        }
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
        let skillElement = this.state.Skills.map(Skill => {
            return (<li className="list-group-item">{Skill.skill}</li>)
        })
        return (
            <div className='container'>
                {redirectVar}
                < CompanyNavbar />
                <Link to={this.state.path}>Back</Link>
                <div style={{ marginTop: '20px' }} >
                    <div className='col-md-4'>
                        <div style={{ textAlign: 'center' }}>
                            <div className='row'>
                                <div className='col-4'>
                                    <img style={{ height: '130px', weight: '90px' }} src={this.state.student.profilePicUrl}></img>
                                    {/* <p>Profile Picture will go here</p> */}
                                </div>
                                <div className='col'>
                                    <ul className="list-group">
                                        <li className="list-group-item">{this.state.student.name}</li>
                                        <li className="list-group-item">{this.state.student.school}</li>
                                        <li className="list-group-item">{this.state.student.degree}</li>
                                        <li className="list-group-item">{this.state.student.passingYear}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <ul className="list-group">
                                <li className="list-group-item">Contact Information:</li>
                                <li className="list-group-item">{this.state.student.email}</li>
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
                            <li className="list-group-item">{this.state.student.careerObjective}</li>
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
        );
    }
}

export default OtherStudent;