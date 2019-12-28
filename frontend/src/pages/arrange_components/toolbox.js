import React from "react";

export class ToolBoxItem extends React.Component {
    render() {
        return (
            <div
                className="toolbox__items__item"
                onClick={this.props.onTakeItem.bind(undefined, this.props.item)}
            >
                {/*{this.props.item.i}*/}
                {this.props.title}
            </div>
        );
    }
}
export class ToolBox extends React.Component {
    render() {
        let compList
        if (localStorage.getItem("visualComponents")) {
           compList  = Object.keys(JSON.parse(localStorage.getItem("visualComponents")));
        }
        else {
            compList = []
        }
        return (
            <div className="toolbox">
                <span className="toolbox__title">Toolbox</span>
                <div className="toolbox__items">
                    {this.props.items.map(item => (
                        Object.keys(item).length !== 0 && compList.length !== 0?
                            (
                                <ToolBoxItem
                                    key={item.i}
                                    item={item}
                                    onTakeItem={this.props.onTakeItem}
                                    title={compList[parseInt(item.i, 10)]}
                        />) : (<div style={{display:"inline"}}/>)
                    ))}
                </div>
            </div>
        );
    }
}
