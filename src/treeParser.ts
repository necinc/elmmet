import * as vscode from 'vscode';

function matchAttr(attribute: string): string {
  switch (attribute) {
    case "type":
      return "type'";
    default:
      return attribute;
  }
}

function matchAttrValue(attrValue: string): string {
  if (attrValue === null) {
    return `True`;
  }

  if (isNaN(parseFloat(attrValue)) === false) {
    return `${attrValue}`;
  }

  return `"${attrValue}"`;
}

function parseAttributes(attributes: Array<any>): string {
  let parsedAttributesArray = attributes.map(attr => {
    return `${matchAttr(attr.name)} ${matchAttrValue(attr.value)}`;
  });

  return parsedAttributesArray.length > 0
    ? ` ${parsedAttributesArray.join(", ")} `
    : '';
}

function indent(level: number): string {
  const config = vscode.workspace.getConfiguration("editor");
  const tabSymbol = config.insertSpaces ? " ".repeat(config.tabSize) : "\t";

  let indentationString = "";
  for (let i = 0; i < level; i += 1) {
    indentationString += tabSymbol;
  }

  return indentationString;
}

export function buildComposition(
  node: any,
  indentLevel: number = 0
): string {

  if (node.name === null && node.children.length > 0) {
    return node.children.map(childNode => buildComposition(childNode, indentLevel)).join('');
  }

  const attrs = parseAttributes(node.attributes);

  const children = node.children
    .map(childNode => buildComposition(childNode, indentLevel + 1))
    .join('\n, ');

  const nodeString =
      indent(indentLevel) +
      `${node.name} [${attrs}] [${children}]`;

  return nodeString
}