import React from "react"
import Loading from "../Components/Loading"
import { Navigate } from "react-router-dom"
import { Button, Card, CardBody } from "reactstrap"
import { firestore } from "../config"

class CheckRequests extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoading: false,
            allRequests: [],
            error: "",
            role: "",
            alert: "",
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
        firestore.collection("requests").get().then(document => {
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
            firestore.collection("requests").doc(id).delete().then(() => {
                this.setState({ alert: "Request has been rejected", isLoading: false })
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
            firestore.collection("requests").doc(id).update({
                approved: true
            }).then(() => {
                this.setState({ alert: "Request has been approved", isLoading: false })
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
        const issueRequest = (each, id) => {
            this.setState({ isLoading: true })
            firestore.collection("requests").doc(id).update({
                status: "Issued"
            }).then(() => {
                each.components.map((each, id) => {
                    firestore.collection("")
                })
                this.setState({ alert: "Components have been issued", isLoading: false })
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
        const insufRequest = (id) => {
            this.setState({ isLoading: true })
            firestore.collection("requests").doc(id).delete().then(() => {
                this.setState({ alert: "Insufficient inventory", isLoading: false })
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
        const returned = () => {

        }
        if (this.state.role === "viewer")
            return <Navigate to="/" />
        else if (this.state.role === "NA")
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
                                            {this.state.role === "owner" && !each.approved ?
                                                <Card style={{ margin: "20px" }}>
                                                    <CardBody>
                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                <div>
                                                                    <h6>REQUEST ID: {each.date.split("-").join(".")}{.12} </h6>
                                                                </div>
                                                                <div style={{ display: "flex" }}>
                                                                    <div>
                                                                        <Button onClick={() => rejectRequest(each, this.state.idIndex[index])} style={{ marginRight: "5px" }} color="danger">
                                                                            REJECT REQUEST
                                                                        </Button>
                                                                        <Button onClick={() => approveRequest(this.state.idIndex[index])} color="success">
                                                                            APPROVE REQUEST
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>PROJECT: </b>
                                                                {each.project}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>DATE OF RETURN: {" "} </b>
                                                                {each.date}
                                                            </div>
                                                            <div style={{ display: "flex" }}>
                                                                <b>APPROVAL:  </b>
                                                                {each.approved ? <div>APPROVED</div> : <div>NOT APPROVED</div>}
                                                            </div>
                                                            <div>
                                                                <b>COMPONENTS TO BE ISSUED: {" "} </b>
                                                                {each.components.map((comp, index) => {
                                                                    return (
                                                                        <div>{comp} - {each.qty[index]} </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card> : <div>
                                                    {this.state.role !== "owner" && each.approved ?
                                                        <Card style={{ margin: "20px" }}>
                                                            <CardBody>
                                                                <div style={{ display: "flex", flexDirection: "column" }}>
                                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                                        <div>
                                                                            <h6>REQUEST ID: {each.date.split("-").join(".")}{.12} </h6>
                                                                        </div>
                                                                        <div style={{ display: "flex" }}>
                                                                            <div>
                                                                                <Button onClick={() => insufRequest(each, this.state.idIndex[index])} style={{ marginRight: "5px" }} color="danger">
                                                                                    INSUFFICIENT INVENTORY
                                                                                </Button>
                                                                                <Button onClick={() => issueRequest(each, this.state.idIndex[index])} color="success">
                                                                                    COMPONENTS ISSUED
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div style={{ display: "flex" }}>
                                                                        <b>PROJECT: </b>
                                                                        {each.project}
                                                                    </div>
                                                                    <div style={{ display: "flex" }}>
                                                                        <b>DATE OF RETURN: {" "} </b>
                                                                        {each.date}
                                                                    </div>
                                                                    <div style={{ display: "flex" }}>
                                                                        <b>APPROVAL:  </b>
                                                                        {each.approved ? <div>APPROVED</div> : <div>NOT APPROVED</div>}
                                                                    </div>
                                                                    <div>
                                                                        <b>COMPONENTS TO BE ISSUED: {" "} </b>
                                                                        {each.components.map((comp, index) => {
                                                                            return (
                                                                                <div>{comp} - {each.qty[index]} </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                    <div>
                                                                        <Button onClick={returned} color="success">RETURNED</Button>
                                                                    </div>
                                                                </div>
                                                            </CardBody>
                                                        </Card> : null}
                                                </div>}
                                        </div>
                                    )
                                })
                            }
                        </div> : <div style={{ color: "grey", fontSize: "12px", textAlign: "center" }}>
                            No pending requests yet.
                        </div>}
                    </div>
                }
            </div>
        )
    }
}


export default CheckRequests