@{%
  const appendItem = (a, b) => d => d[a].concat([d[b]]);
%}

subroutines ->
    subroutines __ subroutineOperator __ subroutine {% d => d[0].concat([d[2], d[4]]) %}
  | subroutine

subroutine ->
    subroutineName __ parameters {% d => ({subroutine: d[0], values: d[2]}) %}
  | subroutineName {% d => ({subroutine: d[0], values: []}) %}

subroutineName ->
  [a-zA-Z0-9\-_]:+ {% d => d[0].join('') %}

parameters ->
    parameters __ parameter {% appendItem(0, 2) %}
  | parameter

parameter ->
    unquotedstring {% id %}
  | sqstring {% id %}
  | dqstring {% id %}

unquotedstring ->
  [^|"' ]:+ {% d => d[0].join('') %}

dqstring ->
  "\"" dstrchar:* "\"" {% d => d[1].join('') %}

dstrchar ->
    [^"] {% id %}
  | "\\\"" {% d => '"' %}

sqstring ->
  "'" sstrchar:* "'" {% d => d[1].join('') %}

sstrchar ->
    [^'] {% id %}
  | "\\'" {% d => '\'' %}

_ ->
  [ ]:* {% d => null %}

__ ->
  [ ]:+ {% d => null %}

subroutineOperator ->
    ">|" {% d => ({operator: 'AGGREGATE_PIPELINE'}) %}
  | "|" {% d => ({operator: 'PIPELINE'}) %}
