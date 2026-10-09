// Sprout: a little tree creature in the style of Baby Groot. Poses are driven by
// `mood` (idle, walk, scared, wave, fallen, dance) through CSS in sprout.css.
import './sprout.css'

const WOOD = '#d4a876'
const WOOD_D = '#a8774b'
const LINE = '#33200f'

// Where extra leaves sprout as Sprout gets attention: along the mossy crown first, then the shoulders.
const EXTRA_LEAVES = [
  { x: 31, y: 10, r: -35 },
  { x: 69, y: 10, r: 35 },
  { x: 44, y: 4, r: -12 },
  { x: 57, y: 3, r: 14 },
  { x: 26, y: 26, r: -70 },
  { x: 74, y: 26, r: 70 },
  { x: 36, y: 70, r: -60 },
  { x: 64, y: 70, r: 60 },
  { x: 50, y: 0, r: 0 },
]

function Leaf({ x, y, r }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <g className="sprout-pop">
        <path d="M0 0 Q-6.5 -8 0 -15 Q6.5 -8 0 0 Z" fill="var(--leaf)" stroke={LINE} strokeWidth="1.2" />
        <path d="M0 -1 V -12" stroke={LINE} strokeOpacity="0.5" strokeWidth="0.8" />
      </g>
    </g>
  )
}

// A limb drawn as a dark outline stroke with wood on top, so it reads like the cartoon.
function Limb({ d, w = 5 }) {
  return (
    <>
      <path d={d} stroke={LINE} strokeWidth={w + 2.6} fill="none" strokeLinecap="round" />
      <path d={d} stroke={WOOD} strokeWidth={w} fill="none" strokeLinecap="round" />
    </>
  )
}

