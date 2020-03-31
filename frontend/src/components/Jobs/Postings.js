import React, { Component } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';

class Postings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jobArray: [],
            firstJob: {},
            fullTimeFlag: false,
            partTimeFlag: false,
            onCampusFlag: false,
            internshipFlag: false,
            locationFlag: false,
            searchFlag: false,
            applyFlag: false,
            filteredJobs: []
        }

        this.showJob = this.showJob.bind(this);
        this.handleFullTime = this.handleFullTime.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handlePartTime = this.handlePartTime.bind(this);
        this.handleOnCampus = this.handleOnCampus.bind(this);
        this.handleInternship = this.handleInternship.bind(this);
        this.handleLocation = this.handleLocation.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

        this.handleApply = this.handleApply.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getJobs')
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    jobArray: this.state.jobArray.concat(response.data),
                })
                this.setState({
                    firstJob: (this.state.jobArray)[0]
                })
            })
            .catch(error => {
                console.log(error);
            })
    }
    showJob = (job) => {
        this.setState({
            firstJob: job
        })
        // this.state.postingDate = this.state.postingDate.slice(0, 9);
        // console.log('postig date', this.state.postingDate);
    }
    handleFullTime = (e) => {
        if (!this.state.fullTimeFlag) {
            this.setState({
                fullTimeFlag: true,
                filteredJobs: this.state.filteredJobs.concat(this.state.jobArray.filter(job => { return (job.category === 'Full Time') }))
            })
        } else {
            this.setState({
                fullTimeFlag: false,
                filteredJobs: this.state.filteredJobs.filter(job => { return (job.category !== 'Full Time') })
            })
        }
    }
    handlePartTime = () => {
        if (!this.state.partTimeFlag) {
            this.setState({
                partTimeFlag: true,
                filteredJobs: this.state.filteredJobs.concat(this.state.jobArray.filter(job => { return (job.category === 'Part Time') }))
            })
        } else {
            this.setState({
                partTimeFlag: false,
                filteredJobs: this.state.filteredJobs.filter(job => { return (job.category != 'Part Time') })
            })
        }

    }
    handleOnCampus = () => {
        if (!this.state.onCampusFlag) {
            this.setState({
                onCampusFlag: true,
                filteredJobs: this.state.filteredJobs.concat(this.state.jobArray.filter(job => { return (job.category === 'On Campus') }))
            })
        } else {
            this.setState({
                onCampusFlag: false,
                filteredJobs: this.state.filteredJobs.filter(job => { return (job.category != 'On Campus') })
            })
        }
    }
    handleInternship = () => {
        if (!this.state.internshipFlag) {
            this.setState({
                internshipFlag: true,
                filteredJobs: this.state.filteredJobs.concat(this.state.jobArray.filter(job => { return (job.category === 'Internship') }))
            })
        } else {
            this.setState({
                internshipFlag: false,
                filteredJobs: this.state.filteredJobs.filter(job => { return (job.category != 'Internship') })
            })
        }
    }
    handleReset = () => {
        this.setState({
            // filter: [],
            filteredJobs: [],
            fullTimeFlag: false,
            partTimeFlag: false,
            onCampusFlag: false,
            internshipFlag: false,
            locationFlag: false,
            searchFlag: false
        })
    }
    handleSearch = (e) => {
        let temp = this.state.jobArray;
        if (e.target.value) {
            this.setState({
                searchFlag: true,
                filteredJobs: temp.filter(job => { return ((job.company.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase())) || (job.title.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase()))) })
            })
        } else {
            this.setState({
                searchFlag: false
            })
        }
    }
    handleLocation = (e) => {
        if (!this.state.locationFlag) {
            this.setState({
                locationFlag: true,
                filteredJobs: this.state.filteredJobs.concat(this.state.jobArray.filter(job => { return (job.location === e.target.id) }))
            })
        } else {
            this.setState({
                locationFlag: false,
                filteredJobs: this.state.filteredJobs.filter(job => { return (job.location != e.target.id) })
            })
        }
    }
    handleApply = () => {
        this.setState({
            applyFlag: true
        })
    }
    render() {
        var jobelement = null, DropDownMenu = null, uniqueCities = [];
        console.log('filtered jobs', this.state.filteredJobs);
        // console.log('full timeflag:', this.state.fullTimeFlag, 'part time flag:', this.state.partTimeFlag, 'on campus flag:', this.state.onCampusFlag, 'internship flag:', this.state.internshipFlag);
        if ((this.state.fullTimeFlag || this.state.partTimeFlag || this.state.onCampusFlag || this.state.internshipFlag || this.state.locationFlag || this.state.searchFlag)) {
            jobelement = this.state.filteredJobs.map(job => {
                return (
                    <div className="container">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <button id={job.ID} onClick={() => this.showJob(job)} className="btn">
                                            <ul style={{ textAlign: 'left' }}>
                                                <li>{job.title}</li>
                                                <li>{job.company}</li>
                                                <li>At {job.location}</li>
                                                <li>{job.category}</li>
                                            </ul>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            })
        }
        else {
            jobelement = this.state.jobArray.map(job => {
                return (
                    <div className="container">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <button onClick={() => this.showJob(job)} className="btn">
                                            <ul style={{ textAlign: 'left' }}>
                                                <li>{job.title}</li>
                                                <li>{job.company}</li>
                                                <li>At {job.location}</li>
                                                <li>{job.category}</li>
                                            </ul>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            })

        }

        this.state.jobArray.forEach(job => { return (uniqueCities.indexOf(job.location) === -1 ? uniqueCities.push(job.location) : null) })
        DropDownMenu = uniqueCities.map(location => {
            return (
                <Dropdown.Item onClick={this.handleLocation} id={location}>{location}</Dropdown.Item>
            )
        })
        console.log('first job', this.state.firstJob)
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>
                        <div style={{ marginTop: '15px', marginBottom: '15px' }} class="form-inline">
                            <input style={{ width: '100%' }} type="search" onChange={this.handleSearch} class="form-control" placeholder="Search jobs by name..." />
                        </div>
                    </div>
                </div>
                <div className='row' style={{ marginBottom: '15px' }}>
                    <div className="col-1" ><button id='Full Time' onClick={this.handleFullTime} className="btn btn-default btn-xs">Full Time</button></div>
                    <div className='col-1'><button id='Part Time' onClick={this.handlePartTime} className="btn btn-default btn-xs">Part Time</button></div>
                    <div className='col-1'><button id='On Campus' onClick={this.handleOnCampus} className="btn btn-default btn-xs">On Campus</button></div>
                    <div className='col-1'><button id='Internship' onClick={this.handleInternship} className="btn btn-default btn-xs">Internship</button></div>
                    <Dropdown>
                        <Dropdown.Toggle variant="default" id="dropdown-basic">
                            Location
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <div class="btn-group-toggle" data-toggle="buttons">
                                {DropDownMenu}
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                    <div className='col-1'><button onClick={this.handleReset} className="btn btn-default btn-xs">Reset</button></div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            {jobelement}
                        </div>
                        <div className="col">
                            <div className="container">
                                <div className="row">
                                    <div className="col">
                                        <h1>{this.state.firstJob.title}</h1>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p><a href="#">{this.state.firstJob.company}</a></p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>{this.state.firstJob.category}</p>
                                    </div>
                                    <div className="col">
                                        <p>{this.state.firstJob.location}</p>
                                    </div>
                                    <div className="col">
                                        <p>{this.state.firstJob.salary}</p>
                                    </div>
                                    <div className="col">
                                        <p>{this.state.firstJob.postingDate}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>Applications close on {this.state.firstJob.deadline}</p>
                                    </div>
                                    <div className="col-1">
                                        {this.state.applyFlag ?
                                            <form action='http://localhost:3001/apply' method='post' encType='multipart/form-data'>
                                                <input name="SID" value={localStorage.getItem("ID")}></input>
                                                <input style={{ display: 'none' }} type="text" name='ID' value={this.state.firstJob.ID}></input>
                                                <input type='file' name='resume'></input>
                                                <button type='submit'>Apply</button>
                                            </form> : <button className="btn btn-primary btn-xs" onClick={this.handleApply}>Apply</button>}
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>Job Description:  {this.state.firstJob.description}</p>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <p>Application Status:  {this.state.firstJob.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Postings;