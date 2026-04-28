# Seedha Jawab — Design Spec

**Date:** 2026-04-28  
**Status:** Approved  
**Deploy target:** `https://instamarathi.github.io/seedha-jawab/`  
**Firebase project:** `carousel-2a740` (shared with books/carousels)

---

## Concept

A static Bollywood-duo advice column. Readers submit personal questions; famous Bollywood pairs discuss and answer in Hinglish (Hindi in Devanagari, English in Roman). All content is pre-rendered static HTML — no build step, no framework, no server.

---

## Architecture

- Pure static HTML + CSS + minimal JS
- Firebase Auth via CDN ES module imports (no bundler)
- `<base href="/seedha-jawab/">` in every page's `<head>` — resolves subdirectory path correctly on GitHub Pages
- One shared `firebase-auth.js` at root, loaded as `<script type="module">` on every page
- No Firestore writes — auth only

---

## File Structure

```
/
  index.html                          ← home: 20 pair cards + auth-aware random button
  style.css                           ← dark theme + gate overlay + auth button styles
  firebase-auth.js                    ← Firebase init, auth state, gate logic, random picker
  pairs/
    munna-circuit/
      index.html                      ← pair page: description + question list
      priya-pune/
        index.html                    ← OPEN question (first per pair, no gate)
    babu-raju/index.html
    jai-veeru/index.html
    gabbar-samba/index.html
    rancho-raju/index.html
    rancho-farhan/index.html
    amar-prem/index.html
    akash-sameer/index.html
    virus-chatur/index.html
    anand-bhaskar/index.html
    vijay-ravi/index.html
    teja-gogo/index.html
    chulbul-makkhi/index.html
    guddu-bablu/index.html
    pk-jaggu/index.html
    ishaan-nikumbh/index.html
    kabir-arjun/index.html
    mohan-geeta/index.html
    kanji-kanha/index.html
    piku-bhashkor/index.html
```

**Total files:** 1 CSS + 1 JS + 22 HTML = 24 files

---

## CSS Design System

```css
:root {
  --bg: #0f1115;
  --bg-elev: #161922;
  --bg-card: #181c27;
  --text: #e6e8ee;
  --text-dim: #9ba1b0;
  --text-soft: #c5cad6;
  --accent: #f0b070;
  --accent-2: #4a8dff;
  --border: #232734;
}
```

- Max width 820px, centered
- Question card: left border in `--accent`
- Conversation speakers: first speaker `--accent`, second `--accent-2`
- Answer section: `--bg-elev` background
- English summary: `--text-dim`, smaller font
- Mobile friendly

---

## Auth Model

**Gate logic:**
- First question per pair (`order=1`): `data-gated="false"` on `<body>` → always open
- Future questions: `data-gated="true"` → JS shows overlay if user is not signed in

**`firebase-auth.js` responsibilities:**
1. Initialize Firebase with `carousel-2a740` config
2. `onAuthStateChanged` → update nav sign-in/sign-out button on every page
3. `handleGate()` → check `document.body.dataset.gated` + auth state; show/hide `.gate-overlay`
4. `randomQuestion(isSignedIn)` → pick random URL from appropriate array

**Random button:**
- Carries two `data-*` attributes: `data-open-urls` (JSON array of 20 first-question URLs) and `data-all-urls` (JSON array of all question URLs)
- On click: reads auth state, picks from correct array, redirects

**Sign-in:** Google Sign-In with popup (same as books)

---

## Page Templates

### Home (`index.html`)
- Header with site title + sign-in/out button
- 20 pair cards in a responsive grid: pair name, film, specialty topic, link to pair page
- Random question button (auth-aware)
- Footer

### Pair page (`pairs/<slug>/index.html`)
- Breadcrumb: Home → Pair Name
- Pair description
- Question list (locked questions show 🔒)
- "पहला सवाल जल्द आएगा" for the 19 placeholder pairs

### Question page (`pairs/<slug>/<question>/index.html`)
- Breadcrumb: Home → Pair → Question
- **सवाल** section: reader's question in a card with `--accent` left border
- **Conversation** section: alternating speaker turns, names bold and colored
- **Answer** section: `--bg-elev` background, direct address to reader
- **English summary** section: `--text-dim`, small, labeled "Summary"
- Prev/Next question links + back to pair + random question button
- Gate overlay (if `data-gated="true"`): full-page overlay covers content, shows sign-in prompt

---

## The 20 Pairs

