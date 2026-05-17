---
layout: ../../layouts/PostLayout.astro
title: '"Copilot Said So" Is Not an Answer'
date: "Apr 6, 2026"
---

> In a code review for a component.
> Me: "This doesn't look right. We should be doing this instead: blah"
> Coworker: "This is what copilot told me"
> dump copilot contents
> Me: What the hell?

Has this happened to you?

You asked a coworker why they did something in a particular way or ask them if they are sure something is correct, then they take your question, dump it into some AI tool, then give you the results.

My dude, I could have done that. Now, I have to parse though this AI dump to see if it is correct.

I feel like I am getting tag-teamed. I have to prove why the AI is incorrect.

I am now annoyed.

## The age of AI justification

There is no doubt that AI is transforming everything about Software Engineering. That means AI is also becoming part of the code review process.

There is are numerous benefits to this: AI can catch bugs we didn't see, improve our code by finding optimizations and removing redundancies, facilitate our understanding of the components we are reviewing by breaking down complexity.

However, I am seeing more and more that team members are using AI dumps as justification for their arguments.

## "Copilot said this"

Recently, I have seen this on multiple occasions on different pull requests. One of my fellow reviewers asked a fair question about why the author chose to do something in an `.idl` file. The author responds with: "This is what copilot says" and proceeds to dump the contents of copilot's response from some unknown prompt.

The reviewer proceeded to pull apart the author's response, explaining why copilot was wrong. The reviewer has been at Microsoft since at least 2008, working on multiple Windows services and shipping code in multiple versions of Windows, back to Windows 7. He has shipped many public APIs. This guy knows what he is talking about.

He showed various documentation as why copilot was wrong, and proceeded to tell the author the way it should be. He also added, "Don't just dump copilot's response without reading the it and giving it some thought". Rather blunt.

Honestly, I felt it was necessary. But why?

## Laziness & Disrespect

I can only speak from my experience but the knee-jerk reaction is this AI prompt dump feels incredibly lazy and disrespectful.

First off, the author should know how the code works or why they chose to do something the way they did. That is the expectation when going into a code review. But when the author just lets AI answer my question, the author either didn't want to respond to my question or didn't know the answer.

Maybe they are trying to be efficient with their time by having AI answer the question if it is obvious to them. But the reviewer is asking me to spend my time reviewing and approving their PR. At a human level, if you are asking me, a person, to review your PR and approve it, the very least is to have you answer my question in your own words. My time is also valuable and I could be working on other things that could be bringing high impact as well. Please respect my time by conversing with me about your proposed changes rather than having a computer do it for you.

Now, if you as the author don't know why you did something in a particular way and can't explain it to reviewer, dumping AI contents in the response is just plain lazy, regardless if AI was correct. It's on the same level as taking something from StackOverflow and not knowing why it works. From my perspective, it means you don't care enough to know why your code works, especially code that you are willing to be held responsible. Billions of users could be using this code. Understanding it is critical. You need to be able to validate the response because AI can make mistakes, as in the example with my coworker. AI can't be used as a justification cop-out, like it is some single-source of truth. AI is non-deterministic and there should be a reason for your change. Trust, but verify.

## Cognitive overload

At the end of the day, AI response dumps puts more cognitive load on the reviewer to ensure that everything is correct rather than have the developer actually think through the problem and have a reason for the change.

The response could be correct or not. Just like any other review, we do have to make sure that the change is correct. But AI can output such convincing arguments that it takes a bit of energy to figure out a response. And just because the copilot might be technically correct, it might not be correct for business or internal reasons.

Now we have to take apart what the AI said and we need to properly show sources as why the AI is wrong or give justification for why is wrong. The burden of thinking has been put on the reviewer. A big PR can burnout a reviewer because they are the ones that are having to think.

If any junior dev responded to why they did something with "I don't know, I just found it google" the dev would be ripped apart, and for good reason. It means that the junior dev doesn't understand why the change works.

The negligence can lead to:
* Bugs
* Security vulnerabilities
* Tech debt

## Making code reviews better (enhanced with AI)

AI can really help out the code review process. I have used AI to:

* Understand what a section of code is doing, come up with a comment for the reviewer if it rather complex, but only when I understood that the comment and makes sense in the context
* Find potential bugs through unforeseen execution paths
* Figure out how this change works in the larger code base by having AI breaking down the component overall so that I can quickly ramp up on it.

When using AI to help me out, I take what it is saying and try to confirm it. Is that bug really an issue, or is it a condition that was taken into account by previous developers? Is that section of code really executing in the way the AI says? There have been multiple times where the GitHub Copilot told me a race condition existed when really there wasn't, and I told it as such and it said "Oh I see! You're right!"

When using AI in code reviews, I think it is important that we set up some ground rules.

1. If you are a reviewer, use AI to help understand a component. There is no shame in trying to understand what the code is doing by having explain it for you.
2. If you are the author, AI dumps do not belong in responses. Every change you make has a reason to it. Even if AI wrote the code, the responsibility is on you to justify why the change belongs there. You should be able to argue your reason rather than having AI do it for you
3. Take what the AI tells you but confirm with an expert. I work with guys who are experts in the Wi-Fi field and I am by no means an expert compared to them and AI can be incredibly wrong in some instances. Sometimes I will tell them, "Hey I am having trouble understanding 'X'. Copilot told me 'Y'. Is that true or am I misunderstanding something?" This will take you much further in helping you learn a technology.

## Looking forward

I hope it is clear I am not an AI skeptic. I was probably a little slow on the uptick, but as tools have improved, I have seen a lot of benefit to my workflow. But one of the things I have enjoyed about coding is learning from other people and talking with them about their stuff. It's how I have learned so much in my life! I just don't want to argue with a computer.