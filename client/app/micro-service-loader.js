import jquery from 'jquery';
import go from 'gojs';
import jsonData2 from './data/jasonData2.json';

import './index.css';

export default class MicroServiceGraphLoader {

    constructor() {
        Object.assign(
            this,
            {
                go,
                jquery,
                myDiagram: null,
            }
        )
    }

    init() {
        this.jquery("body").append("<div id='myDiagramDiv'>Loading ...</div>");


        const $ = this.go.GraphObject.make;
        this.myDiagram =
            $(this.go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
                {
                    initialAutoScale: this.go.Diagram.Uniform,
                    // layout: $(this.go.LayeredDigraphLayout),
                    layout:
                        $(go.ForceDirectedLayout,  // automatically spread nodes apart
                            {maxIterations: 200, defaultSpringLength: 30, defaultElectricalCharge: 100}),
                    // direction:0,
                    // start everything in the middle of the viewport
                    initialContentAlignment: this.go.Spot.Center,
                    // have mouse wheel events zoom in and out instead of scroll up and down
                    "toolManager.mouseWheelBehavior": this.go.ToolManager.WheelZoom,
                    // support double-click in background creating a new node
                    // "clickCreatingTool.archetypeNodeData": {text: "new node"},
                    // enable undo & redo
                    "undoManager.isEnabled": true
                });

        // define the Node template
        this.myDiagram.nodeTemplate =
            $(this.go.Node, "Auto",
                // new this.go.Binding("location", "loc", this.go.Point.parse).makeTwoWay(this.go.Point.stringify),
                // define the node's outer shape, which will surround the TextBlock
                $(this.go.Shape, "RoundedRectangle",
                    {
                        parameter1: 8,  // the corner has a large radius
                        fill: $(this.go.Brush, "Linear", {0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)"}),
                        stroke: null,
                        portId: "",  // this Shape is the Node's port, not the whole Node
                        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
                        cursor: "pointer"
                    }),
                $(this.go.TextBlock,
                    {
                        font: "bold 9pt helvetica, bold arial, sans-serif",
                        editable: false  // editing the text automatically updates the model data
                    },
                    new this.go.Binding("text").makeTwoWay())
            );

        // replace the default Link template in the linkTemplateMap
        this.myDiagram.linkTemplate =
            $(this.go.Link,  // the whole link panel
                {
                    curve: this.go.Link.Bezier, adjusting: this.go.Link.Stretch,
                    reshapable: true, relinkableFrom: true, relinkableTo: true,
                    toShortLength: 3
                },
                new this.go.Binding("points").makeTwoWay(),
                // new this.go.Binding("curviness"),
                $(this.go.Shape,  // the link shape
                    new go.Binding("stroke", "color"),  // shape.stroke = data.color
                    {strokeWidth: 1.5}),
                $(this.go.Shape,  // the arrowhead
                    new go.Binding("stroke", "color"),  // shape.stroke = data.color
                    {toArrow: "standard", stroke: null}),
                $(this.go.Panel, "Auto",
                    // $(this.go.Shape,  // the label background, which becomes transparent around the edges
                    //     {
                    //         fill: $(this.go.Brush, "Radial",
                    //             {0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)"}),
                    //         stroke: null
                    //     }),
                    $(this.go.TextBlock, "transition",  // the label text
                        {
                            textAlign: "center",
                            font: "9pt helvetica, arial, sans-serif",
                            margin: 4,
                            editable: true  // enable in-place editing
                        },
                        // editing the text automatically updates the model data
                        new this.go.Binding("text").makeTwoWay())
                )
            );
    }

    load() {
        const jsonData1 = {
            nodeKeyProperty: 'id',
            nodeDataArray: [
                {id: 'a', text: "Initial"},
                {id: 'b', text: "First down"},
                {id: 'c', text: "First up"},
                {id: 'd', text: "Second down"},
                {id: 'e', text: "Wait"}
            ],
            linkDataArray: [
                {from: 'a', to: 'b', text: "down", color: 'red'},
                {from: 'b', to: 'a', text: "up (moved)\nPOST", color: 'green'},
                {from: 'a', to: 'c', text: "up (no move)"},
                {from: 'b', to: 'e', text: "timer"},
                {from: 'c', to: 'a', text: "timer\nPOST"},
                {from: 'c', to: 'd', text: "down"},
                {from: 'd', to: 'a', text: ""},
                {from: 'e', to: 'a', text: "up\nPOST"}
            ]
        };

        this.myDiagram.model = go.Model.fromJson(jsonData2);

        // this.jquery.get("./microservices/get/graph", (data) => {
        //     console.log("success");
        //     console.log(data);
        //     this.myDiagram.model = this.go.Model.fromJson(data);
        //
        // })
        //     .done((data) => {
        //         console.log("second success");
        //         console.log(data);
        //     })
        //     .fail(() => {
        //         console.log("error");
        //     })
        //     .always(() => {
        //         console.log("finished");
        //     });
    }
}