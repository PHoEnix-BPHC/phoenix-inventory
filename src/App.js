import React from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom"
import SignUp from "./Components/SignUp"
import Toolbar from "./Components/Toolbar"
import AdminToolbar from "./Components/AdminToolbar"
import Login from './Components/Login';
import ViewComponents from './Pages/ViewComponents';
import AddComponents from "./Pages/AddComponents"
import ViewProject from './Pages/ViewProjects';
import CreateProject from './Pages/CreateProject';
import ViewRequests from './Pages/ViewRequests';
import CreateRequests from './Pages/CreateRequests';
import CheckRequests from './Pages/CheckRequests';
import ProjectRequests from './Pages/ProjectRequests';
import HomeToolbar from "./Components/HomeToolbar"
import { firestore } from './config';

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      role: "",
      home: false
    }
  }
  componentDidMount() {
    const user = localStorage.getItem("Email")
    if (user) {
      firestore.collection("users").doc(user).get().then(document => {
        this.setState({ role: document.data().role })
      }).catch(() => {
        this.setState({ error: "Some error has occurred. Please try again later" })
        setTimeout(() => {
          this.setState({ error: "" })
        }, 3000)
      })
    }
    else {
      this.setState({ home: true })
    }
  }
  render() {
    return (
      <div className="App">
        {this.state.home ? <HomeToolbar /> :
          <div>
            {this.state.role === "viewer" ? <Toolbar /> : <AdminToolbar />}
          </div>
        }
        <Routes>
          <Route path="/signup" exact element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" exact element={<ViewComponents />} />
          <Route path="/view-components" element={<ViewComponents />} />
          <Route path="add-components" element={<AddComponents />} />
          <Route path="/view-projects" element={<ViewProject />} />
          <Route path="/create-project" element={<CreateProject />} />
          <Route path="/view-requests" element={<ViewRequests />} />
          <Route path="/create-requests" element={<CreateRequests />} />
          <Route path="/check-requests" element={<CheckRequests />} />
          <Route path="/project-requests" element={<ProjectRequests />} />
        </Routes>
      </div>
    );
  }
}

export default App;
