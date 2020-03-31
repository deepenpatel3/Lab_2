import React, { Component } from 'react';
import CompanyNavbar from '../Navbar/companyNavbar';
import axios from 'axios';
import { Link } from "react-router-dom";

class CompanyStudents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            searchFlag: false,
            skillFlag: false,
            filteredStudents: []
        }
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSkill = this.handleSkill.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getAllStudents')
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
                filteredStudents: temp.filter(student => { return ((student.name.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase())) || (student.school.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase()))) })
            })
        } else {
            this.setState({
                searchFlag: false
            })
        }
    }
    handleSkill = (e) => {
        let temp = this.state.students;
        if (e.target.value) {
            this.setState({
                skillFlag: true,
                filteredStudents: temp.filter(student => {
                    if (student.skills) {
                        return (student.skills.replace(',', '').toLowerCase().includes(e.target.value.toLowerCase()))
                    }
                })
            })
        } else {
            this.setState({
                skillFlag: false
            })
        }
    }
    render() {
        var studentsElement = null;
        if (this.state.searchFlag || this.state.skillFlag) {
            studentsElement = this.state.filteredStudents.map(student => {
                return (
                    <tr>
                        <td >
                            <ul style={{ textAlign: "center" }} className="list-group">
                                <li className="list-group-item">
                                    <Link to={{
                                        pathname: "/otherStudent",
                                        state: {
                                            student: student, path: '/companyStudents'
                                        }
                                    }} style={{ color: 'black' }}>{student.name}</Link></li>
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
                                <li className="list-group-item">
                                    <Link to={{
                                        pathname: "/otherStudent",
                                        state: {
                                            student: student, path: '/companyStudents'
                                        }
                                    }} style={{ color: 'black' }}>{student.name}</Link></li>
                                <li className="list-group-item">{student.school}</li>
                                <li className="list-group-item">{student.degree},{student.major}</li>
                                <li className="list-group-item">Graduation Year:{student.passingYear}</li>
                            </ul>
                        </td>
                    </tr>
                )
            })
        }
        return (
            <div className='container'>
                < CompanyNavbar />
                <h5>Explore Students</h5>
                <div className='row'>
                    <div className='col'>
                        <div style={{ marginTop: '15px', marginBottom: '15px' }} class="form-inline">
                            <input style={{ width: '50%' }} type="search" onChange={this.handleSearch} class="form-control" placeholder="Search students by name or school" />
                            <input style={{ width: '50%' }} type="search" onChange={this.handleSkill} class="form-control" placeholder="Search students by skills..." />
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
        );
    }
}

export default CompanyStudents;