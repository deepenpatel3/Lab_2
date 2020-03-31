import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

class CareerObjective extends Component {
    constructor(props) {
        super(props);
        this.state = {
            careerObjective: '',
            editFlag: false
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getCareerObjective', { params: { ID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                this.setState({
                    careerObjective: response.data[0].careerObjective
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    handleEdit = () => {
        this.setState({
            editFlag: true
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleCancel = () => {
        this.setState({
            editFlag: false
        })
    }
    handleSave = () => {
        let data = {
            careerObjective: this.state.careerObjective
        }
        axios.post('http://localhost:3001/updateCareerObjective', data)
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
        let editButton = null;
        let infoOrForm = null;


        if (this.state.editFlag === false) {
            infoOrForm =
                <ul className="container" >
                    <li className="list-group-item">{this.state.careerObjective}</li>
                </ul>

            editButton =
                <button onClick={this.handleEdit} className="btn btn-primary btn-xs">
                    Edit
                </button>
        }
        else {
            infoOrForm =
                <form className="container">
                    <input

                        style={{ width: '400px', height: '100px', marginTop: '20px' }}
                        type="text"
                        id="careerObjective"
                        name="careerObjective"
                        onChange={this.handleChange}
                        required
                        autoFocus />
                    <br />
                    <button style={{ marginTop: '20px' }} className="btn btn-danger" onClick={this.handleCancel}>Cancel</button>
                    <button style={{ marginTop: '20px', marginLeft: '20px' }} className="btn btn-success" onClick={this.handleSave}>Save</button>
                </form>
        }
        return (
            <div className="container">
                <label >Career Objective</label>
                {infoOrForm}
                {editButton}
            </div>
        );
    }
}

export default CareerObjective;