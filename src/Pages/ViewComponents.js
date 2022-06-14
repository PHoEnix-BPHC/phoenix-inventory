import React from "react"
import { Input, Table } from "reactstrap"
import Loading from "../Components/Loading"
import { firestore } from "../config"


class ViewComponents extends React.Component {
    constructor() {
        super()
        this.state = {
            allCategories: [],
            filteredValue: "",
            isLoading: true
        }
    }
    componentDidMount() {
        this.setState({ isLoading: true })
        firestore.collection("category").get().then(Snapshot => {
            let categoryName = []
            Snapshot.forEach(doc => {
                categoryName.push(doc.data())
                this.setState({ allCategories: categoryName })
            })
            this.setState({ isLoading: false })
        })
    }
    render() {
        const filteredArray = this.state.allCategories.filter(comp => comp.name.toLowerCase().includes(this.state.filteredValue.toLowerCase()))
        return (
            <div style={{ display: "flex", flexDirection: "column" }}>
                {this.state.isLoading ? <Loading /> : <div>
                    <h3 style={{ margin: "20px", textAlign: "center" }}>
                        ALL AVAILABLE COMPONENTS
                    </h3>
                    <Input onChange={event => { this.setState({ filteredValue: event.target.value }) }} value={this.state.filteredValue} bsSize="sm" name="search-comp" placeholder="Search for any Category" className="mb-0" style={{ width: "350px", margin: "auto" }} type="search" />
                    <div style={{ margin: "10px" }}></div>
                    {filteredArray.map(category => {
                        return (
                            <Table bordered responsive size="sm" style={{ margin: "auto", width: "80%" }}>
                                <thead style={{ backgroundColor: "#303030", color: "white" }}>
                                    <tr>
                                        <th colSpan={2}>
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
                                                {each.quantity === 0 ?
                                                    <td style={{ width: "150px", color: "red" }}>
                                                        OUT OF STOCK
                                                    </td> :
                                                    <td style={{ width: "150px" }}>
                                                        {each.quantity}
                                                    </td>
                                                }
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        )
                    })
                    }</div>
                }
            </div>
        )
    }
}

export default ViewComponents