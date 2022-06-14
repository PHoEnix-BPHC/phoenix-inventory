import React from "react"
import { Button, Card, CardBody, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader, Label, Input, FormGroup, Form } from "reactstrap"
import Loading from "../Components/Loading"
import { Navigate } from "react-router-dom"
import { firestore } from "../config"

class ViewProject extends React.Component {
    constructor() {
        super()
        this.state = {
            allProjects: [],
            selectedProject: null,
            isModal: false,
            isLoading: true,
            error: "",
            role: "",
            alert: ""
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
            this.setState({ role: "NA" })
        }
        firestore.collection("projects").get().then(Snapshot => {
            let project = []
            Snapshot.forEach(doc => {
                project.push(doc.data())
                this.setState({ allProjects: project })
            })
            this.setState({ isLoading: false })
        })
    }
    render() {
        const toggleModal = () => {
            this.setState({ isModal: !this.state.isModal })
        }
        const onChange = (event) => {
            const { name, value } = event.target
            this.setState({ [name]: value })
        }
        if (this.state.role === "NA")
            return <Navigate to="/login" />
        else return (
            <div>
                {this.state.isLoading ? <Loading /> : <div>
                    <h3 style={{ textAlign: "center" }}>
                        ALL PROJECTS
                    </h3>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: 'wrap' }}>
                        {this.state.allProjects.map(each => {
                            return (
                                <div>
                                    {each.approved ? <Card style={{ width: "350px" }}>
                                        <CardBody>
                                            <CardTitle style={{ textAlign: "center", margin: "0px", padding: "0px" }} tag="h5">
                                                {each.name}
                                            </CardTitle>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div>
                                                    <b>DESCRIPTION: </b>
                                                    {each.description}
                                                </div>
                                                <div>
                                                    <b>PURPOSE: </b>
                                                    {each.purpose}
                                                </div>
                                                <div>
                                                    <b>ESTD. COST: </b> Rs. {" "}
                                                    {each.cost}
                                                </div>
                                                <div>
                                                    <b>TEAM MEMBERS: </b>
                                                    <ul>
                                                        {each.teamMembers.map(Each => {
                                                            return (
                                                                <li>{Each}</li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <b>COMPONENTS: </b>
                                                    <ul>
                                                        {each.components.map(Each => {
                                                            return (
                                                                <li>{Each}</li>
                                                            )
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card> : <div style={{ color: "grey", fontSize: "12px" }}>
                                        No projects approved yet
                                    </div>}
                                </div>
                            )
                        })}</div></div>}
                <Modal isOpen={this.state.isModal} centered toggle={toggleModal} >
                    <ModalHeader toggle={toggleModal}>
                        SELECT COMPONENT
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label style={{ padding: "0px" }}>
                                    NAME
                                </Label>
                                <Input onChange={onChange} value={this.state.selectedProject} name="selectedProjectName" type="text" />
                            </FormGroup>
                            <FormGroup>
                                <Label style={{ padding: "0px" }}>
                                    QUANTITY
                                </Label>
                                <Input onChange={onChange} value={this.state.selectedQty} name="selectedQty" type="number" />
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" >
                            UPDATE PROJECT
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default ViewProject