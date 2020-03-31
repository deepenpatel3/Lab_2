import React, { Component } from "react";
import { Link } from "react-router-dom";
import cookie from "react-cookies";
import 'bootstrap/dist/css/bootstrap.min.css';

//create the Navbar Component
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        cookie.remove("SID");
        cookie.remove("name");
    };
    render() {
        return (
            <div>

                <nav className="navbar navbar-default" >
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <div >
                                <Link to="/profile" ><strong>Handshake</strong></Link>
                            </div>
                        </div>
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/jobs"><strong>Jobs</strong></Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/events"><strong>Events</strong></Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav">
                            <li>
                                <Link to="/students"><strong>Students</strong></Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav ">
                            <li>
                                <Link to="/" onClick={this.handleLogout}>
                                    <span className="glyphicon glyphicon-user"></span><strong>Logout</strong>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav >
            </div >
        );
    }
}


export default Navbar;
