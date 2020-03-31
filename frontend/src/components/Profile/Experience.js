import React, { Component } from 'react';
import axios from 'axios';
import SingleExperience from './singleExperience';
axios.defaults.withCredentials = true;

class Experience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            experienceArray: [],
            ID: '',
            companyName: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            description: '',
            addFlag: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentWillMount() {
        axios.get('http://localhost:3001/getExperience', { params: { ID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    experienceArray: this.state.experienceArray.concat(response.data)
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleToggle = () => {
        console.log('addflag after add button: before toggling', this.state.addFlag)
        if (this.state.addFlag === true) {
            this.setState({
                addFlag: false
            })

        } else {
            this.setState({
                addFlag: true
            })
        }
        console.log('addflag after add button: after toggling', this.state.addFlag)
    }

    handleSave = (e) => {
        e.preventDefault();
        let data = {
            ID: localStorage.getItem("ID"),
            companyName: this.state.companyName,
            title: this.state.title,
            location: this.state.location,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            description: this.state.description
        }
        console.log('pressed save button', data)
        axios.post('http://localhost:3001/addExperience', data)
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    addFlag: true
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
            educationElement =
                <div>
                    <form className="container">
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="companyName"
                            name="companyName"
                            placeholder="Name of Company"
                            onChange={this.handleChange}
                            required
                            autoFocus />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="title"
                            name="title"
                            placeholder="Title of Experience"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="location"
                            name="location"
                            placeholder="Location"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="date"
                            id="startDate"
                            name="startDate"
                            placeholder="Start Date"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="date"
                            id="endDate"
                            name="endDate"
                            placeholder="End Date"
                            onChange={this.handleChange}
                            required />
                        <br />
                        <input
                            // style={{ marginTop: '20px' }}
                            type="text"
                            id="description"
                            name="description"
                            placeholder="description"
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
                            {this.state.experienceArray.map(single => <SingleExperience key={single.ID} item={single} />)}
                            <div><button style={{ marginTop: '20px' }} className="btn btn-primary" onClick={this.handleToggle}>Add Experience</button></div>

                        </td>
                    </tr>

                </div>
        }
        return (
            <div className="container">
                <label>Experience</label>
                <table className="table table-borderless">
                    <tbody>

                        {educationElement}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Experience;