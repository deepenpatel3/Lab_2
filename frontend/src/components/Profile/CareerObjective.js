import React, { Component } from 'react';
import { connect } from "react-redux";
import cookie from "react-cookies";
import { studentGetCareerObjective, studentUpdateCareerObjective } from "../../js/actions/profileAction";

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
    }
    componentDidMount() {
        this.props.studentGetCareerObjective();
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
    handleSave = () => {
        let data = {
            SID: cookie.load("SID"),
            careerObjective: document.getElementById("careerObjective").value
        }
        this.props.studentUpdateCareerObjective(data);
    }
    render() {
        let editButton = null;
        let infoOrForm = null;


        if (this.state.editFlag === false) {
            infoOrForm =
                <ul className="container" >
                    <li className="list-group-item">{this.props.careerObjective}</li>
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
function mapStateToProps(state) {
    return {
        careerObjective: state.StudentProfile.careerObjective
    }
}
export default connect(mapStateToProps, { studentGetCareerObjective, studentUpdateCareerObjective })(CareerObjective);