import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;

class EventsListings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventArray: [],
            firstEvent: {},
            searchFlag: false,
            filteredEvents: [],
        }
        this.showEvent = this.showEvent.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getEvents', { params: { ID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    eventArray: this.state.eventArray.concat(response.data),
                })
                if (this.state.eventArray.length) {
                    this.setState({
                        firstEvent: (this.state.eventArray)[0]
                    })
                }
                console.log('first event', this.state.firstEvent);
            })
            .catch(error => {
                console.log(error);
            })
    }
    showEvent = (event) => {
        this.setState({
            firstEvent: event
        })
        // this.state.postingDate = this.state.postingDate.slice(0, 9);
        // console.log('postig date', this.state.postingDate);
    }
    handleSearch = (e) => {
        let temp = this.state.eventArray;
        if (e.target.value) {
            this.setState({
                searchFlag: true,
                filteredEvents: temp.filter(event => { return (event.name.replace(/\s/g, '').toLowerCase().includes(e.target.value.replace(/\s/g, '').toLowerCase())) })
            })
        } else {
            this.setState({
                searchFlag: false
            })
        }
    }
    handleRegister = () => {
        let data = {
            ID: this.state.firstEvent.ID,
            SID: localStorage.getItem("ID")
        }
        axios.post('http://localhost:3001/registerEvent', data)
            .then(response => {
                console.log("Status Code : ", response.status);
            })
            .catch(error => {
                console.log(error);
            })

    }
    render() {
        var eventelement = null, eventDetails = null;
        if (this.state.eventArray.length) {
            if (this.state.searchFlag) {
                eventelement = this.state.filteredEvents.map(event => {
                    return (
                        <div className="container">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <button id={event.ID} onClick={() => this.showEvent(event)} className="btn">
                                                <ul style={{ textAlign: 'left' }}>
                                                    <li>{event.name}</li>
                                                    <li>{event.date}</li>
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
                eventelement = this.state.eventArray.map(event => {
                    return (
                        <div className="container">
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>
                                            <button onClick={() => this.showEvent(event)} className="btn">
                                                <ul style={{ textAlign: 'left' }}>
                                                    <li>{event.name}</li>
                                                    <li>{event.date}</li>
                                                </ul>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )
                })
                // this.setState({
                //     firstJob: (this.state.jobArray)[0]
                // })
            }
            eventDetails =
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h1>{this.state.firstEvent.name}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>{this.state.firstEvent.company}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>{this.state.firstEvent.location}</p>
                        </div>
                        <div className="col">
                            <p>{this.state.firstEvent.date}</p>
                        </div>
                        <div className="col">
                            <p>{this.state.firstEvent.time}</p>
                        </div>
                        <div className="col">
                            <p>{this.state.firstEvent.eligibility}</p>
                        </div>
                        <div className="col">
                            {this.state.firstEvent.eligibility === 'Software Engineering' ? <button className="btn btn-primary btn-xs" id="register" onClick={this.handleRegister}>Register</button> : <button className="btn btn-primary btn-xs" id="register" onClick={this.handleRegister} disabled>Register</button>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <p>Event Description:  {this.state.firstEvent.description}</p>
                        </div>
                    </div>

                </div>
        }
        return (
            <div className='container'>
                <div style={{ marginTop: '15px', marginBottom: '15px' }} class="form-inline">
                    <input style={{ width: '100%' }} type="search" onChange={this.handleSearch} class="form-control" placeholder="Search events by name..." />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            {eventelement}
                        </div>
                        <div className="col">
                            {eventDetails}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EventsListings;