| Slug | Display Name | Film | Specialty |
|------|-------------|------|-----------|
| munna-circuit | Munna + Circuit | Munna Bhai MBBS | Feeling unseen, relationships, heart |
| babu-raju | Babu Bhaiya + Raju | Hera Pheri | Money panic, schemes, financial disasters |
| jai-veeru | Jai + Veeru | Sholay | Friendship drift, loyalty, trust broken |
| gabbar-samba | Gabbar + Samba | Sholay | Civic fury, injustice, systemic failures |
| rancho-raju | Rancho + Raju | 3 Idiots | Career anxiety, middle-class pressure |
| rancho-farhan | Rancho + Farhan | 3 Idiots | Passion buried under obligation |
| amar-prem | Amar + Prem | Andaz Apna Apna | Dating disasters, bumbling ambition |
| akash-sameer | Akash + Sameer | Dil Chahta Hai | Urban 30s, friendship growing apart |
| virus-chatur | Virus + Chatur | 3 Idiots | Corporate rat race, status anxiety |
| anand-bhaskar | Anand + Bhaskar | Anand | Grief, mortality, how to live fully |
| vijay-ravi | Vijay + Ravi | Deewar | Moral crossroads, family vs ambition |
| teja-gogo | Teja + Crime Master Gogo | Andaz Apna Apna | Petty problems taken dramatically seriously |
| chulbul-makkhi | Chulbul + Makkhi | Dabangg | Local justice, standing up, corruption |
| guddu-bablu | Guddu + Bablu | Mirzapur | Sibling rivalry, small-town ambition |
| pk-jaggu | PK + Jaggu | PK | Questioning customs, outsider logic |
| ishaan-nikumbh | Ishaan + Nikumbh | Taare Zameen Par | Parenting, children, school pressure |
| kabir-arjun | Kabir + Arjun | Zindagi Na Milegi Dobara | Men's emotions, regret, unlived life |
| mohan-geeta | Mohan + Geeta | Swades | Civic duty, NRI guilt, wanting to change things |
| kanji-kanha | Kanji + Kanha | OMG | Religion vs logic, blind faith, superstition |
| piku-bhashkor | Piku + Bhashkor | Piku | Aging parents, caregiving, intergenerational clash |

---

## Pair Descriptions

**munna-circuit** — Two big hearts, zero plans. Munna's the one who notices. Circuit's the one who does something about it — usually the wrong thing, but always for the right reason.

**babu-raju** — Neither of them has money. Neither of them has a plan. But between Babu Bhaiya's panic and Raju's superstitions, they've somehow never given up. Send them your financial disasters.

**jai-veeru** — Jai doesn't say much. Veeru doesn't stop talking. They've had each other's backs since before either of them remembers why. If your friendship is cracking at the seams, they've been there.

**gabbar-samba** — Gabbar has opinions about how the world should work, and Samba has never disagreed with a single one. They won't solve your problems, but they will validate your fury at a system that refuses to work.

**rancho-raju** — Rancho has never once done what was expected of him. Raju has never once done what he actually wanted. Together they're slowly figuring out that both extremes are wrong — but Rancho's usually more right.

**rancho-farhan** — Farhan had a dream at age six. He's still thinking about it at twenty-two while writing code he doesn't care about. Rancho has questions. So does Farhan. They're going to ask yours.

**amar-prem** — Amar has a plan. Prem also has a plan. Neither plan has ever worked. They've failed at everything in at least four different ways. They are, against all odds, exactly the right people to ask about ambition.

**akash-sameer** — Akash thinks love is overrated. Sameer disagrees — loudly, repeatedly, with his whole heart. They've been best friends since before either of them knew what they actually wanted from life. They still don't, entirely. But they're figuring it out.

**virus-chatur** — Virus believes pressure is the only path to excellence. Chatur believes winning is the only path to respect. Neither of them is happy. They will give you advice anyway.

**anand-bhaskar** — Anand has been given six months to live for longer than he can remember. He has no plans to waste them. Bhaskar started out clinical, a keeper of medical notes. He's learning. They'll answer your questions about time — and what to do with what's left of it.

**vijay-ravi** — Vijay chose one road. Ravi chose another. They were standing at the same crossroads. If you're looking at a fork and can't decide which way to walk, they've been there — and they'll tell you what each path costs.

**teja-gogo** — Teja has a plan for world domination and keeps getting interrupted. Gogo has declared himself the terror of the universe and no one is taking him seriously. They will treat your smallest problem like a matter of national importance. This is a feature, not a bug.

**chulbul-makkhi** — Chulbul Pandey has never once doubted himself. Makkhi has doubted himself enough for both of them. When something is deeply unfair and the system refuses to fix it, they'll listen — and probably do something about it that's technically illegal but morally correct.

**guddu-bablu** — Guddu is running on rage and loyalty. Bablu is running on calculation and caution. They grew up dreaming of something completely different from where they ended up. If your ambitions are outrunning your circumstances, they understand that feeling.

**pk-jaggu** — PK arrived on Earth without context and has been asking "but why" ever since. Jaggu has lived here her whole life and is starting to wonder if he has a point. Together they'll ask the question you've been afraid to ask out loud.

**ishaan-nikumbh** — Nikumbh saw something in Ishaan that no one else was looking for. Ishaan learned to trust that someone could see him. Between them they know what it means to be failed by a system — and what it means to be truly seen by one person.

**kabir-arjun** — Kabir keeps saying "after this deal." Arjun keeps saying "I don't know what I want." They went to Spain, jumped from planes, dove into the sea, and slowly became the people they'd been avoiding. Your regrets are safe with them.

