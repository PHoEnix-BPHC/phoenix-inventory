import React from "react"
import { Navbar, Nav, Collapse, NavbarBrand, NavbarToggler, NavLink, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

class AdminToolbar extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: false
        }
    }
    render() {
        return (
            <div>
                <Navbar color="danger" expand="md" dark>
                    <NavbarBrand href="/">
                        INVENTORY
                    </NavbarBrand>
                    <NavbarToggler onClick={() => { this.setState({ visible: !this.state.visible }) }} />
                    <Collapse isOpen={this.state.visible} navbar>
                        <Nav className="me-auto" navbar>
                            <UncontrolledDropdown inNavbar nav>
                                <DropdownToggle caret nav>
                                    Components
                                </DropdownToggle>
                                <DropdownMenu style={{ fontSize: "15px" }} center>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/view-components">
                                            View Components
                                        </NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/add-components">
                                            Add Components
                                        </NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown inNavbar nav>
                                <DropdownToggle caret nav>
                                    Projects
                                </DropdownToggle>
                                <DropdownMenu style={{ fontSize: "15px" }} center>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/view-projects">
                                            View Projects
                                        </NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/create-project">
                                            Create Projects
                                        </NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/project-requests">
                                            Approve Projects
                                        </NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <UncontrolledDropdown inNavbar nav>
                                <DropdownToggle caret nav>
                                    Requests
                                </DropdownToggle>
                                <DropdownMenu style={{ fontSize: "15px" }} center>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/view-requests">
                                            View Requests
                                        </NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/create-requests">
                                            Create Requests
                                        </NavLink>
                                    </DropdownItem>
                                    <DropdownItem>
                                        <NavLink style={{ color: "black" }} href="/check-requests">
                                            Approve Requests
                                        </NavLink>
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </Nav>
                        <NavLink onClick={() => { localStorage.removeItem("Email"); window.location.reload() }} style={{ color: "whitesmoke", cursor: "pointer", margin: "0px" }}>
                            <i className="fa fa-power-off" style={{ marginRight: "5px" }}></i>
                            LOGOUT
                        </NavLink>
                    </Collapse>
                </Navbar>
            </div >
        )
    }
}

export default AdminToolbar