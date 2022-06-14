import React from "react"
import { Spinner } from "reactstrap"

class Loading extends React.Component {
    render() {
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Spinner color="dark">
                    Loading...
                </Spinner>
            </div>
        )
    }
}

export default Loading