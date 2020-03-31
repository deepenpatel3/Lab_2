import React, { Component } from 'react';
import axios from 'axios';

class JobApplications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appliedJobs: [],
            filteredJobs: [],
            pendingFlag: false,
            reviewedFlag: false,
            DeclinedFlag: false
        }
        this.handleReviewed = this.handleReviewed.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getAppliedJobs', { params: { SID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    appliedJobs: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    handleReviewed = () => {
        if (!this.state.reviewedFlag) {
            this.setState({
                reviewedFlag: true,
                filteredJobs: this.state.filteredJobs.concat(this.state.appliedJobs.filter(job => { return (job.status === 'Reviewed') }))
            })
        } else {
            this.setState({
                reviewedFlag: false,
                filteredJobs: this.state.filteredJobs.filter(job => { return (job.status !== 'Reviewed') })
            })
        }
    }

    render() {
        let appliedJobsElement = null;
        if (!this.state.reviewedFlag) {
            console.log('reviewd flag', this.state.reviewedFlag)
            appliedJobsElement = this.state.appliedJobs.map(job => {
                return (
                    <tr>
                        <td style={{ textAlign: 'center' }}>
                            <h4>{job.title}</h4>
                            <p>{job.location}</p>
                            <p>{job.company}</p>
                            <p>{job.salary}</p>
                            <p>{job.status}</p>
                        </td>
                    </tr>
                )
            })
        } else {

            console.log('reviewd flag true', this.state.reviewedFlag)
            appliedJobsElement = this.state.filteredJobs.map(job => {
                return (
                    <tr>
                        <td style={{ textAlign: 'center' }}>
                            <h4>{job.title}</h4>
                            <p>{job.location}</p>
                            <p>{job.company}</p>
                            <p>{job.salary}</p>
                            <p>{job.status}</p>
                        </td>
                    </tr>
                )
            })
        }

        return (
            <div className="container">
                <button className='btn btn-default' onClick={this.handlePending}>Pending</button>
                <button className='btn btn-default' onClick={this.handleReviewed}>Reviewed</button>
                <button className='btn btn-default' onClick={this.handleDeclined}>Declined</button>
                <table style={{ marginTop: '15px' }} className="table">
                    <tbody>
                        {appliedJobsElement}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default JobApplications;