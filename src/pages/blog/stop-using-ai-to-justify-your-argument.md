---
layout: ../../layouts/PostLayout.astro
title: 'Stop using AI to justify your argument'
---

> In a code review for a component.
> Me: "This doesn't look right. We should be doing this instead: blah"
> Coworker: "This is what copilot told me"
> dump copilot contents
> Me: What the hell?

How many of you has this happened to you? 

You asked a coworker why they did something in a particular way or ask them if they are sure something is correct, then they take your question, dump it into some AI integration, then give you the results.

My dude, I could have done that. Now, I have to parse though this AI slop dump to see if it is correct.

I also kind of feel like I am getting tag-teamed. I have to prove why the AI is incorrect.

## The age of AI justification

There is no doubt that AI is transforming everything about Software Engineering. That means AI is also becoming part of the code review process.

There is are numerous benefits to this. AI can catch bugs we didn't see, improve our code by finding optimizations and removing redundancies, facilitate our understanding of the components we are reviewing by breaking down complexity.

However, I am seeing more and more that team members are using AI dumps as justification for their arguments.

## "Copilot said this"

In the past week, I have seen this on multiple occasions on different pull requests. One of my fellow reviewers asked a fair question about why the author chose to do something in an `.idl` file. The author responds with: "This is what copilot says" and proceeds to dump the contents of copilot's response to some unknown prompt.

My fellow reviewer proceeded to pull apart the author's response, explaining why copilot was wrong. The reviewer has been at Microsoft since 2008, working on multiple sevices in Windows and shipping code in multiple versions of Windows, back to Windows 7. He has shipped many public APIs. This guy knows what he is talking about.

He showed various documentation as why copilot was wrong, and proceded to tell the author the way it should be. But he also added, "Don't just dump copilot's response without reading the response and giving it some thought". Rather blunt

Honestly, it was necessary. But why?

## 

I can only speak from my experience but there are a couple aspects to why it's so 

1. It feels like you are getting ganged up by someone you can't talk to or really rebute without having to do some thorough research.
2. It feels lazy from a reviewer's perspective and a cop out to just use copilot as justification, like it is some single-source of truth.

When a coworker uses copilot for their arugment and just dumps the contents of the response, there is no way to talk to the AI because you're not the one who write the prompt nor the author to process the response.. And it almost feels like you can't confront the person who wrote it because it wasn't their idea. So who do you talk to?

Obviously, yes, the author is reponsible for the response. But it seems as AI is progressing and getting involved in the different aspects of software engineering, these kind of responses are going to become more prevelant unless what 

## Cognaitive overload

At the end of the day, AI response dumps just puts more coginative load on the reviewer to ensure that everything is correct rather than have the developer actually think through the problem and have a reason for the change. 

If any junior dev responded to why they did something with "I don't know, I just found it google" the dev would be ripped apart, and for good reason. It means that the dev doesn't understand why the change works.

The neglegience can lead to:
* Bugs
* Security vulnerabilities
* Tech debt

It feels dispresctful to the reviewer, who is taking the tiem from other high priority work to review this PR, who now has respond to this lenthy dump and back it up with facts. A senior dev's time is valuable. Who wants to pour over documentation to figure out why this change is 

Additionally, a reviewer could feel more disrespected because there was no thought put into the response. It's just feels like laziness.

## How can we make code reviews better

1. If you are a reviewer, use AI to help understand a component. There is no shame in trying to understand what the code is doing by having explain it for you.
2. If you are the author, AI dumps do not belong in responses. Every change you make has a reason to it. Even if AI wrote the code, the responsibility is on you to justify why the change belongs there. You should be able to argue your reason rather than having AI do it for you
3. Take what the AI tells you but confirm with an expert. I work with guys who are experts in the Wi-Fi field. Sometimes I will tell them, "Hey I am having trouble understanding "X". Copilot told me "Y". Is that true or am I misunderstanding something. This will take you much further in helpng you learn a technology.

## AI can help in code reviews

AI can really help out the code review process. I have used AI to:

* Understand what a secont of code is doing, come up with a comment for the reviewer if it rather complex, but only when I understood that the comment and the code makes sense. AI is really good for 
* Find potential bugs through unforseen execution paths
* Figure out how this change works in the larger code base by breaking down the component so that I can quickly ramp up on it.

## How can we use AI to help



I will continue to use AI in my workflow as it helps me review more code and come up to speed quickly.

The first step to fixing this issue is to sotp using AI  to justify your position.