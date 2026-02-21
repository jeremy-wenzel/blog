---
layout: ../../layouts/PostLayout.astro
title: 'AlarmKit simulator bugs'
---

While testing some functionality with [AlarmKit](https://developer.apple.com/documentation/AlarmKit), I came across some interesting bugs, specifically in the simulator.

For context, I am not an iOS dev by trade, and I am just tinkering with iOS development for fun. I am using AlarmKit in a new app I am trying to build and testing things in the simulator. I specifically downloaded the [sample app](https://developer.apple.com/documentation/alarmkit/scheduling-an-alarm-with-alarmkit) from Apple to test out the features.

## AlertConfiguration `sound` property

With any alarm that needs to make a sound, you are obviously going to want to test out your own audio. So, I downloaded the YouTube video for Danger Zone by Kenny Loggins and did some rather annoying conversion to generate a `caf` file.

I confirmed that the audio file was part of the bundle by playing it with AVAudio as a quick sanity check to make sure the file was being put on the device correctly.

To be quite honest, the `sound` property in `AlertConfiguration` was not easy to find, and ChatGPT and Claude said they couldn't find anything. I began wondering if I needed to use AVAudio to play audio when the alarm triggered.

Anyway, after finding the `sound` property, I tried using my audio on the simulator. When the alarm came up, nothing would play. This was my code:

```swift
let alarmConfiguration = AlarmConfiguration(countdownDuration: userInput.countdownDuration,
                                            schedule: userInput.schedule,
                                            attributes: attributes,
                                            stopIntent: StopIntent(alarmID: id.uuidString),
                                            secondaryIntent: secondaryIntent(alarmID: id, userInput: userInput),
                                            sound: AlertConfiguration.AlertSound.named("danger_zone"))
```

If you're an iOS dev, you are probably slamming your hand into your face, sighing, and saying, "DUH! You're not using the file extension, you idiot!" But here is the thing... nothing was playing. No audio. Completely silent. Nada.

I was so confused. Was the audio not working in general? Was something wrong with my file? Did I not convert the audio properly? But that doesn't make sense; it just played using `AVAudio`.

I looked up various other system sounds and those didn't work. Why wasn't anything working?

So for giggles, I switched to a physical device. When the alarm came up, the `.default` played.

Ahh... so there is something up with the simulator and `.default`. When the system can't find the audio file, it defaults to the `.default` audio file. For some reason, the `.default` sound doesn't work on the simulator. I tried the `sound` property with `.default`, and again, the audio didn't play.

Once I figured out the file extension issue, the audio played on the simulator at alarm time.

**Conclusion:** The simulator doesn't work well with the `sound` property in AlertConfiguration.

## Alarm notification in the dynamic island

I also ran into some odd behavior around Dynamic Island presentation in the simulator.

In Apple's sample documentation, they note:

> "AlarmKit expects a widget extension if an app supports a countdown presentation. Otherwise, the system may unexpectedly dismiss alarms and fail to alert."

That line is important: **ActivityKit (Live Activity via widget extension) is required when you support countdown alarms**. For non-countdown alarms, AlarmKit should still be able to alert without a Live Activity.

So, I started working on using alarm functionality in my app without any kind of countdown timer. After I felt I had gotten to a place where I could test, I ran it on the simulator. However, when the app went into alarm, nothing appeared in the Dynamic Island. I added some logic to check the alarm state and to observe alarm state-change notifications from `AlarmManager`, all showing that the alarm was in the `alerting` state.

I felt there was something I was missing. So, for giggles, I removed the `LiveActivity` from the sample app and ensured only the alert was set up with no countdown.

```swift
let alarmConfiguration = AlarmConfiguration(schedule: userInput.schedule,
                                            attributes: attributes,
                                            stopIntent: StopIntent(alarmID: id.uuidString),
                                            secondaryIntent: secondaryIntent(alarmID: id, userInput: userInput),
                                            sound: AlertConfiguration.AlertSound.named("danger_zone"))
```

Again... nothing.

Here's the weird thing... adding it back fixed it. It showed up.

I almost began working on adding a `LiveActivity` to my app when I remembered the simulator issues. I tried my alert-only notification on my physical device, and it worked!

**Conclusion:** Dynamic Island alarm presentation appears to be unreliable in the simulator, while real-device behavior matches the documentation much better.

## Conclusion

I don't know much about iOS simulators or iOS development in general. But it seems like there is some AlarmKit functionality that simulators don't handle well. AlarmKit is still in beta, so it's possible that these issues get ironed out, but losing a few hours of development was kind of annoying.

