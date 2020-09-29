### This repo
This repo contains the `www` folder of your ionic project. I made no changes outside the www folder. Please copy the contents of this folder to the `www` directory inside your ionic project. 

### Changes I made

This is a list of changes I made with respect to the original files you gave me.    
**Each change corresponds to a git commit.**

#### Made the proof-of-concept that I showed you.
- Added the tinder library, and modified index.html, app.js and style.css files to integrate the library. I added a new method getNewQuestion which should be obvious.
- The quote, etc. are now inside the `<td-cards><td-card> </td-card></tdcards>` tag
- The POC had some problems, bugs, etc. that needed to be fixed, and were fixed in the following commits. 

#### Fixed the HTML formatting and tags. 
- Somehow the HTML was completely messed up - a lot of tags did not close, etc. and the messed up formatting made things difficult to understand. This was also causing some strange cross-platform issues.
- Changes in formatting can occasionally lead to unexpected formatting changes - like the addition or removal of a space somewhere. I couldn't see this anywhere, but please have a look.

#### Fix formatting issue - the true/false result is sometimes not centered

#### Fix the bug - next card doesn't show after making a guess
- The tinder cards library expects us to provide a number of `td-card` elements that it can cycle through
- We have only one `td-card`, and we update the contents of that `td-card` with the new statement every time the user makes a guess
- I think it's better to have a single card, and just replace the contents of that card every time the user submits a guess. This is also kind of the way you were doing it so far.
- Created the method resurrect card to bring the card back after it goes out of the screen. There are issues though. I need to take a deep dive into the library and see how it functions. *edit* - these issues are now resolved.

#### Fix a formatting bug in the quote byline 

#### Fix the issue with slow-motion swipes
- On swiping slowly, the card would get destroyed but the swipe event would not get registered. 
- Turns out there are transition events that works for this case. Using them instead of the swipe event fixed the issue.

#### Fix animation lag
- The animation starts lagging after the first swipe. 
- Fixed by changing transition style.

#### Prevent flash of angular text 
- This one was the easiest. Added `ng-cloak` class to the body as you suggested.

#### fix issue - clicking on the bottom part of the screen does not dismiss the guess results dialogue.
- The guess results dialogue says click or swipe everywhere to dismiss the dialogue and show next question. But it's height is set to 80vh. This does not cover the bottom-most area under the social icons. I set up a small directive `resize-max` to resize the element to the size available in window on load. Now, users can click anywhere including the bottom-most area to dismiss that dialogue.

### Testing
I tested this on an iPhone and Android (latest versions of OS in both). 
One feedback would be that the margin-top on the quote can be reduced a bit. It seems to be too much for larger statements where you have to scroll down to read the quote, even though there's this untilized free space on the top.