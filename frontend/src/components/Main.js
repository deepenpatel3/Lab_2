import React, { Component } from "react";
import { Route } from "react-router-dom";
import Root from './Root/Root';
import companySignUp from './SignUp/companySignUp';
import companySignIn from './SignIn/companySignIn';
import Profile from './Profile/Profile';
import Jobs from './Jobs/Jobs';
import Postings from './Jobs/Postings';
import Events from './Events/Events';
import OtherStudents from "./OtherStudents/OtherStudents";
import CompanyProfile from './Profile/companyProfile';
import CompanyEvents from "./Events/companyEvents";
import OtherStudent from "./Events/OtherStudent";
import CompanyStudents from "./OtherStudents/companyStudents";
import CompanyJobs from "./Jobs/companyJobs";
import StudentSignUp from "./SignUp/studentSignUp";
import StudentSignIn from "./SignIn/studentSignIn";


//Create a Main Component
class Main extends Component {
    render() {
        return (
            <div>
                {/*Render Different Component based on Route*/}
                <Route exact path="/" component={Root} />
                <Route exact path="/postings" component={Postings} />
                <Route exact path="/studentSignUp" component={StudentSignUp} />
                <Route exact path="/companySignUp" component={companySignUp} />
                <Route exact path="/companySignIn" component={companySignIn} />
                <Route exact path="/studentSignIn" component={StudentSignIn} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/jobs" component={Jobs} />
                <Route exact path="/events" component={Events} />
                <Route exact path="/students" component={OtherStudents} />
                <Route exact path="/companyStudents" component={CompanyStudents} />
                <Route exact path="/otherStudent" component={OtherStudent} />
                <Route exact path="/companyProfile" component={CompanyProfile} />
                <Route exact path="/companyEvents" component={CompanyEvents} />
                <Route exact path="/companyJobs" component={CompanyJobs} />
            </div>
        );
    }
}
//Export The Main Component
export default Main;
