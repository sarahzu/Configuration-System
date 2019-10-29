import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCompressArrowsAlt} from "@fortawesome/free-solid-svg-icons";
import {Button} from "reactstrap";
import {Link, withRouter} from 'react-router-dom';


export default class PreviewVisualComponents extends React.Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        let path = `arrange`;
        this.props.history.push(path);
    }

    render() {
        return(
            <div>
                <h1> preview </h1>
                {/*<Button color="primary" className="px-4"
                         onClick={this.goBack}>
                    <FontAwesomeIcon
                        size={100}
                        icon={faCompressArrowsAlt}
                    />
                </Button>*/}
            </div>
        );
    }
}

/*export default withRouter(PreviewVisualComponents);*/
