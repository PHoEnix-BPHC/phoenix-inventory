import React from "react"
import { Card, CardBody, CardTitle, Form, FormGroup, Input, Button, CardSubtitle } from "reactstrap"
import { Link, Navigate } from "react-router-dom"
import bcrypt from "bcryptjs"
import Loading from "../Components/Loading"
import { firestore } from "../config"
import firebase from "../config"

class SignUp extends React.Component {
    constructor() {
        super()
        this.state = {
            name: "",
            email: "",
            role: "viewer",
            password: "",
            error: "",
            alert: "",
            isLoading: false,
            user: false,
            confirmpassword: ""
        }
    }
    componentDidMount() {
        const user = localStorage.getItem("Email")
        if (user)
            this.setState({ user: true })
    }
    render() {
        var disabled = !(this.state.email && this.state.name && this.state.password) || !(this.state.confirmpassword === this.state.password)
        const onChange = (event) => {
            const { value, name } = event.target
            this.setState({ [name]: value })
        }
        const signUpSubmit = async () => {
            this.setState({ isLoading: true })
            const emailexp = new RegExp("^(f20)[0-1][0-9][0-9]{4}@hyderabad.bits-pilani.ac.in")
            if (!emailexp.test(this.state.email)) {
                this.setState({ error: "Please enter a valid BITS email id", isLoading: false })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            }
            else {
                var hashed_password = null
                try {
                    const salt = await bcrypt.genSalt()
                    hashed_password = await bcrypt.hash(this.state.password, salt)
                }
                catch (err) {
                    this.setState({ error: "Some error has occurred. Please try again later" })
                    setTimeout(() => {
                        this.setState({ error: "" })
                    }, 3000)
                }
                firestore.collection("users").doc(this.state.email).set({
                    name: this.state.name,
                    email: this.state.email,
                    password: hashed_password,
                    role: this.state.role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    localStorage.setItem("Email", this.state.email)
                    this.setState({ alert: "Account created!!", isLoading: false, isModal: true })
                    setTimeout(() => {
                        this.setState({ alert: "" })
                    }, 3000)
                }).catch(err => {
                    this.setState({ error: err.message, isLoading: false })
                    setTimeout(() => {
                        this.setState({ error: "" })
                    }, 3000)
                })
            }
        }
        if (this.state.user)
            return <Navigate to="/" />
        else return (
            <div style={{ display: "flex", justifyContent: "center", margin: "10px" }}>
                {this.state.isLoading ? <Loading /> : <Card style={{ width: "300px" }}>
                    <CardBody>
                        <CardTitle style={{ margin: "0px 10px 10px 10px", padding: "0px", textAlign: "center" }} tag="h5">
                            SIGN UP
                        </CardTitle>
                        <CardSubtitle style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            Already Registered?
                            <Link to="/login" style={{ cursor: "pointer", marginLeft: "5px", color: "black", textDecoration: "none" }}>
                                Log In
                            </Link>
                        </CardSubtitle>
                        <Form>
                            <FormGroup>
                                <Input onChange={onChange} value={this.state.name} name="name" placeholder="Enter your name" type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={onChange} value={this.state.email} name="email" placeholder="Enter your BITS mail" type="email" />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={onChange} value={this.state.role} name="role" type="select">
                                    <option value="viewer">
                                        Viewer
                                    </option>
                                </Input>
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={onChange} value={this.state.password} name="password" placeholder="Enter your password" type="password" />
                            </FormGroup>
                            <FormGroup>
                                <Input onChange={onChange} value={this.state.confirmpassword} name="confirmpassword" placeholder="Re-Enter your password" type="password" />
                            </FormGroup>
                            <div style={{ fontSize: "15px", color: "red", marginBottom: "10px" }}>
                                {this.state.error}
                            </div>
                            <div style={{ fontSize: "15px", color: "green", marginBottom: "10px" }}>
                                {this.state.alert}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Button onClick={signUpSubmit} disabled={disabled} color="success">
                                    SIGN UP
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>}
            </div >
        )
    }
}

export default SignUp