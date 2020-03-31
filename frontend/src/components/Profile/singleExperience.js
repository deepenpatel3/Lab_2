import React, { Component } from 'react';
import axios from 'axios';

class SingleExperience extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: this.props.item.ID,
            companyName: this.props.item.companyName,
            title: this.props.item.title,
            location: this.props.item.location,
            startDate: this.props.item.startDate,
            endDate: this.props.item.endDate,
            description: this.props.item.description,
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
        axios.post('http://localhost:3001/deleteExperience', data)
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
    handleSave = (e) => {
        // e.preventDefault();
        let data = {
            ID: this.state.ID,
            SID: localStorage.getItem("ID"),
            companyName: this.state.companyName,
            title: this.state.title,
            location: this.state.location,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            description: this.state.description
        }
        console.log("data in single experience", data);
        axios.post('http://localhost:3001/updateExperience', data)
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
        let singleExp = null;
        if (this.state.editFlag === false) {
            singleExp =
                <div>
                    <table>
                        <tbody><tr>
                            <td>As a {this.state.title}</td>
                            <td align="right" rowspan="4"><button onClick={this.handleEdit} className="btn btn-primary btn-xs">Edit</button><br />
                                <button onClick={this.handleDelete} className="btn btn-danger btn-xs">Delete</button>
                            </td>
                        </tr>
                            <tr>
                                <td> At {this.state.companyName}, Located at {this.state.location}</td>
                            </tr>
                            <tr>
                                <td> From {this.state.startDate} to {this.state.endDate}</td>
                            </tr>
                            <tr>
                                <td>Description: {this.state.description}</td>
                            </tr>
                            <br />
                        </tbody>
                    </table>
                </div>
        } else {
            singleExp =
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
                        <button style={{ marginTop: '20px' }} className="btn btn-danger" onClick={this.handleCancel}>Cancel</button>
                        <button style={{ marginTop: '20px', marginLeft: '20px' }} className="btn btn-success" onClick={this.handleSave}>Save</button>
                    </form>
                </div>
        }
        return (
            <div>
                <div key={this.props.item.ID}>
                </div>
                {singleExp}
            </div>
        );
    }
}

export default SingleExperience;





