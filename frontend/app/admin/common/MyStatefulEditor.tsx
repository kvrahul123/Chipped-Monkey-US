"use client";
import React, { Component } from "react";
import RichTextEditor, { EditorValue } from "react-rte";

interface MyStatefulEditorProps {
  markup: string;
  onChange?: (value: string) => void;
}

interface MyStatefulEditorState {
  value: EditorValue;
}

export default class MyStatefulEditor extends Component<
  MyStatefulEditorProps,
  MyStatefulEditorState
> {
  constructor(props: MyStatefulEditorProps) {
    super(props);

    const value = RichTextEditor.createValueFromString(props.markup || "", "html");
    this.state = { value };
  }

  handleChange = (value: EditorValue) => {
    this.setState({ value });
    if (this.props.onChange) {
      this.props.onChange(value.toString("html"));
    }
  };

  render() {
    return (
      <div suppressHydrationWarning>
        <RichTextEditor
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
