import React, { Component } from 'react';
import axios from 'axios';
import SingleEducationDetails from './singleEducationDetails';
axios.defaults.withCredentials = true;

class EducationDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            educationArray: [],
            ID: '',
            school: '',
            schoolLocation: '',
            degree: '',
            major: '',
            passingYear: '',
            gpa: '',
            addFlag: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillMount() {
        axios.get('http://localhost:3001/getEducationDetails', { params: { ID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    educationArray: this.state.educationArray.concat(response.data)
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleToggle = () => {
        console.log(this.state.addFlag)
        if (this.state.addFlag === true) {
            this.setState({
                addFlag: false
            })
            console.log('addflag after add button: after turning false', this.state.addFlag)
        } else {
            this.setState({
                addFlag: true
            })
            console.log('addflag after add button: after turning true', this.state.addFlag)
        }
    }

    handleSave = () => {
        let data = {
            ID: localStorage.getItem("ID"),
            school: this.state.school,
            schoolLocation: this.state.schoolLocation,
            degree: this.state.degree,
            major: this.state.major,
            passingYear: this.state.passingYear,
            gpa: this.state.gpa
        }
        axios.post('http://localhost:3001/addEducationDetails', data)
            .then(response => {
                console.log("Status Code : ", response.status);

                this.setState({
                    addFlag: false
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        let educationElement = null;
        if (this.state.addFlag === true) {
            console.log("aaaaa")
            educationElement =
                <div>
                    <form className="container">
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="school"
                            name="school"
                            placeholder="School"
                            onChange={this.handleChange}
                            required
                            autoFocus />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="schoolLocation"
                            name="schoolLocation"
                            placeholder="Location of School"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="degree"
                            name="degree"
                            placeholder="Degree"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="major"
                            name="major"
                            placeholder="Major"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="number"
                            id="passingYear"
                            name="passingYear"
                            placeholder="Year of Graduation"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="number"
                            id="gpa"
                            name="gpa"
                            placeholder="GPA"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <button style={{ marginTop: '20px' }} className="btn btn-danger" onClick={this.handleToggle}>Cancel</button>
                        <button style={{ marginTop: '20px', marginLeft: '20px' }} className="btn btn-success" onClick={this.handleSave}>Save</button>

                    </form>
                </div>
        } else {
            educationElement =
                <div>
                    <tr>
                        <td>
                            {this.state.educationArray.map(single => <SingleEducationDetails key={single.ID} item={single} />)}
                            <div><button style={{ marginTop: '10px' }} className="btn btn-primary" onClick={this.handleToggle}>Add Education</button></div>

                        </td>
                    </tr>
                </div>
        }
        return (
            <div className="container">
                <label>Education Details</label>
                <table className="table table-borderless">
                    <tbody>

                        {educationElement}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default EducationDetails;