import React from "react"
import { Label, Alert, Button, Input, Form, FormGroup, Card, CardBody, CardTitle, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import Loading from "../Components/Loading"
import { Navigate } from "react-router-dom"
import firebase, { firestore } from "../config"

class CreateProject extends React.Component {
    constructor() {
        super()
        this.state = {
            name: "",
            purpose: "",
            description: "",
            cost: "",
            adderName: "",
            teamMembers: [],
            teamMember: "",
            components: [],
            component: "",
            allComponents: [],
            allTeamMembers: [],
            isTeam: false,
            isComponent: false,
            isLoading: false,
            error: "",
            role: "",
            alert: ""
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
        firestore.collection("users").get().then(Snapshot => {
            let user = ["Select Team Member"]
            Snapshot.forEach(doc => {
                user.push(doc.data().name)
                this.setState({ allTeamMembers: user })
            })
        }).then(() => {
            firestore.collection("components").get().then(Snapshot => {
                let component = ["Select Component"]
                Snapshot.forEach(doc => {
                    component.push(doc.data().name)
                    this.setState({ allComponents: component })
                })
            })
            this.setState({ isLoading: false })
        })
    }
    render() {
        const onChange = event => {
            const { name, value } = event.target
            this.setState({ [name]: value })
        }
        const projectSubmit = () => {
            this.setState({ isLoading: true })
            const id = localStorage.getItem("Email")
            const { name, description, purpose, cost, teamMembers, components } = this.state
            firestore.collection("projects").doc().set({
                name: name,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                cost: cost,
                adder: id,
                description: description,
                purpose: purpose,
                teamMembers: teamMembers,
                components: components,
                approved: false
            }).then(() => {
                this.setState({ alert: "Project has been created successfully", isLoading: false })
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
        const toggleTeam = () => {
            this.setState({ isTeam: !this.state.isTeam })
        }
        const toggleComp = () => {
            this.setState({ isComponent: !this.state.isComponent })
        }
        const addTeamMember = () => {
            let temp = this.state.teamMembers
            temp.push(this.state.teamMember)
            this.setState({ teamMembers: temp, isTeam: false, alert: "Team member added successfully" })
            setTimeout(() => {
                this.setState({ alert: "" })
            }, 3000)
        }
        const addComponents = () => {
            let temp = this.state.components
            temp.push(this.state.component)
            this.setState({ components: temp, isComponent: false, alert: "Component added successfully" })
            setTimeout(() => {
                this.setState({ alert: "" })
            }, 3000)
        }
        var disabled = true
        const { name, description, purpose, cost } = this.state
        if (name !== "" && description !== "" && purpose !== "" && cost !== "")
            disabled = false
        if (this.state.role === "NA")
            return <Navigate to="/login" />
        else return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <div>
                    {this.state.isLoading ? <Loading /> :
                        <div>

                            <Alert style={{ textAlign: "center" }}>Please fill it completely. You won't be allowed to edit it later</Alert>
                            <div style={{ display: "flex", maxHeight: "max-content" }}>
                                <Card style={{ width: "400px" }}>
                                    <CardBody>
                                        <CardTitle style={{ textAlign: "center", margin: "0px", padding: "0px" }} tag="h5">
                                            ADD PROJECT
                                        </CardTitle>
                                        <Form>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    NAME
                                                </Label>
                                                <Input onChange={onChange} value={this.state.name} name="name" placeholder="Enter the project name" type="text" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    PURPOSE
                                                </Label>
                                                <Input onChange={onChange} value={this.state.purpose} name="purpose" placeholder="Enter the purpose of the project" type="text" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    DESCRIPTION
                                                </Label>
                                                <Input onChange={onChange} value={this.state.description} name="description" placeholder="Enter the project description" type="textarea" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    ESTIMATED COST (Rs.)
                                                </Label>
                                                <Input onChange={onChange} value={this.state.cost} name="cost" placeholder="Enter the estimated cost" type="text" />
                                            </FormGroup>
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <Button style={{ fontSize: "15px", padding: "5px", margin: "0px 0px 20px 0px" }} onClick={toggleTeam} color="success">
                                                    ADD TEAM MEMBERS
                                                </Button>
                                                <Button style={{ fontSize: "15px", padding: "5px", margin: "0px 0px 20px 0px" }} onClick={toggleComp} color="success">
                                                    ADD COMPONENTS
                                                </Button>
                                            </div>
                                            <div style={{ fontSize: "15px", color: "red", marginBottom: "10px" }}>
                                                {this.state.error}
                                            </div>
                                            <div style={{ fontSize: "15px", color: "green", marginBottom: "10px" }}>
                                                {this.state.alert}
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <Button disabled={disabled} onClick={projectSubmit} color="primary">
                                                    CREATE PROJECT
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                                <div>
                                    <Card style={{ margin: "0px 0px 10px 20px", height: "49%", width: "300px" }}>
                                        <CardBody>
                                            <CardTitle style={{ textAlign: "center", margin: "0px", padding: "0px" }} tag="h5">
                                                TEAM MEMBERS
                                            </CardTitle>
                                            {this.state.teamMembers.length !== 0 ? <ul>
                                                {this.state.teamMembers.map(eachTeamMember => {
                                                    return (
                                                        <li>{eachTeamMember}</li>
                                                    )
                                                })}
                                            </ul> :
                                                <div style={{ color: "grey", fontSize: "12px", textAlign: "center" }}>
                                                    No team members added yet
                                                </div>}

                                        </CardBody>
                                    </Card>
                                    <Card style={{ margin: "10px 0px 0px 20px", height: "49%", width: "300px" }}>
                                        <CardBody>
                                            <CardTitle style={{ textAlign: "center", margin: "0px", padding: "0px" }} tag="h5">
                                                COMPONENTS
                                            </CardTitle>
                                            {this.state.components.length !== 0 ? <ul>
                                                {this.state.components.map(eachComponents => {
                                                    return (
                                                        <li>{eachComponents}</li>
                                                    )
                                                })}
                                            </ul> : <div style={{ color: "grey", fontSize: "12px", textAlign: "center" }}>
                                                No components added yet
                                            </div>
                                            }

                                        </CardBody>
                                    </Card>
                                </div>
                            </div>
                        </div>}
                </div>
                <Modal isOpen={this.state.isTeam} centered toggle={toggleTeam} >
                    <ModalHeader toggle={toggleTeam}>
                        ADD TEAM MEMBER
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label style={{ padding: "0px" }}>
                                    MEMBER NAME
                                </Label>
                                <Input onChange={onChange} value={this.state.teamMember} name="teamMember" type="select">
                                    {this.state.allTeamMembers.map(each => {
                                        return (
                                            <option value={each}>
                                                {each}
                                            </option>
                                        )
                                    })}
                                </Input>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={addTeamMember}>
                            ADD
                        </Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.isComponent} centered toggle={toggleComp} >
                    <ModalHeader toggle={toggleComp}>
                        ADD COMPONENT
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label style={{ padding: "0px" }}>
                                    COMPONENT NAME
                                </Label>
                                <Input onChange={onChange} value={this.state.component} name="component" type="select">
                                    {this.state.allComponents.map(each => {
                                        return (
                                            <option value={each}>
                                                {each}
                                            </option>
                                        )
                                    })}
                                </Input>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={addComponents}>
                            ADD
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default CreateProject