import React from 'react'

export default class CheckboxList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        if (props.input === "comp") {
            if (localStorage.getItem("visualComponents")) {
                let json = JSON.parse(localStorage.getItem("visualComponents"));
                Object.keys(json).map((e, i) => {
                    this.state[e] = json[e];
                });
            }
            else {
                props.values.map((v, i) => {
                    this.state[v] = false
                });
            }
        }
        else if (props.input === "dc") {
            if (localStorage.getItem("decisionCards")) {
                let json = JSON.parse(localStorage.getItem("decisionCards"));
                Object.keys(json).map((e, i) => {
                    this.state[e] = json[e];
                });
            }
            else {
                props.values.map((v, i) => {
                    this.state[v] = false
                });
            }
        }
        else {
            props.values.map((v, i) => {
            this.state[v] = false
            });
        }

    }

    onChange(key, value) {
        let dict = {};
        this.setState({ [key]: value }, (state) => {
            this.props.onChange(this.state)
            dict[key] = value;
        });
        //FIXME: only true values
        /*if (this.props.input === "comp") {
            localStorage.setItem("visualComponents", JSON.stringify(dict))
        }
        else if (this.props.input === "dc") {
            localStorage.setItem("decisionCards", JSON.stringify(dict))
        }*/
    }

    render() {
        return (
            <div>
                {this.props.values.map((value, i) => (
                    <div className="checkbox" key={i}>
                        <label>
                            <input
                                onChange={(e) => this.onChange(value, e.target.checked)}
                                type='checkbox'
                                value={this.state[value]}
                            />
                            {value}
                        </label>
                    </div>
                ))}
            </div>
        )
    }
}