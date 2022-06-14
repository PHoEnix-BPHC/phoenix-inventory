import React from "react"
import Loading from "../Components/Loading"
import { Button, Card, CardBody } from "reactstrap"
import { Navigate } from "react-router-dom"
import { firestore } from "../config"

class ProjectRequests extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoading: false,
            allRequests: [],
            error: "",
            role: "",
            alert: "",
            adder: "",
            idIndex: []
        }
    }
    componentDidMount() {
        this.setState({ isLoading: true })
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
            this.setState({ role: "NA" })
        }
        firestore.collection("projects").get().then(document => {
            let temp = []
            let idTemp = []
            document.forEach(eachDocument => {
                temp.push(eachDocument.data())
                idTemp.push(eachDocument.id)
            })
            this.setState({ allRequests: temp, isLoading: false, idIndex: idTemp })
        }).catch(() => {
            this.setState({ error: "Some error has occurred. Please try again later" })
            setTimeout(() => {
                this.setState({ error: "" })
            }, 3000)
        })
    }
    render() {
        const rejectRequest = (id) => {
            this.setState({ isLoading: true })
            firestore.collection("projects").doc(id).delete().then(() => {
                this.setState({ alert: "Project has been rejected", isLoading: false })
                setTimeout(() => {
                    this.setState({ alert: "" })
                }, 3000)
            }).catch(() => {
                this.setState({ error: "Some error has occurred. Please try again later" })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            })

        }
        const approveRequest = (id) => {
            this.setState({ isLoading: true })
            firestore.collection("projects").doc(id).update({
                approved: true
            }).then(() => {
                this.setState({ alert: "Project has been approved", isLoading: false })
                setTimeout(() => {
                    this.setState({ alert: "" })
                }, 3000)
            }).catch(() => {
                this.setState({ error: "Some error has occurred. Please try again later" })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            })
        }
        if (this.state.role === "viewer")
            return <Navigate to="/" />
        if (this.state.role === "NA")
            return <Navigate to="/login" />
        else return (
            <div>
                {this.state.isLoading ? <Loading /> :
                    <div>
                        <div style={{ fontSize: "15px", color: "red", marginBottom: "10px", textAlign: "center" }}>
                            {this.state.error}
                        </div>
                        <div style={{ fontSize: "15px", color: "green", marginBottom: "10px", textAlign: "center" }}>
                            {this.state.alert}
                        </div>
                        {this.state.allRequests.length !== 0 ? <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: 'center' }}>
                            {
                                this.state.allRequests.map((each, index) => {
                                    return (
                                        <div>
                                            {!each.approved ?
                                                <Card style={{ margin: "20px" }}>
                                                    <CardBody>
                                                        <div style={{ display: "flex", flexDirection: "column" }}>

                                                            <div style={{ display: "flex" }}>
                                                                <b>PROJECT: </b>
                                                                {each.name}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>DESCRIPTION: </b>
                                                                {each.description}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>PURPOSE: </b>
                                                                {each.purpose}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>ADDED BY: </b>
                                                                {each.adder}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>COST: {" "} </b>
                                                                Rs. {each.cost}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>APPROVAL:  </b>
                                                                {each.approved ? <div>APPROVED</div> : <div>NOT APPROVED</div>}
                                                            </div>
                                                            <div>
                                                                <b>COMPONENTS TO BE ISSUED: {" "} </b>
                                                                {each.components.map((comp) => {
                                                                    return (
                                                                        <div>{comp} </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <div>
                                                                <b>TEAM MEMBERS: {" "} </b>
                                                                {each.teamMembers.map((comp) => {
                                                                    return (
                                                                        <div>{comp} </div>
                                                                    )
                                                                })}
                                                            </div>
                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <div style={{ display: "flex" }}>
                                                                    <div>
                                                                        <Button onClick={() => rejectRequest(this.state.idIndex[index])} style={{ marginRight: "5px" }} color="danger">
                                                                            REJECT PROJECT
                                                                        </Button>
                                                                        <Button onClick={() => approveRequest(this.state.idIndex[index])} color="success">
                                                                            APPROVE PROJECT
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card> : null}
                                        </div>
                                    )
                                })
                            }
                        </div> : <div style={{ color: "grey", fontSize: "12px", textAlign: "center" }}>
                            No project requests pending.
                        </div>}
                    </div>
                }
            </div>
        )
    }
}


export default ProjectRequests