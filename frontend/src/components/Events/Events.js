import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { Nav } from 'react-bootstrap';
import EventListings from './EventListings';
import EventRegistered from './EventRegistered';
import { Redirect } from 'react-router';
import cookie from 'react-cookies';

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: 1
        }
        this.handleSelect = this.handleSelect.bind(this);
    }
    handleSelect(selectedKey, event) {
        //event.preventDefault();
        this.setState({ activeKey: selectedKey });
    }

    render() {
        let redirectVar = null;
        if (!cookie.load("SID")) {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div className='container'>
                {redirectVar}
                <Navbar />
                {/* <JobNavbar /> */}
                <Nav fill variant="tabs" onSelect={this.handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey={1}>Events</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={2}>Registered Events</Nav.Link>
                    </Nav.Item>
                </Nav>
                {Number(this.state.activeKey) === 1 ? <EventListings /> : null}
                {Number(this.state.activeKey) === 2 ? <EventRegistered /> : null}
            </div>
        );
    }
}

export default Events;