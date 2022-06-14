import React from "react"
import { Card, CardBody, Badge } from "reactstrap"
import Loading from "../Components/Loading"
import { firestore } from "../config"
import { Navigate } from "react-router-dom"

class ViewRequests extends React.Component {
    constructor() {
        super()
        this.state = {
            allRequests: [],
            isLoading: false,
            alert: "",
            role: "",
            error: ""
        }
    }
    componentDidMount() {
        const id = localStorage.getItem("Email")
        this.setState({ isLoading: true })
        if (id) {
            firestore.collection("users").doc(id).get().then(document => {
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
        firestore.collection("requests").where("adder", "==", id).get().then(Snapshot => {
            let request = []
            Snapshot.forEach(doc => {
                request.push(doc.data())
                this.setState({ allRequests: request })
            })
        }).then(() => {
            this.setState({ isLoading: false })
        }).catch(() => {
            this.setState({ error: "Some error has occurred. Please try again later" })
            setTimeout(() => {
                this.setState({ error: "" })
            }, 3000)
        })
    }
    render() {
        if (this.state.role === "NA")
            return <Navigate to="/login" />
        else return (
            <div>
                {this.state.isLoading ? <Loading /> : <div>
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", marginTop: "10px" }}>
                        <h3 style={{ textAlign: "center" }}>
                            ALL REQUESTS
                        </h3>
                    </div>
                    {this.state.allRequests.length !== 0 ? <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", justifyContent: 'center' }}>
                        {
                            this.state.allRequests.map((each) => {
                                return (
                                    <Card style={{ margin: "20px" }}>
                                        <CardBody>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <div>
                                                        <h6>REQUEST ID: {each.date.split("-").join(".")}{.12} </h6>
                                                    </div>
                                                    <div style={{ display: "flex" }}>
                                                        {each.status === "Pending" ?
                                                            <Badge style={{ fontSize: "23px" }} color="warning" pill>
                                                                PENDING
                                                            </Badge> :
                                                            <Badge style={{ fontSize: "23px" }} color="success" pill>
                                                                ISSUED
                                                            </Badge>}
                                                        {each.approved === false ?
                                                            <Badge style={{ fontSize: "23px" }} color="danger" pill>
                                                                NOT APPROVED
                                                            </Badge> :
                                                            <Badge style={{ fontSize: "23px" }} color="success" pill>
                                                                APPROVED
                                                            </Badge>}
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
                                    </Card>
                                )
                            })
                        }
                    </div> : <div style={{ color: "grey", fontSize: "12px", textAlign: "center" }}>
                        No request has been created yet.
                    </div>}
                </div>}
            </div>
        )
    }
}

export default ViewRequests