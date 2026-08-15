---
title: Why A Terminal Blog?
date: 2026-05-22
category: design
tags: [terminal, interface, writing]
---

# Why A Terminal Blog?

Most blogs ask you to scroll. Herf asks you to explore.

That small difference changes the relationship between the reader and the
content. A post is no longer just a page on a list. It is a file in a small,
discoverable filesystem, and the reader gets a handful of familiar tools for
moving through it.

## Familiar Commands, New Context

The shell model works because the commands already carry meaning:

```bash
ls                 # what is available?
cd notes           # where do I want to go?
cat hello-world    # what does this say?
grep performance   # where is that idea mentioned?
```

There is no tutorial wall between the reader and the content. A person who has
used a terminal can start immediately, while a newcomer can type `help` and
learn one command at a time.

## A Different Kind Of Navigation

Traditional navigation is explicit: click a link, open a page, go back. A
terminal is more conversational. The reader can ask for a list, search for a
word, inspect the current location, or sort posts by date.

That makes browsing feel closer to looking through a project than visiting a
catalog. It also gives small posts a useful home. A short note does not need a
large card or a complicated category page; it can simply exist in the same
space as everything else.

## Why The CRT Aesthetic?

The green text, scanlines, and flicker are not meant to imitate a real shell
perfectly. They establish a mood: focused, local, and a little playful.

Good visual effects should support the content rather than compete with it.
That is why the interface keeps the layout restrained. The terminal frame is
always present, but the Markdown reader gets room to breathe when a post opens.

## The Useful Constraint

The terminal interface imposes a productive constraint: every feature should
have a clear command or a clear visual purpose. There is no infinite toolbar.

For example, the core loop is enough for most visits:

1. Run `ls` to see what exists.
2. Run `cat <post>` to read something.
3. Run `grep <word>` when you remember an idea but not its title.
4. Run `help` when you want to discover something new.

The constraint makes the product easier to understand and easier to extend.
New commands can be added without redesigning the entire page.

## A Blog That Feels Like A Workshop

Herf is intentionally closer to a personal workspace than a publication
platform. Markdown files stay in the repository. The generated index is
derived data. The final site is static and easy to host.

That means the author can focus on writing, version the entire site with Git,
and still give readers an interface with personality.

The best terminal is the one that gets out of your way. Herf is an attempt to
make a blog feel like that.