export default function Sprout({ mood = 'idle', facing = 1, leaves = 0, bloom = false, size = 96, className = '' }) {
  const scared = mood === 'scared'
  const fallen = mood === 'fallen'
  return (
    <svg
      viewBox="0 0 100 130"
      width={size}
      height={size * 1.3}
      className={`sprout ${className}`}
      data-mood={mood}
      style={{ transform: `scaleX(${facing})` }}
      aria-hidden="true"
    >
      <g className="sprout-body">
        {/* legs */}
        <g className="leg leg-l">
          <Limb d="M43 104 L 41 122" w={7} />
          <path d="M36 124 Q 41 120 46 124" stroke={LINE} strokeWidth="2" fill={WOOD} />
        </g>
        <g className="leg leg-r">
          <Limb d="M57 104 L 59 122" w={7} />
          <path d="M54 124 Q 59 120 64 124" stroke={LINE} strokeWidth="2" fill={WOOD} />
        </g>

        {/* torso: woven bark */}
        <path d="M41 67 C 37 80, 37 95, 41 107 L 59 107 C 63 95, 63 80, 59 67 Z" fill={WOOD} stroke={LINE} strokeWidth="2.2" strokeLinejoin="round" />
        <g stroke={WOOD_D} strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M43 75 Q 50 80 57 75" />
          <path d="M42 85 Q 50 90 58 85" />
          <path d="M43 95 Q 50 100 57 95" />
          <path d="M50 69 Q 48 88 50 105" />
        </g>
        {/* shoulder twigs */}
        <path d="M41 70 Q 35 66 33 60" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M59 70 Q 66 67 67 61" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M33 60 Q 27 58 29 53 Q 35 54 33 60 Z" fill="var(--leaf)" stroke={LINE} strokeWidth="1" />

        {/* arms: long and thin, the way Groot's hang */}
        <g className="arm arm-l">
          <Limb d="M39 75 Q 30 88 28 103" w={4.5} />
          <path d="M28 103 l -4 4 M28 103 l -1 6 M28 103 l 3 5" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="arm arm-r">
          <Limb d="M61 75 Q 70 88 72 103" w={4.5} />
          <path d="M72 103 l 4 4 M72 103 l 1 6 M72 103 l -3 5" stroke={LINE} strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* head: tall bark head with a jagged, mossy crown */}
        <g className="head">
          <path
            d="M41 69 C 31 66, 26 54, 26.5 40 L 27 19 L 31 8 L 35.5 16 L 39.5 4 L 44.5 14 L 49.5 1.5 L 54.5 13 L 59.5 4.5 L 63.5 15 L 68.5 7 L 73 19 L 73.5 40 C 74 54, 69 66, 59 69 Z"
            fill={WOOD}
            stroke={LINE}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* moss on the crown */}
          <path
            d="M27.6 21 L 31 9.5 L 35.5 17 L 39.5 5.5 L 44.5 15 L 49.5 3 L 54.5 14 L 59.5 6 L 63.5 16 L 68.5 8.5 L 72.4 21 Q 66 26.5 58.5 22 Q 50 28 41.5 22 Q 34 27 27.6 21 Z"
            fill="var(--leaf)"
          />
          <path d="M31 19 q 2 3 5 1 M45 21 q 3 3 6 0 M61 20 q 2 3 5 0" stroke="var(--leaf-d)" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* bark grain */}
          <g stroke={WOOD_D} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M34 26 Q 32 33 34 38" />
            <path d="M50 26 Q 52 31 50 36" />
            <path d="M66 26 Q 68 33 66 38" />
            <path d="M31 50 Q 30 56 33 61" />
            <path d="M69 50 Q 70 56 67 61" />
          </g>
          {/* brow ridges */}
          <path d="M32.5 39.5 Q 40 34.5 46.5 39" stroke={LINE} strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M53.5 39 Q 60 34.5 67.5 39.5" stroke={LINE} strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {EXTRA_LEAVES.slice(0, leaves).map((l, i) => (
            <Leaf key={i} {...l} />
          ))}

          {bloom && (
            <g transform="translate(29 19)" className="sprout-pop">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="0" cy="-5.5" rx="3.6" ry="5.6" fill="#f7f4ea" stroke={LINE} strokeWidth="0.8" transform={`rotate(${a})`} />
              ))}
              <circle r="3" fill="#ffc93c" stroke={LINE} strokeWidth="0.8" />
            </g>
          )}

          {/* face */}
          {fallen ? (
            <g stroke={LINE} strokeWidth="2.6" strokeLinecap="round">
              <path d="M35 43 l 9 9 M44 43 l -9 9 M56 43 l 9 9 M65 43 l -9 9" />
            </g>
          ) : scared ? (
            <g>
              <circle cx="40" cy="47.5" r="8.5" fill="#fffaf0" stroke={LINE} strokeWidth="1.8" />
              <circle cx="60" cy="47.5" r="8.5" fill="#fffaf0" stroke={LINE} strokeWidth="1.8" />
              <circle cx="40" cy="48.5" r="2.6" fill="#1a0f08" />
              <circle cx="60" cy="48.5" r="2.6" fill="#1a0f08" />
            </g>
          ) : (
            <g className="eyes">
              <circle className="eye-glow" cx="40" cy="47.5" r="11" />
              <circle className="eye-glow" cx="60" cy="47.5" r="11" />
              <circle cx="40" cy="47.5" r="7.6" fill="#1a0f08" />
              <circle cx="60" cy="47.5" r="7.6" fill="#1a0f08" />
              <circle cx="42.8" cy="44.3" r="2.8" fill="#fffaf0" />
              <circle cx="62.8" cy="44.3" r="2.8" fill="#fffaf0" />
              <circle cx="37.6" cy="50.6" r="1.2" fill="#fffaf0" opacity="0.8" />
              <circle cx="57.6" cy="50.6" r="1.2" fill="#fffaf0" opacity="0.8" />
            </g>
          )}

          {scared || fallen ? (
            <ellipse cx="50" cy="60" rx="3.2" ry="4" fill="#1a0f08" />
          ) : mood === 'dance' || mood === 'wave' ? (
            <path d="M45 58 Q 50 64.5 55 58 Z" fill="#1a0f08" />
          ) : (
            <path d="M46 59 Q 50 62 54 59" stroke={LINE} strokeWidth="2" fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  )
}
