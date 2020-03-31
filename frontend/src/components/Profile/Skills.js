import React, { Component } from 'react';
import axios from 'axios';
import SingleSkill from './singleSkill';
axios.defaults.withCredentials = true;

class Skills extends Component {
    constructor(props) {
        super(props);
        this.state = {
            skillArray: [],
            ID: '',
            skill: '',
            addFlag: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getSkills', { params: { ID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('skills received', response.data);
                this.setState({
                    skillArray: this.state.skillArray.concat(response.data)
                })
            })
            .catch(error => {
                console.log(error);
            })
    }

    handleToggle = () => {
        if (this.state.addFlag === true) {
            this.setState({
                addFlag: false
            })

        } else {
            this.setState({
                addFlag: true
            })
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSave = (e) => {
        console.log('skill sent', this.state.skill)
        let data = {
            ID: localStorage.getItem("ID"),
            skill: this.state.skill
        }
        console.log('pressed save button', data)
        axios.post('http://localhost:3001/addSkill', data)
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
    render() {
        let skillElement = null;
        if (this.state.addFlag === true) {
            skillElement =
                <div>
                    <form className='container' >
                        <input
                            onChange={this.handleChange}
                            type='text' id='skill' name='skill' placeholder='Enter your skill'
                            required autoFocus />
                        <button className='btn btn-default btn-xs' onClick={this.handleToggle} type='submit'>Cancel</button>
                        <button className='btn btn-success btn-xs' onClick={this.handleSave}>Save</button>
                    </form>
                </div>
        }
        else {
            skillElement =
                <div>
                    <tr>
                        <td>
                            <div>{this.state.skillArray.map(single => <SingleSkill key={single.SkillID} item={single} />)}</div>
                            <div>
                                <button style={{ marginTop: '20px' }} className="btn btn-primary"
                                    onClick={this.handleToggle}>Add Skill</button>
                            </div>
                        </td>
                    </tr>
                </div>
        }
        return (
            <div className='container'>
                <label>Skills</label>
                <table className="table table-borderless">
                    <tbody>

                        {skillElement}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Skills;