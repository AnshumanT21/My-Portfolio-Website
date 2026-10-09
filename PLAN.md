# Portfolio v2: plan

Separate project. Nothing in `my-portfolio2` is touched.

## Design read

A developer portfolio for recruiters and collaborators, built as a playful, toy-like page where things react to you. The stack is Vite, React, Tailwind v4, Motion and matter-js.

- Dials: DESIGN_VARIANCE 8, MOTION_INTENSITY 9, VISUAL_DENSITY 3
- Palette: "Forest". A deep green-black night theme and a bone-paper day theme, with one accent (signal orange `#ff6a2b`). No purple, no glow gradients.
- Type: Bricolage Grotesque (display and body) plus JetBrains Mono (small labels). Both self-hosted with @fontsource.
- Shape: cards and photos use a 14px radius. Buttons are full pills.
- Icons: Phosphor only.
- Theme: follows the system setting, and a pull-string lamp in the nav switches it.

## Page structure (each section uses a different layout)

1. **Nav**: an "AT" mark, four links and the lamp pull-string. Drag the string down to switch day and night.
2. **Hero (motion design)**
   - A dot field on a canvas that bends away from the cursor.
   - A kinetic name: each letter springs away from the cursor, and clicking a letter makes it hop.
   - Your photo as a tilting, draggable polaroid, with draggable stickers around it (UMass, CompE '28, F1, a 3D-printer nozzle).
   - One short line of subtext and two CTAs: "See my work" and "Say hello".
3. **Skills strip**: the one marquee on the page. Its speed and direction follow how fast you scroll.
4. **My projects stage**
   - "My projects" is a matter-js physics world. Hovering the title knocks the letters off their perch. They fall, bounce and pile up, and you can throw them.
   - **Sprout**, the sapling, walks along the floor. When the letters fall, Sprout jumps, shakes, covers its eyes and squeaks. If a thrown letter hits Sprout, it falls over.
   - Click Sprout to make it wave. Every click also grows a leaf, and at 10 clicks it blooms and dances.
   - A "Put it back" button rebuilds the title.
5. **Projects**: an asymmetric grid with ClaimIQ featured large because it's live in production. Cards tilt toward the cursor and open into a morphing modal (Motion `layoutId`) that shows the challenge, results and stack.
6. **Experience**: a sticky heading on the left and a line on the right that draws itself as you scroll past the entries.
7. **Off the clock (hobbies)**: polaroids scattered on a desk. You can drag them, and the one you pick up comes to the top. Each has a small reaction: the camera flashes, the F1 card revs, the football card juggles.
8. **Contact**: "Say hello" in large type, a magnetic "copy email" button with spring feedback, and GitHub and LinkedIn links.
9. **Footer**: a football you can keep up by clicking it. Your best keepie-uppie streak is saved in your browser.

## Easter eggs (with a "secrets found x/7" tracker that appears after the first one)

1. Pull the lamp string to switch day and night. At night, fireflies drift and Sprout's eyes glow.
2. Click the hero name 7 times: the letters explode and reassemble.
3. Make the "My projects" title fall (Sprout gets scared).
4. Click Sprout 10 times: it blooms and dances.
5. Type the Konami code (up up down down left right left right b a): an F1 car speeds across the screen with a lap time.
6. Type "sprout" anywhere: Sprout pops up in a corner and waves.
7. Reach a 10-touch keepie-uppie streak in the footer.

There's also a note in the browser console for developers who inspect the page.

## Guardrails

- With `prefers-reduced-motion` turned on, the physics, dot field, marquee and walking stop, and content stays readable.
- Only `transform` and `opacity` are animated. Pointer-driven values go through motion values, not React state.
- Matter.js and canvas loops stop when they're off-screen, and every effect is cleaned up on unmount.
- No em-dashes, scroll cues, fake metrics or filler copy. All text comes from your real content.
- The layout collapses to one column below 768px. On touch devices, Sprout and the title still work by tapping.
