import React from "react";

export const input =
    {
        components: ["Component 1", "Component 2", "Component 3", "Component 4", "Component 5", "Component 6"],
        componentsParameters: [
            {
                name: "Component 1",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"},
                    { parameter: "Parameter 2", value: "Value 2"},
                    { parameter: "Parameter 3", value: "Value 3"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" },
                    { id: "value2", value: "Value 2" },
                    { id: "value3", value: "Value 3" }
                ],
            },
            {
                name: "Component 2",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"},
                    { parameter: "Parameter 2", value: "Value 2"},
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" },
                    { id: "value2", value: "Value 2" },
                ],
            },
            {
                name: "Component 3",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"},
                    { parameter: "Parameter 2", value: "Value 2"},
                    { parameter: "Parameter 3", value: "Value 3"},
                    { parameter: "Parameter 4", value: "Value 4"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" },
                    { id: "value2", value: "Value 2" },
                    { id: "value3", value: "Value 3" },
                    { id: "value4", value: "Value 4" }
                ],
            },
            {
                name: "Component 4",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" }
                ],
            },
            {
                name: "Component 5",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"},
                    { parameter: "Parameter 2", value: "Value 2"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" },
                    { id: "value2", value: "Value 2" }
                ],
            },
            {
                name: "Component 6",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" }
                ],
            }
        ],
        decisionCards: ["Decision Card 1", "Decision Card 2", "Decision Card 3"],
        decisionCardsParameters: [
            {
                name: "Decision Card 1",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"},
                    { parameter: "Parameter 2", value: "Value 2"},
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" },
                    { id: "value2", value: "Value 2" },
                ],
            },
            {
                name: "Decision Card 2",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"},
                    { parameter: "Parameter 2", value: "Value 2"},
                    { parameter: "Parameter 3", value: "Value 3"},
                    { parameter: "Parameter 4", value: "Value 4"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" },
                    { id: "value2", value: "Value 2" },
                    { id: "value3", value: "Value 3" },
                    { id: "value4", value: "Value 4" }
                ],
            },
            {
                name: "Decision Card 3",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1"}
                ],
                issueTypes: [
                    { id: "value1", value: "Value 1" }
                ],
            }
        ],


    };

export default class Buffer extends React.Component {}