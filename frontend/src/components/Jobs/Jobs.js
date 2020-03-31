import React, { Component } from 'react';
import Navbar from '../Navbar/Navbar';
import { Nav } from 'react-bootstrap';
import Postings from './Postings';
import JobApplications from './JobApplications';
import { Redirect } from 'react-router-dom';
import cookie from 'react-cookies';

class Jobs extends Component {
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
                        <Nav.Link eventKey={1}>Jobs</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={2}>Applications</Nav.Link>
                    </Nav.Item>
                </Nav>
                {Number(this.state.activeKey) === 1 ? <Postings /> : null}
                {Number(this.state.activeKey) === 2 ? <JobApplications /> : null}
            </div>
        );
    }
}

export default Jobs;