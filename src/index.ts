import { parser as myLanguageParser } from "./syntax.grammar";
import {
	LRLanguage,
	LanguageSupport,
	indentNodeProp,
	foldNodeProp,
	foldInside,
	delimitedIndent,
	continuedIndent,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import {
	completeFromList,
	ifNotIn,
	snippetCompletion as snip,
	Completion,
} from "@codemirror/autocomplete";

export const parser = myLanguageParser;

export const myLanguageLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			indentNodeProp.add({
				Parenthesized: delimitedIndent({ closing: ")" }),
				Table: delimitedIndent({ closing: "}" })
				/*
AttrSet: delimitedIndent({ closing: "}" }),
List: delimitedIndent({ closing: "]" }),
Let: continuedIndent({ except: /^\s*in\b/ }),
				*/
			}),
			foldNodeProp.add({
				// fold information cango here
				/*
AttrSet: foldInside,
List: foldInside,
Let(node) {
	let first = node.getChild("let"),
	last = node.getChild("in");
	if (!first || !last) return null;
	return { from: first.to, to: last.from };
},
				*/
			}),
			styleTags({
				"Keyword ContextualKeyword SimpleType": t.keyword,
				"NullLiteral BooleanLiteral": t.bool,
				IntegerLiteral: t.integer,
				RealLiteral: t.float,
				'StringLiteral CharacterLiteral InterpolatedRegularString InterpolatedVerbatimString $" @$" $@"': t.string,
				"LineComment BlockComment": t.comment,

				". .. : Astrisk Slash % + - ++ -- Not ~ << & | ^ && || < > <= >= == NotEq = += -= *= SlashEq %= &= |= ^= ? ?? ??= =>": t.operator,

				PP_Directive: t.keyword,

				TypeIdentifier: t.typeName,
				"ArgumentName AttrsNamedArg": t.variableName,
				ConstName: t.constant(t.variableName),

				//Ident: t.name,
				MethodName: t.function(t.variableName),
				ParamName: [t.emphasis, t.variableName],
				VarName: t.variableName,
				"FieldName PropertyName": t.propertyName,
			}),
		],
	}),
	languageData: {
		commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
		closeBrackets: { brackets: ["(", "[", "{", '"', "'"] },
		indentOnInput: /^\s*(\)|\]\]?|\}|else|else\s+if|catch|finally)$/,
	},
});

export function myLanguage() {
	return new LanguageSupport(
		myLanguageLanguage,
		// optionally add completions/snippets or other features
	);
}