**mohan-geeta** — Mohan had a good life abroad and gave it up for something he couldn't explain in a résumé. Geeta never left and never needed to explain why. If you're trying to do the right thing and don't know where to start, they've been there.

**kanji-kanha** — Kanji doesn't believe in miracles, rituals, or any of it. Kanha showed up anyway. Between a man who demands proof and a god who provides it in ways no one can explain, send them your questions about customs you can't quite believe in.

**piku-bhashkor** — Bhashkor is convinced he's dying and has been for fifteen years. Piku is convinced he's fine and has been right for fifteen years. Between her exhaustion and his demands, they've had every argument about duty, independence, and aging that you're probably also having.

---

## Starter Content: Priya, Pune

**Pair:** munna-circuit  
**Question slug:** priya-pune  
**Gated:** false (first question)

### सवाल — Priya, Pune

I've been married for 11 years. My husband is a good man — चिल्लाता नहीं, पीता नहीं, time पे घर आता है. But when his colleagues come over, he introduces me as "यह घर की manager है" and everyone laughs. Last Diwali his mother said "तुम्हारा तो कोई काम नहीं, घर में रहती हो." मैं मुस्कुरा दी. I always smile. मैं यह समझ नहीं पा रही — is it wrong to want someone to just notice that I am tired? Not fix it. बस... notice करें?

### Conversation

**Circuit:** "भाई, यह Priya ने लिखा है Pune से. कहती है उसका पति अच्छा आदमी है — चिल्लाता नहीं, पीता नहीं, time पे घर आता है."

**Munna:** "तो problem क्या है?"

**Circuit:** "वही तो मैं समझ नहीं पा रहा, भाई. सब कुछ ठीक है तो यह कौन सा clinic है हमारा?"

**Munna:** "आगे पढ़."

**Circuit:** "कहती है Diwali पे सास ने बोला 'तुम्हारा तो कोई काम नहीं, घर में रहती हो.' और वो मुस्कुरा दी."

**Munna:** "हम्म."

**Circuit:** "भाई, मुस्कुराना तो अच्छी बात है ना? मतलब वो happy थी."

**Munna:** "Circuit... कभी देखा है — जब कोई बहुत दर्द में होता है तो क्या करता है?"

**Circuit:** "रोता है, भाई."

**Munna:** "और जब बहुत बहुत ज़्यादा दर्द होता है?"

**Circuit:** "...चुप हो जाता है."

**Munna:** "वही. Priya चुप हो गई. और यह smile — यह एक practice है, यार. सालों की practice."

**Circuit:** "लेकिन भाई, उसने लिखा है fix मत करो, बस notice करो. तो हम क्या बोलें उसे?"

**Munna:** "हम उसे यह बोलते हैं — Priya, तू गलत नहीं है. थकान असली होती है, चाहे कोई देखे या नहीं. और जो काम दिखता नहीं, वो होता ज़रूर है — वरना सबको दिखने लगता है जब नहीं होता."

**Circuit:** "भाई... यह last वाला profound था."

**Munna:** "हाँ."

**Circuit:** "यह मैंने कहाँ से सीखा?"

**Munna:** "तूने नहीं कहा. मैंने कहा."

**Circuit:** "Oh. फिर भी, भाई — अच्छा था."

### Answer

**Munna:** Priya, सुन. घर की oxygen होती है तू. Oxygen को certificate नहीं मिलता, award नहीं मिलता, Diwali पे कोई speech नहीं देता उसके लिए. लेकिन एक दिन बिना oxygen के try करो — सबको पता चल जाता है.

तो एक काम कर. कल subah से कोई काम मत कर. बस एक दिन. देख कितनी बार "खाना कहाँ है" पूछा जाता है. देख कितनी बार कोई चीज़ मिलती नहीं जो रोज़ अपनी जगह होती है. वही तेरा standing ovation है — बस लोगों ने अभी तक clap करना नहीं सीखा.

Notice करना उन्हें सीखना पड़ेगा. लेकिन तू यह मत भूल — तू थकी है, यह सच है. और सच को किसी के notice करने की ज़रूरत नहीं होती सच रहने के लिए.

**Circuit:** "और भाई, अगर फिर भी कोई notice ना करे — तो हमें लिख. हम करते हैं notice."

### English Summary

Priya from Pune has been married for 11 years to a man who is, by all measures, decent — he doesn't shout, doesn't drink, comes home on time. But she is invisible. Her mother-in-law dismisses her work as nothing. She always smiles. She isn't asking to be fixed. She just wants someone to notice she is tired. Munna and Circuit talk it through, stumble toward the truth, and tell her: the work that goes unseen is the work everything else depends on. Stop doing it for one day. That silence will be louder than any award.

---

## Language Rules

- Hindi words and phrases → Devanagari script
- English words → Roman script
- Natural mixing within sentences
- No transliteration
- Meta tags, page titles, English summary → plain English only

---

## Deployment Notes

- `<base href="/seedha-jawab/">` in every page resolves GitHub Pages subdirectory paths
- `instamarathi.github.io` already an authorized Firebase domain (shared with books)
- Push directly to `instamarathi/therapy` repo → GitHub Pages serves from root
