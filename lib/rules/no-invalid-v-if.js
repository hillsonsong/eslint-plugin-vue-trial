/**
 * @author Toru Nagashima
 * @copyright 2016 Toru Nagashima. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const utils = require("../utils")

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Check whether the given node is the root element or not.
 * @param {ASTNode} element The element node to check.
 * @returns {boolean} `true` if the node is the root element.
 */
function isRootElement(element) {
    return (
        element.parent.type === "Program" ||
        element.parent.parent.type === "Program"
    )
}

/**
 * Creates AST event handlers for no-invalid-v-if.
 *
 * @param {RuleContext} context - The rule context.
 * @returns {object} AST event handlers.
 */
function create(context) {
    utils.registerTemplateBodyVisitor(context, {
        "VAttribute[directive=true][key.name='if']"(node) {
            if (isRootElement(node.parent.parent)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "The root element can't have 'v-if' directives.",
                })
            }
            if (utils.hasDirective(node.parent, "else")) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-if' and 'v-else' directives can't exist on the same element. You may want 'v-else-if' directives.",
                })
            }
            if (utils.hasDirective(node.parent, "else-if")) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-if' and 'v-else-if' directives can't exist on the same element.",
                })
            }
            if (node.key.argument) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-if' directives require no argument.",
                })
            }
            if (node.key.modifiers.length > 0) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-if' directives require no modifier.",
                })
            }
            if (!utils.hasAttributeValue(node)) {
                context.report({
                    node,
                    loc: node.loc,
                    message: "'v-if' directives require that attribute value.",
                })
            }
        },
    })

    return {}
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    create,
    meta: {
        docs: {
            description: "disallow invalid v-if directives.",
            category: "Possible Errors",
            recommended: true,
        },
        fixable: false,
        schema: [],
    },
}