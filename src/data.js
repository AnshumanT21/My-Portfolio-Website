export const EMAIL = 'anshumantyagi20@gmail.com'
export const GITHUB = 'https://github.com/AnshumanT21'
export const LINKEDIN = 'https://www.linkedin.com/in/anshuman-tyagi-955455315/'
export const PHOTO = 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764628049/0_djdrnc.jpg'

export const skills = [
  'Python', 'FastAPI', 'React', 'React Native', 'JavaScript', 'Supabase', 'Firebase',
  'OpenAI API', 'Tailwind CSS', 'MATLAB', 'Cloudflare R2', '3D modeling',
]

export const projects = [
  {
    id: 'claimiq',
    when: '2026',
    where: 'Independent product',
    // media: what the project view shows, in order. Each item is
    // { type: 'video', src, poster } or { type: 'image', src }, with an optional caption.
    media: [
      { type: 'video', src: 'media/claimiq-demo.mp4', poster: 'media/claimiq-poster.jpg', caption: 'A 30-second walkthrough: one cattle claim, 17 scanned pages, one finished report.' },
      { type: 'image', src: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1786565570/0fe5cc2d-4f3b-47bb-bb64-150051468a8c.png', caption: 'The sign-in page at claimiq.in.' },
    ],
    // Figures as stated on claimiq.in.
    stats: [
      { value: '10+', label: 'document types sorted automatically' },
      { value: '< 30s', label: 'to draft an ILA or FSR report' },
      { value: '100%', label: 'of fields reviewed by the surveyor' },
    ],
    steps: [
      'Splits a scanned bundle into its separate documents and sorts every page',
      'Reads every field and flags the ones it isn’t sure of',
      'Checks each document against the others for mismatches',
      'Writes the survey report in the official format',
    ],
    title: 'ClaimIQ',
    category: 'AI SaaS platform',
    blurb: 'Reads raw insurance claim documents and writes the client-ready report.',
    image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1786565570/0fe5cc2d-4f3b-47bb-bb64-150051468a8c.png',
    url: 'https://claimiq.in/',
    status: 'Live in production',
    challenge:
      'Claim adjusters spend most of their day reading and cross-referencing dense paperwork: intimation letters, discharge vouchers, post-mortem reports, often mixing Hindi and English. The bottleneck is data entry, not judgment. The system had to be accurate enough to remove that work without losing the traceability adjusters rely on.',
    results:
      'Live with a real client on a marine insurance line, generating ILA and FSR reports. A cattle insurance line is in development, built from 10 real claim cases on the same architecture.',
    stack: ['FastAPI', 'React/Vite', 'Supabase', 'Cloudflare R2', 'GPT-4o', 'Google Document AI'],
  },
  {
    id: 'concierge',
    when: 'Summer 2026',
    where: 'Internship at Aionos',
    steps: [
      'A company uploads its SOPs, FAQs and policy documents',
      'Those become a private knowledge base for that company only',
      'A branded chatbot goes onto their site with one embed snippet',
      'Guests can also talk to it, through a voice bot with real-time audio',
    ],
    title: 'Concierge AI',
    category: 'B2B AI platform',
    blurb: 'Branded hotel and travel chatbots that only answer from the company’s own documents.',
    image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1786566337/3651fa92-6e3c-4586-b8f4-ba6d30d413cd.png',
    url: null,
    status: 'Built at Aionos',
    challenge:
      'Hospitality teams answer the same guest questions all day, and generic chatbots make things up. The platform had to host many independent clients, each with its own knowledge base, while keeping every answer grounded in that client’s SOPs and policies.',
    results:
      'Multi-bot document management, an embeddable widget, and a production voice bot with real-time audio streaming. Any hospitality brand can deploy it without writing code.',
    stack: ['FastAPI', 'Supabase', 'OpenAI API', 'Cloudflare R2', 'React/Vite', 'Tailwind CSS'],
  },
  {
    id: 'signal',
    when: 'Summer 2026',
    where: 'Internship at Aionos',
    steps: [
      'Collects brand and topic mentions from several sources',
      'Normalizes them into one consistent format',
      'Scores the sentiment of each mention',
      'Shows the result in three live dashboard views',
    ],
    title: 'Signal Desk',
    category: 'Analytics platform',
    blurb: 'Pulls brand mentions from across the web into one live sentiment dashboard.',
    image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1786566535/565c7149-77d7-4650-b799-1c3812137cb2.png',
    url: null,
    status: 'Built at Aionos',
    challenge:
      'Mentions are spread over dozens of platforms with different APIs, rate limits and access rules. The collection layer had to pull from all of them reliably, normalize the results and surface sentiment trends without anyone watching it.',
    results:
      'Validated end to end with real test data across all three dashboard views, and designed so new sources can be added without reworking the pipeline.',
    stack: ['Python', 'FastAPI', 'React/Vite', 'YouTube Data API', 'Serper.dev'],
  },
  {
    id: 'devvault',
    when: 'December 2025',
    where: 'Personal project',
    media: [
      { type: 'video', src: 'media/devvault-demo.mp4', poster: 'media/devvault-poster.jpg', caption: 'A 30-second tour of the four vaults: code, colour palettes, resources and projects.' },
      { type: 'image', src: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1765138992/949111f4-e81b-4279-bc04-c18d90af7f7a_nb3j5l.png', caption: 'The Dev Vault logo.' },
    ],
    steps: [
      'Code Vault: save a component or snippet once and find it again in milliseconds',
      'Color Palettes: save a palette, then click any swatch to copy its hex code',
      'Resources: inspiration, docs and tools, tagged and searchable',
      'Projects: link saved items to the project they belong to',
    ],
    title: 'Dev Vault',
    category: 'Web app',
    blurb: 'One place for the snippets, palettes and components you keep bookmarking and losing.',
    image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1765138992/949111f4-e81b-4279-bc04-c18d90af7f7a_nb3j5l.png',
    url: 'https://www.devvault.co/',
    status: 'Live',
    challenge:
      'Designers and developers save resources everywhere: browser bookmarks, notes apps, screenshots. Finding the gradient you saved three weeks ago turns into a search party. I wanted one place that made saving and finding them effortless.',
    results:
      'A working site with fast saving, categories and search. It started as a fix for my own messy bookmarks.',
    stack: ['React Native', 'Tailwind CSS', 'Firebase'],
  },
  {
    id: 'tryiton',
    when: 'November 2025',
    where: 'Personal project',
    steps: [
      'Take or upload a single photo of yourself',
      'AI turns it into a 3D model',
      'Put clothes on the model and rotate it to see every angle',
    ],
    title: 'Try It On!',
    category: 'Mobile app',
    blurb: 'Turns a single photo of you into a 3D model you can dress up.',
    image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1763872937/TryItOn_ExhibitLogo_k1fjn1.jpg',
    url: 'https://github.com/AnshumanT21/Try-It-On-',
    status: 'On GitHub',
    challenge: 'Seeing how clothes look on a real body without physically trying them on.',
    results: 'Fast processing, detailed meshes and clean previews you can rotate to any angle.',
    stack: ['Python', 'React Native', 'Cloudinary', 'Supabase', 'TripoSR'],
  },
  {
    id: 'booksanta',
    when: '2022',
    where: 'WhiteHat Jr certification project',
    steps: [
      'Donors list the books they are done with',
      'Readers nearby request the ones they want',
      'The app connects the two so the book changes hands',
    ],
    title: 'Book Santa',
    category: 'Mobile app',
    blurb: 'A peer-to-peer app for giving away and finding books near you.',
    image: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764705418/unnamed_erc65q.jpg',
    url: 'https://github.com/AnshumanT21/Book-Santa-App',
    status: 'On GitHub',
    challenge:
      'Books gather dust after one read while other people can’t afford new ones. The app connects the two.',
    results:
      'A complete cross-platform mobile app, and my first real lesson in state management and shipping something end to end.',
    stack: ['JavaScript', 'React Native', 'Firebase'],
  },
]

export const experience = [
  {
    when: '2024 to 2028',
    title: 'B.S. Computer Engineering',
    where: 'University of Massachusetts Amherst',
    points: ['Member of the iCons Program', 'Dean’s List every semester'],
  },
  {
    when: 'Summer 2026',
    title: 'AI Engineering Intern',
    where: 'Aionos',
    points: [
      'Built Concierge AI, a multi-tenant platform for branded hotel and travel chatbots grounded in each client’s own documents',
      'Shipped an embeddable chat widget and a production voice bot with real-time audio streaming',
      'Built Signal Desk, a social listening dashboard that tracks brand mentions and sentiment across the web',
    ],
  },
  {
    when: 'Summer 2025',
    title: 'AI & Automation Engineer Intern',
    where: 'Adwiti Technocrats',
    points: [
      'Led a small team that built and deployed an AI chatbot answering questions about customers’ insurance policies',
      'Built a multilingual paraphrasing tool to standardize claim reports',
      'Automated document data extraction to cut manual parsing',
    ],
  },
  {
    when: '2022 to 2024',
    title: 'High school',
    where: 'Modern School Barakhamba Road, New Delhi',
    points: ['Technical Head of the Lenscraft Club', 'Member of the Bits n Bytes Club'],
  },
  {
    when: '2020 and 2022',
    title: 'Certified game and mobile developer',
    where: 'WhiteHat Jr',
    points: [
      'Rebuilt Angry Birds, Flappy Bird and the T-Rex runner from scratch',
      'Shipped cross-platform Android and iOS apps with real backends',
    ],
  },
]

// `react` names the little animation each polaroid does when clicked.
export const hobbies = [
  { title: 'Photography', note: 'Former Lenscraft tech head', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764657673/0_o7kvmr.jpg', react: 'flash' },
  { title: 'Formula 1', note: 'Here for the speed and the drama', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764712090/3629a2ebd94fc211c1470a26490270a9_hybwdc.jpg', react: 'rev' },
  { title: 'Football', note: 'Playing since I was 9', img: 'https://www.aljazeera.com/wp-content/uploads/2021/08/2019-12-07T000000Z_879038429_RC2LQD9L67FQ_RTRMADP_3_SOCCER-SPAIN-FCB-RCD-REPORT.jpg?resize=770%2C513&quality=80', react: 'bounce' },
  { title: '3D printing', note: 'Tiny figurines, big print queues', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764711928/3d-printed-brush-bots-MRRF-scaled.jpg_wjlewn.webp', react: 'spin' },
  { title: 'Gaming', note: 'Open worlds and weird builds', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764625697/ghost-of-tsusima-scenery-w0-1280x2120_ltmgap.jpg', react: 'wobble' },
  { title: 'Travel', note: 'Hidden alleys over landmarks', img: 'https://res.cloudinary.com/dwrts9bjq/image/upload/v1764625925/0_eun24e.jpg', react: 'wobble' },
]

// Six things I build. Each one grows on its own branch of the tree.
export const crafts = [
  { title: 'AI products', note: 'LLM apps grounded in real documents, like ClaimIQ and Concierge AI.' },
  { title: 'Full-stack web', note: 'FastAPI backends and React front ends, shipped to real users.' },
  { title: 'AI automation', note: 'Pipelines that parse documents and write the reports, so people don’t have to.' },
  { title: 'Conversational AI', note: 'Chatbots and voice bots that answer from a company’s own documents.' },
  { title: 'UI/UX design', note: 'Designing the interface as well as building it, from Dev Vault to this site.' },
  { title: 'Embedded systems', note: 'C++ and microcontroller work from my Computer Engineering coursework.' },
]
