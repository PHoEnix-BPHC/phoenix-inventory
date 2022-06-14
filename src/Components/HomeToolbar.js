import React from "react"
import { Navbar, NavbarBrand, NavLink } from "reactstrap"

class HomeToolbar extends React.Component {
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
                    <NavLink href="/signup" style={{ color: "whitesmoke", cursor: "pointer", margin: "0px" }}>
                        SIGN UP/ LOGIN
                    </NavLink>
                </Navbar>
            </div >
        )
    }
}

export default HomeToolbar