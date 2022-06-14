import React from "react"
import { Link, Navigate } from "react-router-dom"
import { firestore } from "../config"
import { CardBody, Card, CardTitle, CardSubtitle, Input, Button } from "reactstrap"
import bcrypt from "bcryptjs"
import Loading from "./Loading"


class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            email: "",
            password: "",
            error: "",
            alert: "",
            user: false,
            isLoading: false
        }
    }
    componentDidMount() {
        const user = localStorage.getItem("Email")
        if (user)
            this.setState({ user: true })
    }
    render() {
        var disabled = !((this.state.password) && (this.state.email))
        const onChange = event => {
            const { value, name } = event.target
            this.setState({ [name]: value })
        }
        const onSubmit = async () => {
            this.setState({ isLoading: true })
            firestore.collection("users").where("email", "==", this.state.email).get().then(allDocuments => {
                if (!allDocuments) {
                    this.setState({ error: "Account doesn't exists. Please create a new accou", isLoading: false })
                    setTimeout(() => {
                        this.setState({ error: "" })
                    }, 3000)
                }
                allDocuments.forEach(document => {
                    bcrypt.compare(this.state.password, document.data().password).then(result => {
                        if (result) {
                            localStorage.setItem("Email", document.data().email)
                            this.setState({ alert: "Login Successful. Redirecting..", isLoading: false })
                            window.location.reload()
                            setTimeout(() => {
                                this.setState({ alert: "" })
                            }, 3000)
                        }
                        else {
                            this.setState({ error: "Incorrect Password", isLoading: false })
                            setTimeout(() => {
                                this.setState({ error: "" })
                            }, 3000)
                        }
                    })
                })
            }).catch(() => {
                this.setState({ error: "Some error has occurred. Please try again later" })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            })
        }
        if (this.state.user)
            return <Navigate to="/" />
        else return (
            <div style={{ display: "flex", justifyContent: "center", textAlign: "center", margin: "10px" }}>
                {this.state.isLoading ? <Loading /> : <Card style={{ width: "300px" }}>
                    <CardBody>
                        <CardTitle tag="h4">
                            LOGIN
                        </CardTitle>
                        <CardSubtitle style={{ cursor: "pointer", display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                            Create an account?
                            <Link to="/signup" style={{ cursor: "pointer", marginLeft: "5px", color: "black", textDecoration: "none" }}>
                                Click Here
                            </Link>
                        </CardSubtitle>
                        <Input onChange={onChange} placeholder="Enter your email id" name="email" value={this.state.email} style={{ marginBottom: "10px" }} type="email" />
                        <Input onChange={onChange} placeholder="Enter your password" name="password" value={this.state.password} style={{ marginBottom: "10px" }} type="password" />
                        <div style={{ fontSize: "15px", color: "red", marginBottom: "10px" }}>
                            {this.state.error}
                        </div>
                        <div style={{ fontSize: "15px", color: "green", marginBottom: "10px" }}>
                            {this.state.alert}
                        </div>
                        <Button onClick={onSubmit} id="login" disabled={disabled} color="success">
                            LOGIN
                        </Button>
                    </CardBody>
                </Card>}

            </div>
        )
    }
}

export default Login