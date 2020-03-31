import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

class SingleSkill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ID: this.props.item.SkillID,
            skill: this.props.item.skill,
            editFlag: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleDelete = () => {
        let data = {
            ID: this.state.ID,
            SID: localStorage.getItem("ID")
        }
        // console.log('ID to be sent', data)
        axios.post('http://localhost:3001/deleteSkill', data)
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
    handleToggle = () => {
        if (!this.state.editFlag) {
            this.setState({
                editFlag: true
            })
        } else {
            this.setState({
                editFlag: false
            })
        }
    }
    handleSave = (e) => {
        e.preventDefault();
        let data = {
            ID: this.state.ID,
            SID: localStorage.getItem("ID"),
            skill: this.state.skill
        }
        console.log("data in single skill", data);
        axios.post('http://localhost:3001/updateSkill', data)
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
                        <tbody>
                            <tr>
                                <td>{this.state.skill}</td>
                                <td align="right">
                                    <button onClick={this.handleToggle} className="btn btn-primary btn-xs">Edit</button>
                                    <button onClick={this.handleDelete} className="btn btn-danger btn-xs">Delete</button>
                                </td>
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
                            type="text"
                            id="skill"
                            name="skill"
                            placeholder="Enter your skill"
                            onChange={this.handleChange}
                            required
                            autoFocus />
                        <br />
                        <button style={{ marginTop: '20px' }} className="btn btn-danger btn-xs" onClick={this.handleToggle}>Cancel</button>
                        <button style={{ marginTop: '20px', marginLeft: '20px' }} className="btn btn-success btn-xs" onClick={this.handleSave}>Save</button>
                    </form>
                </div>
        }
        return (
            <div>
                <div key={this.props.item.SkillID}>

                    {singleExp}
                </div>
            </div>
        );
    }
}

export default SingleSkill;





