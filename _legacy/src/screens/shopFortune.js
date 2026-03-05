/* ============================================
   The Psychiatrist — Dr. Mind's Office
   Ridiculous diagnoses · Novel research · Dreams
   Clinical brutalist aesthetic
   ============================================ */

const ShopFortuneScreen = {

    _chatHistory: [],
    _isTyping: false,
    _threeEntry: null,
    _sessionCount: 0,

    /* ---- Dr. Mind personality engine ---- */
    _oracle: {
        name: 'Dr. Mind',
        greetings: [
            "Ah, patient! Come in, come in. *scribbles furiously in notebook* I've been expecting someone exactly like you for Chapter 7 of my novel.",
            "SIT. Don't touch anything. I just reorganized my desk by emotional aura. Tell me — what did you dream about last night? It's critical. Also it might be good for my book.",
            "Welcome back. Or is this your first visit? Either way, I've already diagnosed you with something. Let me find my notes... *flips through 400 pages of novel draft*",
            "You're late. The couch doesn't judge but I DO. Now — tell me about your deepest desire. Quickly, my publisher wants a draft by Friday.",
            "Another patient, another chapter. *adjusts glasses* Tell me everything. And I mean EVERYTHING. My novel needs a compelling protagonist and you might be it.",
            "Perfect timing. I just finished diagnosing the lamp with Seasonal Illumination Disorder. Your turn. What brings you to my office? And more importantly, what brings you to my NOVEL?",
        ],
        farewells: [
            "Same time next week. Bring your dreams. I need material.",
            "Session over. Take your prescription — two somersaults before bed and absolutely no thinking on Tuesdays.",
            "Go now. And remember: your feelings are valid, but more importantly, they're VERY good content for Chapter 12.",
        ],

        /* keyword → response pools */
        topics: {
            love: {
                keywords: ['love', 'boyfriend', 'girlfriend', 'crush', 'dating', 'relationship', 'partner', 'marriage', 'romance', 'heart', 'soulmate', 'date', 'kiss', 'single', 'ex'],
                responses: [
                    "*scribbles intensely* Fascinating. I'm diagnosing you with Chronic Romantic Idealism Syndrome. The cure? Stare at a potato for 20 minutes every morning. The potato represents your expectations. If the potato sprouts, you're ready for love. If it doesn't, eat it and try again next week.",
                    "Your romantic patterns suggest a rare condition I'm calling... *checks notes* ...Affection-Seeking Behavioral Loop, or ASBL. Prescribed treatment: write a love letter to a houseplant. If the houseplant thrives, your heart is healthy. This is going STRAIGHT into Chapter 9.",
                    "I see. And in your dreams, does this person appear as themselves or as a large, concerned pelican? Because that distinction matters. *writing furiously* ...don't mind me, the protagonist of my novel has the same problem. What a coincidence.",
                    "Based on what you've told me, you have a textbook case of Reciprocal Affection Deficiency. The treatment is simple: wear one sock inside out for a week. The asymmetry rebalances your love hormones. I read about it in a magazine. At the dentist. The magazine was about boats.",
                    "This is EXACTLY what my novel needed! A romantically confounded character who— *catches self* I mean... my professional diagnosis is Emotional Overinvestment Syndrome. Cure: eat soup with a fork. When you master that, you'll master love.",
                    "Tell me, do you dream about this person? And if so, are they doing your taxes in the dream? Because Dream Tax Preparation is a HUGE indicator of subconscious attachment. *flips to fresh notebook page* This is gold.",
                ],
            },
            money: {
                keywords: ['money', 'rich', 'wealth', 'coins', 'cash', 'job', 'career', 'salary', 'broke', 'poor', 'fortune', 'invest', 'bank', 'gold', 'pay'],
                responses: [
                    "Ah, financial anxiety! Classic case of Wallet Emptiness Perception Disorder. My prescription: bury exactly 3 coins in a park at midnight. The earth will multiply them. It hasn't worked for any patient yet but statistically it HAS to eventually. *scribbles* My protagonist will be rich...",
                    "You're suffering from what I call Monetary Phantom Limb — you feel money that isn't there. Treatment: carry a very heavy rock in your pocket. The weight simulates the feeling of a full wallet. Side effects may include back pain and looking suspicious.",
                    "*stops writing mid-sentence* Wait, you're worried about MONEY? That's Chapter 4! My novel's protagonist also has financial issues! What a beautiful parallel. Anyway, you have Fiscal Delusion Syndrome. Cure: whisper your bank balance to a tree.",
                    "I'm diagnosing you with Pre-Wealth Anticipation Anxiety. It means you're stressed about money you haven't earned yet. The cure? Convince yourself that clouds are currency. Look up — you're already rich! That'll be 50 coins for this session. ...Wait.",
                    "Interesting. And what do you desire MOST when you think about money? Is it security? Freedom? A really big hat? *notebook pages fluttering* Because your desires reveal your TRUE condition, which I believe is Coin-Oriented Personality Drift.",
                ],
            },
            future: {
                keywords: ['future', 'tomorrow', 'next', 'will i', 'what happens', 'going to', 'destiny', 'fate', 'upcoming', 'ahead', 'predict', 'soon', 'later', 'when will'],
                responses: [
                    "The future! *slams notebook on desk* I'm not supposed to predict it — I'm a psychiatrist, not a fortune teller. But BETWEEN US, I'm diagnosing you with Temporal Anxiety Cascade. Treatment: walk backwards for 10 minutes a day. You can't fear the future if you're facing the past. *taps forehead*",
                    "Worrying about the future is symptomatic of Chronological Insecurity Disorder. My prescription: set ALL your clocks to different times. If you don't know what time it is, you can't worry about what comes next. Revolutionary? Yes. My idea? Also yes. Going in the novel? ABSOLUTELY.",
                    "In your DREAMS, do you see the future? And if so, is there a talking dog? Because Prophetic Canine Visions are a VERY specific subtype of what you're experiencing. *writes* 'patient shows signs of temporal distortion and possible dog-based clairvoyance'...",
                    "I've seen your condition before. It's called Pre-Destiny Cognitive Overload. The cure: eat breakfast for dinner and dinner for breakfast for one week. Confuse your body's sense of time. Once your stomach doesn't know what day it is, your brain will follow. Trust me, I have a degree.",
                    "What do you DESIRE from the future? Not what you expect — what you DESIRE. *pen hovering over notebook* ...This is for therapeutic purposes obviously. And also Chapter 11 of my novel needs a yearning protagonist.",
                ],
            },
            health: {
                keywords: ['health', 'sick', 'body', 'exercise', 'gym', 'strong', 'energy', 'tired', 'sleep', 'diet', 'wellness', 'heal', 'pain', 'doctor'],
                responses: [
                    "I see. I'm diagnosing you with Comprehensive Skeletal Ennui — your BONES are bored. Treatment: compliment a different bone each morning. Start with the left kneecap. Tell it it's doing a great job. *scribbles* Chapter 6: the protagonist discovers their skeleton has feelings...",
                    "Classic case of Muscular Existential Drift! Your muscles don't know why they exist. Prescribed treatment: do jumping jacks while humming the alphabet backwards. This reminds your body it has PURPOSE. Side effects: neighbors may call the authorities.",
                    "Your symptoms match Reverse Energy Syndrome — you're actually CREATING tiredness where there was none. The cure: sleep LESS. I know, I know. But hear me out — if you confuse the tiredness, it gets scared and leaves. This is cutting-edge. My novel's protagonist swears by it.",
                    "*writes in notebook* 'Patient displays signs of Psychosomatic Vigor Depletion.' In LAYMAN'S terms, your spirit is tired and it's making your body tired too. Treatment: tell a mirror you're not tired. Loudly. With conviction. The mirror is a portal to your subconscious.",
                    "Have you been DREAMING about being healthy? Because Dream Wellness is paradoxically associated with waking malaise. It's a condition I discovered myself. I named it after myself. It's called Mind's Paradoxical Wellness Reversal. Treatment: eat a lemon aggressively.",
                ],
            },
            friends: {
                keywords: ['friend', 'friends', 'social', 'people', 'lonely', 'alone', 'company', 'crew', 'squad', 'bestie', 'best friend', 'group', 'hang out'],
                responses: [
                    "Friendship issues? I'm writing this down for TWO reasons — your treatment plan AND my novel. You have Social Calibration Misalignment. Treatment: introduce yourself to an inanimate object once a day. Build up to humans gradually. Start with a lamppost. They're good listeners.",
                    "*leans forward* Do you dream about your friends? Are they wearing hats in the dream? Because Hat-Wearing Friend Dreams indicate Subconscious Social Hierarchy Awareness. It means you're ranking your friends by hat size. This is INCREDIBLE material.",
                    "I'm diagnosing you with Interpersonal Gravitational Deficit — you're not pulling people toward you hard enough. Treatment: learn to juggle. People are FASCINATED by juggling. Nobody can resist a juggler. Trust the science. Well, MY science.",
                    "Your loneliness is actually a rare gift called Solitary Genius Syndrome. MOST brilliant minds prefer their own company. The cure, if you want one: stand in a crowded place and sneeze loudly. Instant attention. Instant connection. *writing* My protagonist will be a misunderstood loner...",
                    "What do you DESIRE in a friendship? Be specific. Do you want someone who laughs at your jokes, or someone who has interesting facts about birds? Because those are TWO very different treatment plans. *notebook ready*",
                ],
            },
            luck: {
                keywords: ['luck', 'lucky', 'chance', 'odds', 'random', 'gamble', 'bet', 'win', 'lose', 'jinx', 'curse', 'blessed', 'unlucky'],
                responses: [
                    "Bad luck? No such thing! What you have is Probability Perception Dys— actually wait yes. You have bad luck. But I can FIX it. Treatment: carry a cheese wedge in your pocket for exactly 72 hours. The cheese absorbs misfortune. Dispose of the cheese respectfully afterward.",
                    "*scribbling* LUCK! My novel's protagonist is also unlucky! What are the odds? ...Actually, given your condition, the odds are terrible. Diagnosis: Stochastic Misfortune Accumulation. Treatment: spin in a circle 7 times counterclockwise. This resets your luck buffer.",
                    "You're cursed? Interesting. In my PROFESSIONAL opinion, curses are stored in the elbows. Treatment: gently tap both elbows against a wooden surface while saying 'I refuse.' The curse gets confused and leaves through the fingertips.",
                    "Tell me about your DREAMS when you feel unlucky. Do you dream of falling? Flying? Doing your laundry? Because laundry dreams in unlucky people indicate what I call Domestic Fortune Blockage. Treatment: wash your socks inside out. Reverse the luck flow.",
                ],
            },
            game: {
                keywords: ['game', 'play', 'arcade', 'score', 'level', 'stats', 'strength', 'speed', 'train', 'power', 'evolve', 'character', 'creature'],
                responses: [
                    "You're worried about a GAME? *writes excitedly* This is perfect for my novel! A character obsessed with virtual achievement while neglecting their— I mean. Diagnosis: Ludic Ambition Overflow. Treatment: press every button on every device you own simultaneously. This redistributes your gaming energy.",
                    "Your desire to get stronger, faster, more powerful... it's a condition I call Stat-Based Identity Disorder. You've begun to see yourself as numbers on a screen. Treatment: look at a sunset and try NOT to rate it out of 10. It's harder than you think.",
                    "*stops writing* Wait. You're in a game RIGHT NOW? And you came to see a PSYCHIATRIST? Inside a GAME? This is the most psychologically interesting thing I've encountered. I need to write a whole CHAPTER about this. Diagnosis: Recursive Entertainment Syndrome. There is no cure. Only acceptance.",
                    "I'm prescribing you Stat Detox. For one hour, do NOT look at any numbers. No levels, no coins, no stats. Just EXIST. Feel the wind. Smell the pixels. Be present. ...Then go train at the Gym because honestly your stats COULD use work.",
                ],
            },
            meaning: {
                keywords: ['meaning', 'life', 'purpose', 'why', 'exist', 'point', 'real', 'universe', 'everything', 'nothing', 'death', 'alive', 'consciousness'],
                responses: [
                    "*puts down pen slowly* The meaning of life? I've been working on that chapter for 6 years. My current theory: the meaning of life is to be excellent material for someone else's novel. And RIGHT NOW, you are fulfilling that purpose beautifully. Diagnosis: Existential Clarity Avoidance. Cure: hug a tree but mean it.",
                    "Purpose! DESIRES! *knocks coffee off desk* THIS is what my novel is about! Tell me more! What do you WANT? What drives you? What haunts your dreams? ...Also, diagnosis: Cosmic Insignificance Panic. Treatment: name a star after yourself. It doesn't matter that millions already have. You deserve your own star.",
                    "You're asking the big questions. Wonderful. My diagnosis: you have Philosophical Overflow Syndrome. Your brain is generating more questions than answers, and the surplus is pooling in your subconscious. Treatment: write down every thought you have for one day. Then burn the paper. Then feel mysterious about it.",
                    "Existence is a condition I'm VERY familiar with. I have it myself. The treatment is simple but demanding: every morning, choose ONE absurd thing to believe in. Just for the day. Unicorns. Flat moon. Sentient soup. This exercises your capacity for meaning-making. *scribbles* My protagonist does this too...",
                ],
            },
            anxiety: {
                keywords: ['anxiety', 'anxious', 'worry', 'worried', 'panic', 'stress', 'stressed', 'nervous', 'fear', 'scared', 'afraid', 'overwhelm'],
                responses: [
                    "Anxiety! I know it well. My novel deals with this extensively. Diagnosis: Advanced Overthinking Syndrome with Secondary Worry Spirals. Treatment: every time you feel anxious, meow. Loudly. In public if necessary. The social embarrassment overwrites the anxiety. Fight fire with fire. Fight panic with meowing.",
                    "*writing at incredible speed* Your anxiety patterns are FASCINATING. In my professional opinion, your worries are nesting like Russian dolls. One worry contains another worry contains ANOTHER worry. Treatment: open all the windows in your home and shout 'VACANT.' Your worries will think you've moved out.",
                    "Tell me what you DREAM about when you're anxious. Is there water? Because anxiety dreams with water indicate Subconscious Hydration Guilt. You're not drinking enough water AND your body is making you pay for it psychologically. Cure: drink water while maintaining aggressive eye contact with yourself in a mirror.",
                    "I'm diagnosing you with what I call Emotional Treadmill Syndrome — you're running but going nowhere. Treatment: literal treadmill. But BACKWARDS. This physically tricks your body into thinking you've already escaped whatever you're worried about. Revolutionary? Yes. Dangerous? Slightly.",
                    "*taps notebook* This is Chapter 3 material! My protagonist has this EXACT condition! They beat it by befriending a crow. I'm prescribing you: befriend a crow. If no crows are available, a pigeon will do. Seagulls are NOT approved — they make everything worse.",
                ],
            },
            sad: {
                keywords: ['sad', 'depressed', 'depression', 'unhappy', 'crying', 'cry', 'hopeless', 'empty', 'numb', 'grief', 'loss', 'miss', 'hurt'],
                responses: [
                    "Sadness. *puts down pen gently for once* Okay, real talk — sadness is the one thing I take seriously. But ALSO my novel needs a sad chapter so... tell me more. Diagnosis: Emotional Weather System Malfunction. Treatment: watch something funny, then something sad, then something funny. Recalibrate. Like hitting the side of an old TV.",
                    "*writing softly* I hear you. And I want you to know: your sadness is valid. It's ALSO valid material for my novel but that's secondary. Diagnosis: Joy Deficit Disorder with Melancholic Undertones. Treatment: give a genuine compliment to a stranger. The dopamine bounce-back is real. The novel chapter is just a bonus.",
                    "In your dreams, when you're sad, what do you see? Colors? Shapes? A very concerned-looking fish? Because the fish indicates Subaquatic Emotional Processing. Your feelings are literally DROWNING. Treatment: breathe deeply and imagine your sadness as a small, ridiculous hat. It's harder to take seriously in hat form.",
                    "I've seen this before. You have Accumulated Joy Debt — you've been so busy getting through the day that you forgot to make deposits in your happiness account. Treatment: do something AGGRESSIVELY fun. Not calmly fun. AGGRESSIVELY fun. I recommend dancing alone in a kitchen.",
                    "Heavy stuff. *closes notebook* Listen. Between us and off the record and NOT for my novel... you're going to be okay. The fact that you're here, talking about it — that's already the first step. The second step is eating pancakes. I don't know why. I just feel strongly about it.",
                ],
            },
            dream: {
                keywords: ['dream', 'dreams', 'dreaming', 'nightmare', 'sleep', 'vision', 'dreamt', 'subconscious', 'unconscious'],
                responses: [
                    "DREAMS! *slams desk* MY FAVORITE SUBJECT! Tell me EVERYTHING. Were there stairs? Stairs in dreams indicate Subconscious Career Ambivalence. Were the stairs going up or down? If sideways, you have a much rarer condition and I'll need to write an ENTIRE chapter about you.",
                    "*eyes widen* You're DREAMING? Actively? This is extraordinary. Most of my patients claim they don't dream, which I diagnose as Dream Denial Syndrome. But YOU — you dream! Tell me: were there animals? Every animal in a dream represents a different unfulfilled desire. Cats = independence. Dogs = loyalty. Flamingos = you need to stand on one leg more often.",
                    "I need you to describe your dream in EXACT detail. Not for your treatment — for my NOVEL. Chapter 8 is called 'The Dream Archive' and it's the weakest chapter. Your dream could save it. Also, medically speaking, your dream indicates Nocturnal Cognitive Overflow. Treatment: sleep upside down. Like a bat. For one night.",
                    "Dreams are the SCREENPLAY of the subconscious! And YOUR subconscious is apparently producing indie films. Diagnosis: Overactive Nocturnal Imagination with Surrealist Tendencies. Treatment: before bed, tell your brain 'keep it simple tonight.' It won't listen, but the attempt is therapeutic.",
                    "*already writing before you finish* Yes yes yes! This dream — it reveals your deepest DESIRE. And your deepest desire is... *squints at notes* ...unclear but definitely novel-worthy. I'm prescribing Dream Journaling. Write down every dream. Then mail them to me. They're for therapy and DEFINITELY not for my book.",
                ],
            },
            desire: {
                keywords: ['desire', 'want', 'wish', 'hope', 'crave', 'need', 'aspire', 'ambition', 'goal', 'hunger'],
                responses: [
                    "*pen freezes mid-air* DESIRE? You're talking about desire?! This is the CORE THEME of my novel! Tell me more! What do you WANT more than anything? And I mean the weird stuff. The stuff you don't tell anyone. That's where the REAL therapy happens. Also where the best chapters come from.",
                    "Desire is the engine of the human condition! *knocks over pen cup* I'm diagnosing you with Unfulfilled Yearning Accumulation — your desires have been building up like emotional cholesterol. Treatment: write your biggest desire on a piece of paper, fold it into a boat, and float it down any body of water. If it sinks, you need bigger paper.",
                    "Interesting. And do you dream about this desire? Because dreamed desires are 47% more authentic than waking ones. I made up that statistic but it FEELS right. Diagnosis: Aspiration-Reality Gap Syndrome. Cure: take one small ridiculous step toward your goal today. Not a logical step. A RIDICULOUS one.",
                    "*writing so fast the pen is smoking* Your desires tell me everything I need to know about you. Clinically AND novelistically. You have what I call The Hunger — not for food, for MEANING. Treatment: stare at the night sky and whisper what you want. The universe is a good listener. Terrible advice-giver, but excellent listener.",
                ],
            },
        },

        /* generic fallbacks */
        generic: [
            "*scribbles in notebook* Mm-hmm. Mm-hmm. Interesting. I'm diagnosing you with General Unspecified Psychological Intrigue. Treatment: stand in the rain for 30 seconds. Not more, not less. The rain recalibrates your emotional firmware. ...This is also going in Chapter 5.",
            "Tell me — what did you DREAM about last night? Because whatever you just said connects to your dreams. Everything connects to your dreams. Your dreams are the universe's rough draft. *writing* ...much like my novel.",
            "Hmm. I'm writing this down not because it's medically significant but because it's NARRATIVELY compelling. Diagnosis: you have a mild case of Being Interesting. There's no cure. It's terminal. You'll be interesting forever. My condolences. Also, tell me about your deepest desire.",
            "*adjusts glasses, writes, pauses, writes more* Based on what you've told me, combined with the way you said it, and the exact angle at which you're sitting, I diagnose you with Vibe Displacement. Your vibe is displaced. Treatment: rearrange one piece of furniture in your home. ANY piece. The vibe will correct itself.",
            "That's fascinating. And I mean that both clinically and as an AUTHOR. My novel's protagonist says almost exactly what you just said! Except they're a time-traveling dentist, so the context is different. Diagnosis: Conversational Déjà Vu Syndrome. Cure: say something you've NEVER said before. Right now. I'll wait.",
            "Before I respond — what do you DESIRE right now? In this moment? Not what's logical or reasonable. What does your GUT want? ...Good. Now forget I asked. But also I wrote it down. For therapy. And my novel. Same thing really.",
            "*notebook is running out of pages* You're using all my paper! This is the best session I've had in weeks. Clinically speaking, you have Excessive Session Value Syndrome. Prognosis: excellent. For you AND for my word count.",
            "I've been listening carefully and taking notes and I want you to know: you are a deeply complex individual. Also you would make an EXCELLENT side character. Maybe even a love interest? No, that's weird. Or IS it? *writes 'possible love interest???' in margin*",
            "Everything you're saying aligns with what I call Dream-Desire Convergence Theory — your waking concerns mirror your sleeping ones. Treatment: before bed, tell yourself 'I am a mystery even to myself.' This induces what I call Therapeutic Self-Bewilderment. It works because it doesn't make sense. Like most things that work.",
            "I see. *puts down pen dramatically* This calls for my STRONGEST diagnosis: you have an acute case of Being Human. Symptoms include: feelings, dreams, contradictions, and an inexplicable desire for things to make sense. There is no cure. But there IS soup. Go eat some soup. Doctor's orders. *resumes writing novel*",
        ],

        /* reactions to short/gibberish inputs */
        confused: [
            "That's not enough for a diagnosis OR a novel chapter. Give me more. What are your DREAMS? Your DESIRES? I need MATERIAL!",
            "*taps pen impatiently* My notebook is HUNGRY and you're giving it CRUMBS. Full sentences, please. Think of it as therapy. And content creation.",
            "I can't work with that. Imagine you're telling me a dream — now tell me that dream, but awake. And in more words.",
            "My pen didn't even move. You need to give me something I can psychoanalyze AND fictionalize. Try again with FEELING.",
        ],

        /* typing flavor text */
        thinkingPhrases: [
            "Scribbling in notebook...",
            "Consulting my novel draft...",
            "Cross-referencing with dream theory...",
            "Formulating a diagnosis...",
            "Writing this down...",
            "Flipping through case files...",
            "Checking my dream index...",
            "This is good material...",
        ],
    },

    /* ---- Render the psychiatrist's office ---- */
    render() {
        const container = document.getElementById('screen-container');
        this._chatHistory = [];
        this._isTyping = false;
        this._sessionCount++;

        container.innerHTML = `
            <a class="back-link" onclick="App.navigateTo('town')">‹ Back to Town</a>

            <div class="glass-panel" style="text-align: center; margin: 16px auto; padding: 16px 24px; border-color: rgba(0, 180, 180, 0.4); max-width: 900px; background: rgba(10,30,30,0.8);">
                <h2 class="pixel-text" style="font-size: 14px; color: #00cccc; letter-spacing: 2px;">⌘ THE PSYCHIATRIST ⌘</h2>
                <p style="font-size: 11px; color: rgba(130, 220, 220, 0.7);">Dr. Mind sees you now. Everything said here stays here.* <span style="font-size: 8px; opacity: 0.4;">*except what goes in his novel</span></p>
            </div>

            <div style="display: flex; gap: 16px; max-width: 900px; margin: 0 auto; padding: 0 12px; height: calc(100vh - 260px); min-height: 400px;">
                <!-- Doctor's Desk -->
                <div class="glass-panel" style="flex: 0 0 240px; display: flex; flex-direction: column; align-items: center; padding: 16px; border-color: rgba(0, 180, 180, 0.3); background: rgba(10,25,25,0.8);">
                    <div class="pixel-text" style="font-size: 9px; color: rgba(100, 200, 200, 0.5); margin-bottom: 8px;">// DR. MIND</div>
                    <div id="fortune-crystal-scene" style="width: 200px; height: 200px; border-radius: 8px; overflow: hidden; border: 2px solid rgba(0, 180, 180, 0.4); box-shadow: 0 0 20px rgba(0, 180, 180, 0.15);"></div>
                    <div class="pixel-text" style="font-size: 8px; color: rgba(100, 200, 200, 0.3); margin-top: 8px;">in session · writing his novel</div>

                    <div style="margin-top: 12px; width: 100%; text-align: left;">
                        <div class="pixel-text" style="font-size: 8px; color: rgba(100, 200, 200, 0.4); margin-bottom: 4px;">// NOVEL PROGRESS</div>
                        <div style="background: rgba(0,0,0,0.3); border-radius: 4px; height: 8px; overflow: hidden;">
                          <div style="height: 100%; width: ${Math.min(95, 30 + this._sessionCount * 5)}%; background: linear-gradient(90deg, #00cccc, #44aaaa); border-radius: 4px;"></div>
                        </div>
                        <div class="pixel-text" style="font-size: 7px; color: rgba(100,200,200,0.3); margin-top: 3px;">Ch.${Math.min(12, this._sessionCount + 1)} in progress</div>
                    </div>

                    <div style="margin-top: auto; width: 100%; text-align: left;">
                        <div class="pixel-text" style="font-size: 8px; color: rgba(100, 200, 200, 0.4); margin-bottom: 4px;">// SESSION FEE</div>
                        <div id="fortune-count" class="pixel-text" style="font-size: 10px; color: #00cccc;">FREE*</div>
                        <div style="font-size: 7px; color: rgba(100,200,200,0.25);">*you pay in novel material</div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div style="flex: 1; display: flex; flex-direction: column; min-width: 0;">
                    <!-- Chat Messages -->
                    <div id="fortune-chat" class="glass-panel" style="flex: 1; overflow-y: auto; padding: 16px; border-color: rgba(0, 180, 180, 0.2); margin-bottom: 12px; display: flex; flex-direction: column; gap: 12px; background: rgba(10,25,25,0.6);">
                    </div>

                    <!-- Input Area -->
                    <div class="glass-panel" style="padding: 12px; border-color: rgba(0, 180, 180, 0.4); display: flex; gap: 8px; align-items: center; background: rgba(10,25,25,0.7);">
                        <input type="text" id="fortune-input"
                            placeholder="Tell Dr. Mind about your dreams, desires, or problems..."
                            style="flex: 1; background: rgba(10, 30, 30, 0.8); border: 1px solid rgba(0, 180, 180, 0.3); color: #b0e8e8; padding: 10px 14px; font-family: var(--font-pixel); font-size: 10px; border-radius: 4px; outline: none;"
                            onkeydown="if(event.key==='Enter')ShopFortuneScreen.askQuestion()"
                            maxlength="200"
                            autocomplete="off" />
                        <button class="retro-btn" onclick="ShopFortuneScreen.askQuestion()"
                            style="background: rgba(0, 180, 180, 0.3); border-color: rgba(0, 180, 180, 0.6); color: #66dddd; padding: 10px 16px; white-space: nowrap;">
                            SPEAK ⌘
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Build office scene
        this._buildCrystalBall();

        // Add initial greeting
        const greeting = this._oracle.greetings[Math.floor(Math.random() * this._oracle.greetings.length)];
        this._addMessage('zara', greeting);

        GameState.updateAddressBar('psychiatrist');
        GameState.updateStatus('In session with Dr. Mind', '⌘');
    },

    /* ---- Build the office 3D scene ---- */
    _buildCrystalBall() {
        const container = document.getElementById('fortune-crystal-scene');
        if (!container || typeof THREE === 'undefined') return;

        const width = 200, height = 200;
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a1a1a);

        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
        camera.position.set(0, 2.5, 5);
        camera.lookAt(0, 1.5, 0);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // Lighting — clinical
        scene.add(new THREE.AmbientLight(0x225555, 0.8));
        const mainLight = new THREE.DirectionalLight(0x88cccc, 0.7);
        mainLight.position.set(-3, 5, 3);
        scene.add(mainLight);

        // Desk
        const deskMat = new THREE.MeshStandardMaterial({ color: 0x2a1a0a, roughness: 0.8, metalness: 0.1 });
        const desk = new THREE.Mesh(new THREE.BoxGeometry(3, 0.15, 1.5), deskMat);
        desk.position.set(0, 1.0, 0);
        scene.add(desk);

        // Desk legs
        [[-1.3, 0, -0.5], [1.3, 0, -0.5], [-1.3, 0, 0.5], [1.3, 0, 0.5]].forEach(([x, _, z]) => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1, 0.1), deskMat);
            leg.position.set(x, 0.5, z);
            scene.add(leg);
        });

        // BIG notepad on desk (prominent — he's always writing)
        const padMat = new THREE.MeshStandardMaterial({ color: 0xeeeedd, roughness: 0.9 });
        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.0), padMat);
        pad.position.set(-0.3, 1.1, 0);
        scene.add(pad);

        // Pen (angled like actively writing)
        const penMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.6 });
        const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5), penMat);
        pen.position.set(-0.1, 1.15, 0.1);
        pen.rotation.z = Math.PI / 4;
        pen.rotation.x = 0.3;
        scene.add(pen);

        // Stack of manuscript pages
        const stackMat = new THREE.MeshStandardMaterial({ color: 0xddddcc, roughness: 0.9 });
        const stack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.8), stackMat);
        stack.position.set(0.9, 1.1, -0.1);
        scene.add(stack);

        // Coffee mug
        const mugMat = new THREE.MeshStandardMaterial({ color: 0x334444, roughness: 0.6 });
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.25, 8), mugMat);
        mug.position.set(1.2, 1.22, 0.4);
        scene.add(mug);

        // Diploma on wall
        const diplomaMat = new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.8 });
        const diploma = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.7, 0.05), diplomaMat);
        diploma.position.set(-0.8, 3.5, -2);
        scene.add(diploma);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0xeeddcc, roughness: 0.9 });
        const inner = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.06), innerMat);
        inner.position.set(-0.8, 3.5, -1.99);
        scene.add(inner);

        // "MY NOVEL" sign/frame on wall
        const novelFrame = new THREE.Mesh(
            new THREE.BoxGeometry(0.9, 0.6, 0.05),
            new THREE.MeshStandardMaterial({ color: 0x553322, roughness: 0.8 })
        );
        novelFrame.position.set(0.8, 3.5, -2);
        scene.add(novelFrame);
        const novelInner = new THREE.Mesh(
            new THREE.BoxGeometry(0.7, 0.4, 0.06),
            new THREE.MeshStandardMaterial({ color: 0x00aaaa, roughness: 0.5, emissive: 0x005555, emissiveIntensity: 0.3 })
        );
        novelInner.position.set(0.8, 3.5, -1.99);
        scene.add(novelInner);

        // Couch for patient
        const couchMat = new THREE.MeshStandardMaterial({ color: 0x1a3030, roughness: 0.7 });
        const seat = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.6), couchMat);
        seat.position.set(0, 0.5, 2);
        scene.add(seat);
        const backrest = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 0.1), couchMat);
        backrest.position.set(0, 0.8, 2.3);
        scene.add(backrest);
        // Armrests
        [[-0.6, 0], [0.6, 0]].forEach(([x]) => {
            const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.6), couchMat);
            arm.position.set(x, 0.65, 2);
            scene.add(arm);
        });

        // Animate — pen subtly moves (he's always writing)
        const animate = () => {
            if (!document.getElementById('fortune-crystal-scene')) return;
            requestAnimationFrame(animate);
            const t = Date.now() * 0.001;
            // Pen wobbles slightly — he's writing
            pen.rotation.z = Math.PI / 4 + Math.sin(t * 3) * 0.05;
            pen.position.x = -0.1 + Math.sin(t * 2) * 0.02;
            renderer.render(scene, camera);
        };
        animate();
    },

    /* ---- Ask a question ---- */
    askQuestion() {
        if (this._isTyping) return;

        const input = document.getElementById('fortune-input');
        if (!input) return;

        const question = input.value.trim();
        if (!question) return;

        input.value = '';

        // Add user message
        this._addMessage('user', question);

        // Generate response
        this._isTyping = true;
        const thinkText = this._oracle.thinkingPhrases[Math.floor(Math.random() * this._oracle.thinkingPhrases.length)];
        this._addMessage('thinking', thinkText);

        // Simulate contemplation
        const delay = 1500 + Math.random() * 2000;
        setTimeout(() => {
            // Remove thinking indicator
            const thinking = document.querySelector('.fortune-thinking');
            if (thinking) thinking.remove();

            // Generate and add response
            const response = this._generateResponse(question);
            this._addMessage('zara', response);
            this._isTyping = false;

            // Focus back on input
            const inp = document.getElementById('fortune-input');
            if (inp) inp.focus();
        }, delay);
    },

    /* ---- Generate a therapy response ---- */
    _generateResponse(question) {
        const q = question.toLowerCase();

        // Check for very short/gibberish input
        if (q.length < 3 || !/[a-z]/.test(q)) {
            return this._pick(this._oracle.confused);
        }

        // Try to match a topic
        let matchedResponses = [];
        let matchScore = 0;

        for (const [topic, data] of Object.entries(this._oracle.topics)) {
            let score = 0;
            for (const kw of data.keywords) {
                if (q.includes(kw)) {
                    score += kw.length;
                }
            }
            if (score > matchScore) {
                matchScore = score;
                matchedResponses = data.responses;
            }
        }

        // Use matched responses or generic
        let response;
        if (matchScore > 0) {
            response = this._pick(matchedResponses);
        } else {
            response = this._pick(this._oracle.generic);
        }

        // Frequently add notebook/novel P.S.
        if (Math.random() > 0.45) {
            const ps = this._pick([
                "\n\n*scribbles* ...adding that to Chapter " + (Math.floor(Math.random() * 12) + 1) + ". Don't worry. I'll change your name. Probably.",
                "\n\nP.S. — I forgot to ask: what did you DREAM about last night? It's relevant. To your treatment. And my word count.",
                "\n\n⌘ Clinical note: patient provides excellent narrative material. Continue sessions. For THERAPEUTIC reasons. ⌘",
                "\n\n*notebook page turns* One more thing: what is your deepest, most irrational DESIRE? It's medically relevant. Also Chapter 9 is thin.",
                "\n\n*pen runs out of ink, switches to backup pen* Sorry. High-volume note-taking session. That's a compliment. Sort of.",
                "\n\nTreatment reminder: don't forget your prescription. Two backflips before noon and NO eye contact with squirrels on Wednesdays.",
                "\n\n*muttering while writing* '...and then the protagonist realized...' Oh, sorry. Still here. Still listening. Mostly.",
                "\n\nHomework: write a letter to the version of yourself from 5 years ago. Then write their REPLY. Then argue with both letters. This is therapy. Trust the process.",
            ]);
            response += ps;
        }

        return response;
    },

    _pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /* ---- Add message to chat ---- */
    _addMessage(type, text) {
        const chat = document.getElementById('fortune-chat');
        if (!chat) return;

        const msg = document.createElement('div');

        if (type === 'user') {
            msg.style.cssText = 'align-self: flex-end; background: rgba(10, 40, 40, 0.8); border: 1px solid rgba(0, 180, 180, 0.4); border-radius: 12px 12px 2px 12px; padding: 10px 14px; max-width: 75%; color: #b0e8e8; font-family: var(--font-pixel); font-size: 10px; line-height: 1.6;';
            msg.textContent = text;
        } else if (type === 'thinking') {
            msg.className = 'fortune-thinking';
            msg.style.cssText = 'align-self: flex-start; padding: 8px 14px; color: rgba(100, 200, 200, 0.5); font-family: var(--font-pixel); font-size: 9px; font-style: italic;';
            msg.innerHTML = `<span class="fortune-dots">${text}</span>`;
            let dots = 0;
            msg._interval = setInterval(() => {
                dots = (dots + 1) % 4;
                const span = msg.querySelector('.fortune-dots');
                if (span) span.textContent = text + '.'.repeat(dots);
            }, 400);
        } else if (type === 'zara') {
            msg.style.cssText = 'align-self: flex-start; background: rgba(10, 30, 30, 0.9); border: 1px solid rgba(0, 180, 180, 0.3); border-radius: 12px 12px 12px 2px; padding: 10px 14px; max-width: 80%; color: #99dddd; font-size: 12px; line-height: 1.7; position: relative;';

            // Name tag
            const nameTag = document.createElement('div');
            nameTag.style.cssText = 'font-family: var(--font-pixel); font-size: 8px; color: #00cccc; margin-bottom: 4px; letter-spacing: 1px;';
            nameTag.textContent = '⌘ DR. MIND';
            msg.appendChild(nameTag);

            // Response text — typewriter effect
            const textEl = document.createElement('div');
            textEl.style.fontFamily = 'var(--font-mono, monospace)';
            msg.appendChild(textEl);

            this._typewriterEffect(textEl, text, 20);
        }

        chat.appendChild(msg);
        setTimeout(() => { chat.scrollTop = chat.scrollHeight; }, 50);

        this._chatHistory.push({ type, text });
    },

    /* ---- Typewriter effect ---- */
    _typewriterEffect(element, text, speed) {
        let i = 0;
        const escapeHtml = (ch) => {
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            return map[ch] || ch;
        };
        const type = () => {
            if (i < text.length) {
                if (text[i] === '\n') {
                    element.innerHTML += '<br>';
                } else {
                    element.innerHTML += escapeHtml(text[i]);
                }
                i++;
                const chat = document.getElementById('fortune-chat');
                if (chat) chat.scrollTop = chat.scrollHeight;
                const nextDelay = text[i - 1] === '.' ? speed * 4 : text[i - 1] === ',' ? speed * 2 : speed + Math.random() * 10;
                setTimeout(type, nextDelay);
            }
        };
        type();
    },

    /* ---- Cleanup ---- */
    cleanup() {
        this._chatHistory = [];
        this._isTyping = false;
    },
};
