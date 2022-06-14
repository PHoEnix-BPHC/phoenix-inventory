import React from "react"
import { Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Table, ModalBody, Modal, ModalFooter, ModalHeader } from "reactstrap"
import { firestore } from "../config"
import { Navigate } from "react-router-dom"
import firebase from "../config"
import Loading from "../Components/Loading"

class AddComponents extends React.Component {
    constructor() {
        super()
        this.state = {
            addCategoryName: "",
            name: "",
            price: 0,
            quantity: 0,
            categoryName: "Motors",
            allCategories: [],
            isEdit: false,
            isName: false,
            isCategory: false,
            isLoading: false,
            alert: "",
            role: "",
            error: "",
            editName: "",
            editQty: 0
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
        firestore.collection("category").get().then(Snapshot => {
            let categories = []
            Snapshot.forEach(doc => {
                categories.push(doc.data())
                this.setState({ allCategories: categories })
            })
            this.setState({ isLoading: false })
        })
    }
    render() {
        const onChange = (event) => {
            const { value, name } = event.target
            this.setState({ [name]: value })
        }
        const toggleEdit = () => {
            this.setState({ isEdit: !this.state.isEdit })
        }
        const toggleName = () => {
            this.setState({ isName: !this.state.isName })
        }
        const toggleCategory = () => {
            this.setState({ isCategory: !this.state.isCategory })
        }
        const categorySubmit = () => {
            this.setState({ isLoading: true })
            firestore.collection("category").doc(this.state.addCategoryName).set({
                componentList: [],
                name: this.state.addCategoryName
            }).then(() => {
                this.setState({ alert: "Category has been created successfully!" })
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
        const componentSubmit = () => {
            const { name, price, quantity, categoryName } = this.state
            let price1 = parseInt(price)
            let quantity1 = parseInt(quantity)
            this.setState({ isLoading: true })
            firestore.collection("components").doc().set({
                name: name,
                price: price1,
                quantity: quantity1,
                category: categoryName
            }).then(() => {
                let temp = {
                    name: name,
                    quantity: quantity1
                }
                firestore.collection("category").doc(categoryName).update({
                    componentList: firebase.firestore.FieldValue.arrayUnion(temp)
                }).then(() => {
                    this.setState({ alert: "Component has been added successfully!", isLoading: false })
                    setTimeout(() => {
                        this.setState({ alert: "" })
                    }, 3000)
                })
            }).catch(() => {
                this.setState({ error: "Some error has occurred. Please try again later" })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            })
        }
        const editComp = (comp) => {
            this.setState({ isEdit: !this.state.isEdit, editName: comp.name, editQty: comp.quantity })
        }
        const changeQuantity = () => {
            toggleEdit()
            const quantity1 = parseInt(this.state.editQty)
            this.setState({ isLoading: true })
            firestore.collection("components").where("name", "==", this.state.editName).get().then(document => {
                document.forEach(EachDoc => {
                    const id = EachDoc.id
                    const category = EachDoc.data().category
                    const obj = {
                        name: EachDoc.data().name,
                        quantity: parseInt(this.state.editQty)
                    }
                    firestore.collection("components").doc(id).update({
                        quantity: quantity1
                    }).then(() => {
                        firestore.collection("category").doc(category).get().then(document => {
                            const array = document.data().componentList
                            let filteredArray = array.filter(item => item.name !== this.state.editName)
                            filteredArray.push(obj)
                            firestore.collection("category").doc(category).update({
                                componentList: filteredArray
                            }).then(() => {
                                window.location.reload()
                                this.setState({ alert: "The component has been updated" })
                                setTimeout(() => {
                                    this.setState({ alert: "" })
                                }, 3000)
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
                    }).catch(() => {
                        this.setState({ error: "Some error has occurred. Please try again later" })
                        setTimeout(() => {
                            this.setState({ error: "" })
                        }, 3000)
                    })
                })
            }).catch(() => {
                this.setState({ error: "Some error has occurred. Please try again later" })
                setTimeout(() => {
                    this.setState({ error: "" })
                }, 3000)
            })
        }
        if (this.state.role === "viewer")
            return <Navigate to="/" />
        else if (this.state.role === "NA")
            return <Navigate to="/login" />
        else if (this.state.role === "owner")
            return (
                <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    {this.state.isLoading ? <Loading /> :
                        <div>
                            <div>
                                {this.state.allCategories.map(category => {
                                    return (
                                        <Table bordered responsive size="sm" style={{ margin: "auto", width: "80%" }}>
                                            <thead style={{ backgroundColor: "#303030", color: "white" }}>
                                                <tr>
                                                    <th colSpan={3}>
                                                        {category.name}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {category.componentList.map(each => {
                                                    return (
                                                        <tr>
                                                            <td>
                                                                {each.name}
                                                            </td>
                                                            <td style={{ width: "100px" }}>
                                                                {each.quantity}
                                                            </td>
                                                            <td style={{ width: "100px" }}>
                                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                                    <Button onClick={() => editComp(each)} color="danger" style={{ width: "75px", fontSize: "14px", padding: "5px" }}>
                                                                        EDIT
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </Table>
                                    )
                                })}
                            </div>
                            <div style={{ fontSize: "15px", color: "red", marginBottom: "10px", textAlign: "center" }}>
                                {this.state.error}
                            </div>
                            <div style={{ fontSize: "15px", color: "green", marginBottom: "10px", textAlign: "center" }}>
                                {this.state.alert}
                            </div>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <Card style={{ width: "300px", margin: "10px" }}>
                                    <CardBody>
                                        <CardTitle style={{ textAlign: "center", margin: "0px", padding: "0px" }} tag="h5">
                                            ADD COMPONENT
                                        </CardTitle>
                                        <Form>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    NAME {"  "}
                                                    <i onClick={toggleName} style={{ cursor: "pointer" }} className="fa fa-question-circle"></i>
                                                </Label>
                                                <Input onChange={onChange} value={this.state.name} name="name" placeholder="Enter the component name" type="text" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    CATEGORY {"  "}
                                                    <i onClick={toggleCategory} style={{ cursor: "pointer" }} className="fa fa-question-circle"></i>
                                                </Label>
                                                <Input onChange={onChange} value={this.state.categoryName} name="categoryName" type="select">
                                                    {this.state.allCategories.map(each => {
                                                        return (
                                                            <option value={each.name}>
                                                                {each.name}
                                                            </option>
                                                        )
                                                    })}
                                                </Input>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    QUANTITY
                                                </Label>
                                                <Input onChange={onChange} value={this.state.quantity} name="quantity" placeholder="Enter the quantity" type="number" />
                                            </FormGroup>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    PRICE (Rs.)
                                                </Label>
                                                <Input onChange={onChange} value={this.state.price} name="price" placeholder="Enter the price" type="number" />
                                            </FormGroup>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <Button onClick={componentSubmit} color="primary">
                                                    ADD TO INVENTORY
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                                <Card style={{ width: "300px", margin: "10px" }}>
                                    <CardBody>
                                        <CardTitle style={{ textAlign: "center", margin: "0px", padding: "0px" }} tag="h5">
                                            ADD CATEGORY
                                        </CardTitle>
                                        <Form>
                                            <FormGroup>
                                                <Label style={{ padding: "0px" }}>
                                                    NAME {"  "}
                                                    <i onClick={toggleCategory} style={{ cursor: "pointer" }} className="fa fa-question-circle"></i>
                                                </Label>
                                                <Input onChange={onChange} value={this.state.addCategoryName} name="addCategoryName" placeholder="Enter the category name" type="text" />
                                            </FormGroup>
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <Button onClick={categorySubmit} color="primary">
                                                    ADD CATEGORY
                                                </Button>
                                            </div>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </div>
                        </div>}
                    <Modal isOpen={this.state.isEdit} centered toggle={toggleEdit} >
                        <ModalHeader toggle={toggleEdit} >
                            EDIT QUANTITY
                        </ModalHeader>
                        <ModalBody>
                            <Label style={{ fontWeight: "bold", padding: "0px", margin: "0px" }}>
                                NAME:
                            </Label><br />
                            {this.state.editName}
                            <br />
                            <Label style={{ fontWeight: "bold", padding: "0px", margin: "10px 0px 0px 0px" }}>
                                CHANGE QUANTITY:
                            </Label>
                            <Input onChange={onChange} type="number" name="editQty" value={this.state.editQty} />
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={changeQuantity} color="success">
                                CHANGE QUANTITY
                            </Button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.isName} centered toggle={toggleName} >
                        <ModalHeader toggle={toggleName} >
                            NAMING CONVENTIONS
                        </ModalHeader>
                        <ModalBody>
                            <ol>
                                <li>
                                    The naming conventions are important to keep duplicates away from the inventory
                                </li>
                                <li>
                                    Each component should have three words, that is, each component should have three spaces.
                                    <ul>
                                        <li>The first word should consist of the main word. For example, Ardunio, RaspberryPi, Ultrasonic, Jumper, IR, etc.</li>
                                        <li>The second word should consist of the successor which denotes what it is. For example, Wire, sensor, Motor, Board, Connector, Battery,etc</li>
                                        <li>The third word should consist of the model number. Model Number is that number which affects the usage of the component. For example, UNO, MEGA, ESP32</li>
                                    </ul>
                                </li>
                            </ol>
                        </ModalBody>
                    </Modal>
                    <Modal isOpen={this.state.isCategory} centered toggle={toggleCategory} >
                        <ModalHeader toggle={toggleCategory} >
                            CATEGORY CONVENTIONS
                        </ModalHeader>
                        <ModalBody>
                            <ol>
                                <li>
                                    The categorization is crucial as it enables easy searching of components in the inventory.
                                </li>
                                <li>
                                    Look up for the existing categories before creating a new one.
                                </li>
                                <li>
                                    The categories which can be classified are mentioned below:
                                    <ul>
                                        <li>
                                            <b>PROGRAMMING BOARDS: </b>
                                            This include boards like arduino, raspberry pi, Development Board Modules or any other board which act as a microcontroller
                                        </li>
                                        <li>
                                            <b>SENSORS: </b>
                                            This include all types of sensor modules
                                        </li>
                                        <li>
                                            <b>MICRO COMPONENTS: </b>
                                            This include small, individual, single components like resistors, capacitors, inductors, ICs, single IC microcontroller, MOSFETs, wires and other small connectors
                                        </li>
                                        <li>
                                            <b>MODULES: </b>
                                            This include small modules which are not a part of any of the above mentioned categories
                                        </li>
                                        <li>
                                            <b>MOTORS: </b>
                                            This include all types of motor including AC, DC, Stepper, Servo Motor, etc. Note quadcopter brushless motors are kept in a separate category
                                        </li>
                                        <li>
                                            <b>QUADCOPTERS: </b>
                                            Since this is conducted at wide scale, this category is made separate. It includes propellers, ESCs, brushless motors, body frames, flight controller,receiver and transmitter.
                                        </li>
                                        <li>
                                            <b>FRAMES: </b>
                                            This include all plastic, glass, metal related outer coverings of any project.
                                        </li>
                                        <li>
                                            <b>MECHANICAL: </b>
                                            This includes all non electronical things which are used in any project such as screws, nuts, bolts, bearings, etc.
                                        </li>
                                        <li>
                                            <b>SOURCE COMPONENTS: </b>
                                            This includes all components which help in providing current or voltage like batteries, eliminators, adaptors, SMPs, etc.
                                        </li>
                                        <li>
                                            <b>MISCELLANEOUS: </b>
                                            This category is kept only for extreme exclusion cases where the component doesn't fit in any of the above categories.
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Following the above is important for all the users as it will help it in keeping the inventory organised
                                </li>
                            </ol>
                        </ModalBody>
                    </Modal>
                </div>
            )
    }
}

export default AddComponents