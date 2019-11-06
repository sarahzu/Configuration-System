import React from "react";
import axios from 'axios';
require('dotenv').config();

export const input =
    {
        components: ["Component 1", "Component 2", "Component 3", "Component 4", "Component 5", "Component 6"],
        componentsParameters: [
            {
                name: "Component 1",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" }
                        ]},
                    { parameter: "Parameter 2", value: "Value 1", issueTypes: [{ id: "value1", value: "Value 1" }]},
                    { parameter: "Parameter 3", value: "Value 3", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value3", value: "Value 3" }
                        ]}
                ],
                description: "bla bla bla"
            },
            {
                name: "Component 2",
                rows: [
                    { parameter: "Parameter 1", value: "Value 2", issueTypes: [
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" }
                        ]},
                    { parameter: "Parameter 2", value: "Value 4", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                            { id: "value4", value: "Value 4" }
                        ]},
                ],
                description: "bli bla"

            },
            {
                name: "Component 3",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" }
                        ]},
                    { parameter: "Parameter 2", value: "Value 2", issueTypes: [
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" }
                        ]},
                    { parameter: "Parameter 3", value: "Value 3", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value3", value: "Value 3" },
                            { id: "value5", value: "Value 5" }
                        ]},
                    { parameter: "Parameter 4", value: "Value 4", issueTypes: [
                            { id: "value4", value: "Value 4" },
                            { id: "value5", value: "Value 5" },
                            { id: "value6", value: "Value 6" }
                        ]}
                ],
                description: "bli bli bli bli"
            },
            {
                name: "Component 4",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" },
                            { id: "value4", value: "Value 4" },
                            { id: "value5", value: "Value 5" }
                        ]}
                ],
                description: "blibli"
            },
            {
                name: "Component 5",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                        ]},
                    { parameter: "Parameter 2", value: "Value 2", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" },
                        ]}
                ],
                description: "bla blaaaaa"
            },
            {
                name: "Component 6",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value6", value: "Value 6" }
                        ]}
                ],
                description: "blaaaa"
            }
        ],
        decisionCards: ["Decision Card 1", "Decision Card 2", "Decision Card 3"],
        decisionCardsParameters: [
            {
                name: "Decision Card 1",
                rows: [
                    { parameter: "Parameter 1", value: "Value 4", issueTypes: [
                            { id: "value4", value: "Value 4" },
                            { id: "value7", value: "Value 7" },
                        ]},
                    { parameter: "Parameter 2", value: "Value 2", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value2", value: "Value 2" },
                            { id: "value8", value: "Value 8" },
                        ]},
                ],
                description: "bliiiiii"
            },
            {
                name: "Decision Card 2",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value4", value: "Value 4" }
                        ]},
                    { parameter: "Parameter 2", value: "Value 2", issueTypes: [
                            { id: "value2", value: "Value 2" },
                            { id: "value3", value: "Value 3" },
                            { id: "value9", value: "Value 9" }
                        ]},
                    { parameter: "Parameter 3", value: "Value 3", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value3", value: "Value 3" },
                            { id: "value4", value: "Value 4" }
                        ]},
                    { parameter: "Parameter 4", value: "Value 4", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value4", value: "Value 4" }
                        ]}
                ],
                description: "blooob"
            },
            {
                name: "Decision Card 3",
                rows: [
                    { parameter: "Parameter 1", value: "Value 1", issueTypes: [
                            { id: "value1", value: "Value 1" },
                            { id: "value10", value: "Value 10" },
                            { id: "value11", value: "Value 11" }
                        ]}
                ],
                description: "blob blob blob"
            }
        ],
    };

export default class Buffer extends React.Component {}