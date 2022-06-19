# boj-description-converter

[solved-ac.github.io/boj-description-converter](https://solved-ac.github.io/boj-description-converter/)

Convert [UCPC](https://github.com/ucpcc/ucpc2020-description-layout)-flavored [olymp.sty](https://github.com/GassaFM/olymp.sty) based TeX problem statements to HTML, complying with [BOJ Stack](https://stack.acmicpc.net/guide/problem) and [UCPC](https://github.com/ucpcc/problemsetting-guidelines) formatting guidelines.

## Why?

For contests on BOJ with printed problemset, it is often challenging to:
* Keep TeX and HTML descriptions synced - especially when multiple problemsetters are working on multiple problems
* Convert one format to another - although BOJ supports MathJax, it is such a tedious and easily mistakable job to translate TeX markups to HTML. Few examples include:
  * `\alpha` &rarr; `&alpha;` (greek letter 'alpha')
  * ``` `` ... '' ``` &rarr; `&ldquo; ... &rdquo;` (double quotes)
  * `\textit{...}` &rarr; `<em>...</em>` (italic text)
  * `\textbf{...}` &rarr; `<strong>...</strong>` (bold text)
  * `\begin{center}...\end{center}` &rarr; `<p style="text-align:center;"><code>...</code></span>` (centered text)
  * `\t{...}` &rarr; `<span style="color:#e74c3c;"><code>...</code></span>` (colored verbatim)
  * `\begin{itemize} \item ... \end{itemize}` &rarr; `<ul> <li>...</li> </ul>` (unordered list)

This project aims to eliminate manual converting work by problemsetters, and make problemsetters to just focus on setting great problems.

## Usage

1. Copy-paste [olymp.sty](https://github.com/GassaFM/olymp.sty) based TeX problem statement into the left input area.
1. Preview the render output and fix the statement if needed.
1. Copy-paste generated HTML to BOJ Stack.

### 'I hate MathJax' Mode

This tool offers the ability to try rendering the equations in pure HTML while avoiding MathJax as much as possible. Currently supports the following:

* Superscripts and subscripts
* Most of the TeX math symbol rendering commands, i. e. `\le`, `\delta`, `\rightarrow`
* Italic texts on variables
* Spacing around operators and functions like `ln` or `sin`
* Fractions
* `\sum`

## Contributing

Contributions are welcome!

## TODO

* Cleanup code
* `tabular` environment
* Converting `\color` names to hex string
* 
