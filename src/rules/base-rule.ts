import * as Figma from 'figma-js';
import { AbstractRule } from '../rule';

export class Rule extends AbstractRule {
  visit(node: Figma.Node) {
    console.log('visiting', node.name);
  }
}
