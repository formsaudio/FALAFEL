# FALAFEL (Form Audio Language around Front End Logic)

## Goal

Something like HTML with minimal logic as a frontend for audio applications which is simple enough so that it can self encapsulate.

## Verbs

**Title** - Say and save as (check if acceptable)

**Launch** - Launch a new form by title

**Say** - Say something and no-op to the next instruction

  **Result** - Say the result of a verb, result escapes itself (to say &quot;result&quot; the code is &quot;say result result&quot;) - this works for if and say

**Ask** - Say something and add the response

**Repeat** - Repeat the last thing saved

**Confirm** - Repeat everything saved

**Time** - save the date and time

**Send** - give whole saved info not expecting a response

**Lookup** - Look up something from an api

**Request** - give whole saved and get response

-- **as** - save the request as something, only used with request and Lookup

**If** - say for yes or no, else an api and if it returns truthy, applies only to next action

**Repeat** - go to the (From) with the same id

-- **From** - Position to repeat from with the same id

## Specifics

Ask, Lookup, Time, and Request save to the form response object. Each is saved as its question, appended with a repeat number if applicable.

Say can be

## Examples

N.B. Punctuation is just to diagram, these words would be said in order

_Example: Patient Intake_

Title(&quot;Patient Intake Form&quot;)

Ask(&quot;Patient ID&quot;)

Repeat

Ask(&quot;Height&quot;)

Ask(&quot;Weight&quot;)

Ask(&quot;Condition&quot;)

Ask(&quot;Recommendation&quot;)

Time

Send(root)

_Example: Lunch Recommender_

Title(&quot;Lunch Recommendation System&quot;)

Ask(&quot;location&quot;)

Ask(&quot;Type of Restaurant&quot;)

Time

From(1)

Lookup(random)

Say (&quot;how about&quot;)

Say ( Result (Request(yelpapi))) // passes everything said so far to a yelp api handler which picks a restaurant from the random number

Say(&quot;Try another?&quot;)

IF(say)

Repeat(1)
