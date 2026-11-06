# Faces on notifications: the owner's steps

Montage rule 1175, option A. A push from a person (a chat or group message, a movie night or group
invite, a follow, a reply, a mention, a friend's watch, a Blend invite, and the new Watched with tag
push) keeps the Montage icon on the left and shows their face as a small rounded-square thumbnail on
the right: their photo, or their initial on their colour. Pushes stack by conversation (a chat, a
group, a movie night). The words are as today. The server side is live once main deploys; the iPhone
side needs a new build.

No Communication Notifications capability is needed (that is the circular face we decided against).

## Before the next TestFlight build

1. **Regenerate the project:** `cd ios/Montage && xcodegen generate && open Montage.xcodeproj`.
   There is a new target, `MontageNotificationService` (bundle id
   `app.montagefilm.Montage.NotificationService`, team 5WKL8B8NML, build 21, iOS 17), embedded in the app.
2. **Its App ID and profile:** in Xcode, target `MontageNotificationService`, Signing & Capabilities,
   keep **Automatically manage signing** on with the same team. Xcode registers the App ID and makes its
   development and App Store profiles itself. It needs no capabilities. Only if you sign manually:
   in the Apple Developer portal, Identifiers, add an App ID with that bundle id (no capabilities),
   then a development and an App Store provisioning profile for it.
3. **Build number:** raise `CURRENT_PROJECT_VERSION` in all four targets together (rule 863 checks
   they match), then archive and upload as usual.

## Check it on a phone

4. With the new build installed and signed in, have another account send you a chat message with
   your phone locked: the Montage icon on the left, their face as the thumbnail on the right. Try a
   friend with no photo (their initial on their colour), a group message, a follow, a movie night
   invite and a Watched with tag ("Emma watched Past Lives with you").
5. Send two messages in one chat: they should stack (newest on top), not replace each other.

Builds from before this one ignore the new fields; their notifications look as they do today, except
that group and chat messages now stack instead of updating one notification in place.

## Not verified here

- Swift was not compiled (no Xcode in the session). Every line was read by hand.
- How the thumbnail's clear corners look against the notification's glass (they should read as a
  rounded square) is only visible on a device.
- The Watched with push is capped like any new kind (at most 3 pushes a day and none 10pm to 8am,
  rule 581). Say if it should be always delivered like a mention.
