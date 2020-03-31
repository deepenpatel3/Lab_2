import React, { Component } from 'react';
import axios from 'axios';

class EventRegistered extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registeredEvents: []
        }
    }
    componentDidMount() {
        axios.get('http://localhost:3001/getRegisteredEvents', { params: { SID: localStorage.getItem("ID") } })
            .then(response => {
                console.log("Status Code : ", response.status);
                console.log('response data', response.data);
                this.setState({
                    registeredEvents: response.data
                })
            })
            .catch(error => {
                console.log('error', error);
            })
    }
    render() {
        let registeredEventsElement = this.state.registeredEvents.map(event => {
            return (
                <tr>
                    <td style={{ textAlign: 'center' }}>
                        <h4>{event.name}</h4>
                        <p>By {event.company}</p>
                        <p>Time: {event.time}</p>
                        <p>Date: {event.date}</p>
                        <p>At {event.location}</p>
                        <p>Description: {event.description}</p>
                    </td>
                </tr>
            )
        })
        return (
            <div className="container">
                <table style={{ marginTop: '15px' }} className="table">
                    <tbody>
                        {registeredEventsElement}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default EventRegistered;