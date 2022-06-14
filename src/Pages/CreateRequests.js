import React from "react"
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalHeader, ModalFooter, Table } from "reactstrap"
import Loading from "../Components/Loading"
import { Navigate } from "react-router-dom"
import firebase, { firestore } from "../config"

class CreateRequests extends React.Component {
    constructor() {
        super()
        this.state = {
            allProjects: [],
            allComponents: [],
            allQuantity: [],
            selectComponents: [],
            selectQuantity: [],
            project: "",
            date: "",
            selectedComp: "",
            selectedQty: 0,
            isModal: false,
            isLoading: false,
            alert: "",
            role: "",
            error: ""
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
        firestore.collection("projects").get().then(Snapshot => {
            let project = ["Select Projects"]
            Snapshot.forEach(doc => {
                project.push(doc.data().name)
                this.setState({ allProjects: project })
            })
        }).then(() => {
            firestore.collection("components").get().then(Snapshot => {
                let component = ["Select Components"]
                let quantity = [0]
                Snapshot.forEach(doc => {
                    component.push(doc.data().name)
                    quantity.push(doc.data().quantity)
                    this.setState({ allComponents: component, allQuantity: quantity, isLoading: false })
                })
            }).catch(() => {
                this.setState({ error: "Some error has occurred. Please try again later" })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            })
        }).catch(() => {
            this.setState({ error: "Some error has occurred. Please try again later" })
            setTimeout(() => {
                this.setState({ error: "" })
            }, 3000)
        })
    }
    render() {
        const onChange = (event) => {
            const { value, name } = event.target
            this.setState({ [name]: value })
        }
        const toggleModal = () => {
            this.setState({ isModal: !this.state.isModal })
        }
        const addToCart = () => {
            toggleModal()
            let comp = this.state.selectComponents
            let qty = this.state.selectQuantity
            comp.push(this.state.selectedComp)
            qty.push(this.state.selectedQty)
            this.setState({ selectComponents: comp, selectQuantity: qty, alert: "The component has been added" })
            setTimeout(() => {
                this.setState({ alert: "" })
            }, 3000)
        }
        const issueSubmit = () => {
            const adder = localStorage.getItem("Email")
            this.setState({ isLoading: true })
            const { selectComponents, selectQuantity, date, project } = this.state
            firestore.collection("requests").doc().set({
                status: "Pending",
                components: selectComponents,
                qty: selectQuantity,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                adder: adder,
                project: project,
                date: date,
                approved: false
            }).then(() => {
                this.setState({ alert: "Your request has been created", isLoading: false })
                setTimeout(() => {
                    this.setState({ alert: "" })
                }, 3000)
            })
        }
        var disabled = (this.state.date === "" || this.state.project === "" || this.state.selectComponents.length === 0)
        if (this.state.role === "NA")
            return <Navigate to="/login" />
        else return (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
                {this.state.isLoading ? <Loading /> :
                    <Card style={{ width: "400px" }}>
                        <CardBody>
                            <CardTitle style={{ textAlign: "center", margin: "0px 10px 10px 10px", padding: "0px" }} tag="h5">
                                ISSUE COMPONENTS
                            </CardTitle>
                            <Form>
                                <FormGroup>
                                    <Label style={{ padding: "0px" }}>
                                        PROJECT NAME
                                    </Label>
                                    <Input onChange={onChange} value={this.state.project} name="project" type="select">
                                        {this.state.allProjects.map(each => {
                                            return (
                                                <option value={each}>
                                                    {each}
                                                </option>
                                            )
                                        })}
                                    </Input>
                                </FormGroup>
                                <FormGroup>
                                    <Label style={{ padding: "0px" }}>
                                        DATE OF RETURN
                                    </Label>
                                    <Input onChange={onChange} value={this.state.date} name="date" placeholder="Enter the date of return" type="date" />
                                </FormGroup>
                                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                    <Button onClick={toggleModal} style={{ fontSize: "15px", padding: "5px", margin: "0px 0px 20px 0px" }} color="success">
                                        ADD COMPONENTS
                                    </Button>
                                </div>
                                <div style={{ fontSize: "15px", color: "red", marginBottom: "10px", textAlign: "center" }}>
                                    {this.state.error}
                                </div>
                                <div style={{ fontSize: "15px", color: "green", marginBottom: "10px", textAlign: "center" }}>
                                    {this.state.alert}
                                </div>
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <Button disabled={disabled} onClick={issueSubmit} color="primary">
                                        APPLY FOR ISSUE
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>}
                <Card style={{ width: "400px", margin: "0px 10px 0px 10px" }}>
                    <CardBody>
                        <CardTitle style={{ textAlign: "center", margin: "0px 10px 10px 10px", padding: "0px" }} tag="h5">
                            SELECTED COMPONENTS
                        </CardTitle>
                        {this.state.selectComponents.length !== 0 ?
                            <Table bordered responsive size="sm" style={{ margin: "auto", width: "80%" }}>
                                <thead style={{ backgroundColor: "#303030", color: "white" }}>
                                    <tr>
                                        <th>
                                            NAME
                                        </th>
                                        <th>
                                            QUANTITY
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.selectComponents.map((each, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    {each}
                                                </td>
                                                <td>
                                                    {this.state.selectQuantity[index]}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table> :
                            <div style={{ color: "grey", fontSize: "12px", textAlign: "center" }}>
                                No components added yet
                            </div>}
                    </CardBody>
                </Card>
                <Modal isOpen={this.state.isModal} centered toggle={toggleModal} >
                    <ModalHeader toggle={toggleModal}>
                        SELECT COMPONENT
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <FormGroup>
                                <Label style={{ padding: "0px" }}>
                                    COMPONENT NAME
                                </Label>
                                <Input onChange={onChange} value={this.state.selectedComp} name="selectedComp" type="select">
                                    {this.state.allComponents.map(each => {
                                        return (
                                            <option value={each}>
                                                {each}
                                            </option>
                                        )
                                    })}
                                </Input>
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
                        <Button onClick={addToCart} color="success" >
                            ADD TO CART
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default CreateRequests