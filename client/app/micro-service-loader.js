import jquery from 'jquery';
import go from 'gojs';

import './index.css';


export default class MicroServiceGraphLoader {

    constructor(){
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
                    // start everything in the middle of the viewport
                    initialContentAlignment: this.go.Spot.Center,
                    // have mouse wheel events zoom in and out instead of scroll up and down
                    "toolManager.mouseWheelBehavior": this.go.ToolManager.WheelZoom,
                    // support double-click in background creating a new node
                    "clickCreatingTool.archetypeNodeData": {text: "new node"},
                    // enable undo & redo
                    "undoManager.isEnabled": true
                });

        // when the document is modified, add a "*" to the title and enable the "Save" button
        this.myDiagram.addDiagramListener("Modified", (e) => {
            const button = document.getElementById("SaveButton");
            if (button) button.disabled = !this.myDiagram.isModified;
            const idx = document.title.indexOf("*");
            if (this.myDiagram.isModified) {
                if (idx < 0) document.title += "*";
            } else {
                if (idx >= 0) document.title = document.title.substr(0, idx);
            }
        });

        // define the Node template
        this.myDiagram.nodeTemplate =
            $(this.go.Node, "Auto",
                new this.go.Binding("location", "loc", this.go.Point.parse).makeTwoWay(this.go.Point.stringify),
                // define the node's outer shape, which will surround the TextBlock
                $(this.go.Shape, "RoundedRectangle",
                    {
                        parameter1: 20,  // the corner has a large radius
                        fill: $(this.go.Brush, "Linear", {0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)"}),
                        stroke: null,
                        portId: "",  // this Shape is the Node's port, not the whole Node
                        fromLinkable: true, fromLinkableSelfNode: true, fromLinkableDuplicates: true,
                        toLinkable: true, toLinkableSelfNode: true, toLinkableDuplicates: true,
                        cursor: "pointer"
                    }),
                $(this.go.TextBlock,
                    {
                        font: "bold 11pt helvetica, bold arial, sans-serif",
                        editable: true  // editing the text automatically updates the model data
                    },
                    new this.go.Binding("text").makeTwoWay())
            );

        // unlike the normal selection Adornment, this one includes a Button
        this.myDiagram.nodeTemplate.selectionAdornmentTemplate =
            $(this.go.Adornment, "Spot",
                $(this.go.Panel, "Auto",
                    $(this.go.Shape, {fill: null, stroke: "blue", strokeWidth: 2}),
                    $(this.go.Placeholder)  // a Placeholder sizes itself to the selected Node
                ),
                // the button to create a "next" node, at the top-right corner
                $("Button",
                    {
                        alignment: this.go.Spot.TopRight,
                        click: this.addNodeAndLink.bind(this)  // this function is defined below
                    },
                    $(this.go.Shape, "PlusLine", {width: 6, height: 6})
                ) // end button
            ); // end Adornment

        // replace the default Link template in the linkTemplateMap
        this.myDiagram.linkTemplate =
            $(this.go.Link,  // the whole link panel
                {
                    curve: this.go.Link.Bezier, adjusting: this.go.Link.Stretch,
                    reshapable: true, relinkableFrom: true, relinkableTo: true,
                    toShortLength: 3
                },
                new this.go.Binding("points").makeTwoWay(),
                new this.go.Binding("curviness"),
                $(this.go.Shape,  // the link shape
                    {strokeWidth: 1.5}),
                $(this.go.Shape,  // the arrowhead
                    {toArrow: "standard", stroke: null}),
                $(this.go.Panel, "Auto",
                    $(this.go.Shape,  // the label background, which becomes transparent around the edges
                        {
                            fill: $(this.go.Brush, "Radial",
                                {0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)"}),
                            stroke: null
                        }),
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

    // clicking the button inserts a new node to the right of the selected node,
    // and adds a link to that new node
    addNodeAndLink(e, obj) {
        const adornment = obj.part;
        const diagram = e.diagram;
        diagram.startTransaction("Add State");

        // get the node data for which the user clicked the button
        const fromNode = adornment.adornedPart;
        const fromData = fromNode.data;
        // create a new "State" data object, positioned off to the right of the adorned Node
        const toData = {text: "new"};
        const p = fromNode.location.copy();
        p.x += 200;
        toData.loc = this.go.Point.stringify(p);  // the "loc" property is a string, not a Point object
        // add the new node data to the model
        const model = diagram.model;
        model.addNodeData(toData);

        // create a link data from the old node data to the new node data
        const linkdata = {
            from: model.getKeyForNodeData(fromData),  // or just: fromData.id
            to: model.getKeyForNodeData(toData),
            text: "transition"
        };
        // and add the link data to the model
        model.addLinkData(linkdata);

        // select the new Node
        const newnode = diagram.findNodeForData(toData);
        diagram.select(newnode);

        diagram.commitTransaction("Add State");

        // if the new node is off-screen, scroll the diagram to show the new node
        diagram.scrollToRect(newnode.actualBounds);
    }

    load() {
        // myDiagram.model = go.Model.fromJson(jsonData);

        this.jquery.get("/microservices/get/graph", (data) => {
            console.log("success");
            console.log(data);
            this.myDiagram.model = this.go.Model.fromJson(data);

        })
            .done((data) => {
                console.log("second success");
                console.log(data);
            })
            .fail(() =>{
                console.log("error");
            })
            .always(() =>{
                console.log("finished");
            });
    }
}