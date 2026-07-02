export type PathId = "saving" | "investing" | "credit" | "entrepreneurship" | "crypto";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  intro: string;
  quiz: QuizQuestion[];
}

export interface LearningPath {
  id: PathId;
  title: string;
  emoji: string;
  tagline: string;
  lessons: Lesson[];
}

export const PATH_FRUIT: Record<PathId, string> = {
  saving: "🍎",
  investing: "🥜",
  credit: "🫐",
  crypto: "🍌",
  entrepreneurship: "🍇",
};

export const PATHS: LearningPath[] = [
  {
    id: "saving",
    title: "Saving",
    emoji: "🪙",
    tagline: "Build the habit of keeping more than you spend.",
    lessons: [
      {
        id: "s1",
        title: "Why Saving Matters",
        minutes: 3,
        intro:
          "Saving means setting aside money you earn today so your future self has choices. Even small amounts build up thanks to consistency. A simple rule: pay yourself first — move a little to savings the moment money arrives, before you spend the rest.",
        quiz: [
          {
            q: "What does 'pay yourself first' mean?",
            options: [
              "Buy something fun before bills",
              "Move money to savings before spending",
              "Give yourself a raise",
            ],
            answer: 1,
            explain: "Saving first makes the habit automatic instead of hoping for leftovers.",
          },
          {
            q: "Which is the best reason to save?",
            options: ["To get rich overnight", "To have choices in the future", "To impress friends"],
            answer: 1,
            explain: "Savings turn into flexibility and reduce stress when life surprises you.",
          },
          {
            q: "Small, consistent savings grow because of…",
            options: ["Luck", "Time and habit", "Guessing right"],
            answer: 1,
            explain: "Time and repetition are your two biggest superpowers.",
          },
        ],
      },
      {
        id: "s2",
        title: "Emergency Fund 101",
        minutes: 4,
        intro:
          "An emergency fund is money set aside for surprises: a car repair, a medical bill, a lost paycheck. A common starter goal is one month of essential expenses, then grow toward 3–6 months over time. Keep it in a separate account you don't touch for daily spending.",
        quiz: [
          {
            q: "What is an emergency fund for?",
            options: ["Vacations", "Unexpected expenses", "New sneakers"],
            answer: 1,
            explain: "It's a cushion for the unplanned, not a wishlist wallet.",
          },
          {
            q: "A good starter goal is…",
            options: ["One month of essential expenses", "One year of income", "$100,000"],
            answer: 0,
            explain: "Start small and build. One month first, then keep going.",
          },
          {
            q: "Where should you keep it?",
            options: ["Under your mattress", "A separate savings account", "Mixed with checking"],
            answer: 1,
            explain: "Separation keeps you from spending it accidentally.",
          },
        ],
      },
      {
        id: "s3",
        title: "Budgeting the 50/30/20 Way",
        minutes: 4,
        intro:
          "The 50/30/20 rule is a simple budget frame: 50% of take-home pay for needs (rent, food, transit), 30% for wants (fun, dining, hobbies), and 20% for saving and paying down debt. Adjust to your reality — it's a guide, not a law.",
        quiz: [
          {
            q: "What does the '20' in 50/30/20 represent?",
            options: ["Wants", "Savings and debt payoff", "Taxes"],
            answer: 1,
            explain: "The 20% chunk is your future — savings and knocking down debt.",
          },
          {
            q: "Rent is a…",
            options: ["Need", "Want", "Saving"],
            answer: 0,
            explain: "Housing is a core need in the 50% bucket.",
          },
          {
            q: "The rule should be…",
            options: ["Followed exactly", "Ignored", "Adjusted to your life"],
            answer: 2,
            explain: "It's a starting frame — tweak the numbers to fit you.",
          },
        ],
      },
      {
        id: "s4",
        title: "Automating Your Savings",
        minutes: 3,
        intro:
          "Willpower is a limited resource. Automation isn't. Set a recurring transfer from checking to savings on payday. Even $10 a week turns into hundreds a year — with zero decisions required.",
        quiz: [
          {
            q: "Why automate savings?",
            options: [
              "It removes the need to decide each time",
              "It earns more interest by law",
              "It's required by banks",
            ],
            answer: 0,
            explain: "Removing the decision is what makes the habit stick.",
          },
          {
            q: "The best day to auto-transfer is usually…",
            options: ["The day before bills", "Payday", "The last day of the month"],
            answer: 1,
            explain: "Save the moment the money lands, before it disappears.",
          },
          {
            q: "$10/week for a year is roughly…",
            options: ["$50", "$520", "$5,200"],
            answer: 1,
            explain: "Small amounts stack up faster than most people expect.",
          },
        ],
      },
    ],
  },
  {
    id: "investing",
    title: "Investing",
    emoji: "🌱",
    tagline: "Learn how money can grow over time — the boring, healthy way.",
    lessons: [
      {
        id: "i1",
        title: "What Is Investing?",
        minutes: 3,
        intro:
          "Investing means putting money into assets you expect to grow in value over time — like ownership in companies (stocks) or loans to companies/governments (bonds). Unlike a savings account, investments can go up AND down. The goal is long-term growth, not overnight wins.",
        quiz: [
          {
            q: "Investing is best thought of as…",
            options: ["A get-rich-quick tool", "A long-term growth strategy", "A guaranteed win"],
            answer: 1,
            explain: "Investing rewards patience, not hype.",
          },
          {
            q: "A stock represents…",
            options: ["A loan to a company", "Ownership in a company", "A savings account"],
            answer: 1,
            explain: "Owning a share = owning a tiny slice of that business.",
          },
          {
            q: "Investments can…",
            options: ["Only go up", "Only go down", "Go up and down"],
            answer: 2,
            explain: "Ups and downs are normal. Time smooths them out.",
          },
        ],
      },
      {
        id: "i2",
        title: "Compound Growth",
        minutes: 4,
        intro:
          "Compound growth is when your earnings start earning too. If $100 grows 10%, you have $110. Next year, that 10% is on $110, not $100. Over decades, this snowball effect does most of the work — which is why starting early matters more than starting big.",
        quiz: [
          {
            q: "Compound growth means…",
            options: ["Earnings earn more earnings", "Money doubles every year", "You must invest weekly"],
            answer: 0,
            explain: "Your returns start generating their own returns.",
          },
          {
            q: "The most important ingredient is…",
            options: ["Timing the market", "Time in the market", "Luck"],
            answer: 1,
            explain: "Time is the multiplier that makes compounding work.",
          },
          {
            q: "Starting early with a little vs. late with a lot usually…",
            options: ["Wins by starting early", "Wins by starting late", "Is exactly the same"],
            answer: 0,
            explain: "An early start gives compounding more decades to work.",
          },
        ],
      },
      {
        id: "i3",
        title: "Diversification",
        minutes: 4,
        intro:
          "Diversification means not putting all your eggs in one basket. Instead of owning one stock, you can own a mix of many — often through low-cost index funds. When one part zigs, another zags, smoothing your ride.",
        quiz: [
          {
            q: "Diversification helps you…",
            options: ["Maximize risk", "Reduce risk from any single asset", "Guarantee profits"],
            answer: 1,
            explain: "Spreading out reduces the damage from any one bad pick.",
          },
          {
            q: "An index fund is…",
            options: ["A single hand-picked stock", "A basket tracking many companies", "A savings bond"],
            answer: 1,
            explain: "Index funds give you many companies in one package.",
          },
          {
            q: "The classic saying is…",
            options: [
              "All eggs in one basket",
              "Don't put all eggs in one basket",
              "Never buy eggs",
            ],
            answer: 1,
            explain: "Spread your eggs — or your investments — around.",
          },
        ],
      },
      {
        id: "i4",
        title: "Risk vs. Time Horizon",
        minutes: 4,
        intro:
          "Your time horizon is how long until you need the money. Longer horizons can usually handle more ups and downs, because there's time to recover. Money you need next year should NOT be in volatile investments — a savings account is safer for short-term goals.",
        quiz: [
          {
            q: "Money you'll need in 6 months should be…",
            options: ["In volatile investments", "In a stable savings account", "Buried in the yard"],
            answer: 1,
            explain: "Short-term money needs stability, not upside.",
          },
          {
            q: "A longer time horizon usually means…",
            options: [
              "You can weather more short-term ups and downs",
              "Guaranteed higher returns",
              "You should avoid all risk",
            ],
            answer: 0,
            explain: "Time gives markets room to recover from dips.",
          },
          {
            q: "Risk tolerance depends on…",
            options: [
              "Your goals, timeline, and comfort",
              "The current news",
              "Your favorite color",
            ],
            answer: 0,
            explain: "It's personal — no one-size answer.",
          },
        ],
      },
    ],
  },
  {
    id: "credit",
    title: "Credit",
    emoji: "💳",
    tagline: "Understand borrowing so it works for you, not against you.",
    lessons: [
      {
        id: "c1",
        title: "What Is Credit?",
        minutes: 3,
        intro:
          "Credit is trust with a receipt. When someone lends you money, they trust you to pay it back — usually with interest. Your credit history is a record of how well you've done that. Good credit unlocks lower interest rates and more options later.",
        quiz: [
          {
            q: "Credit is basically…",
            options: ["Free money", "Borrowed money you agree to repay", "A savings account"],
            answer: 1,
            explain: "It's a loan you promise to pay back, often with interest.",
          },
          {
            q: "Your credit history tracks…",
            options: ["Your shopping style", "How reliably you repay borrowed money", "Your salary"],
            answer: 1,
            explain: "Lenders use it to gauge how risky lending to you is.",
          },
          {
            q: "Good credit typically leads to…",
            options: ["Higher interest rates", "Lower interest rates", "No difference"],
            answer: 1,
            explain: "Lower risk to lenders = cheaper borrowing for you.",
          },
        ],
      },
      {
        id: "c2",
        title: "Interest and APR",
        minutes: 4,
        intro:
          "Interest is the price of borrowing. APR (Annual Percentage Rate) shows the yearly cost of a loan or credit card. A 24% APR on a $1,000 balance costs roughly $240 a year if you carry it. Paying the full balance each month usually avoids interest entirely.",
        quiz: [
          {
            q: "APR stands for…",
            options: [
              "Annual Percentage Rate",
              "Approved Purchase Refund",
              "Automated Payment Ratio",
            ],
            answer: 0,
            explain: "APR is the yearly cost of borrowing in percent.",
          },
          {
            q: "Paying your full credit card balance monthly usually…",
            options: ["Costs more", "Avoids interest", "Hurts your credit"],
            answer: 1,
            explain: "Pay in full = the card acts like a debit card with perks.",
          },
          {
            q: "A higher APR means…",
            options: ["Borrowing is cheaper", "Borrowing is more expensive", "It has no effect"],
            answer: 1,
            explain: "Higher APR = more of every payment goes to interest.",
          },
        ],
      },
      {
        id: "c3",
        title: "Building a Credit Score",
        minutes: 4,
        intro:
          "A credit score is a number summarizing your credit history. Two of the biggest factors: paying on time, and not maxing out your available credit. Using a small portion of your limit and paying on time consistently builds a strong score over time.",
        quiz: [
          {
            q: "The biggest factor in most credit scores is…",
            options: ["Paying on time", "Your age", "Your zip code"],
            answer: 0,
            explain: "On-time payments are the foundation of a good score.",
          },
          {
            q: "Using 90% of your credit limit is…",
            options: ["Great for your score", "Generally harmful to your score", "Neutral"],
            answer: 1,
            explain: "High utilization signals stress to lenders.",
          },
          {
            q: "Building credit mostly requires…",
            options: ["A perfect month", "Consistent habits over time", "Luck"],
            answer: 1,
            explain: "Credit rewards steady behavior, not one-time wins.",
          },
        ],
      },
      {
        id: "c4",
        title: "Debt Traps to Avoid",
        minutes: 4,
        intro:
          "Not all debt is equal. High-interest revolving debt (like unpaid credit cards or payday loans) can snowball quickly. Warning signs: only making minimum payments, borrowing to pay off other borrowing, or hiding statements. If you spot these, slow down and make a plan.",
        quiz: [
          {
            q: "Making only minimum payments usually means…",
            options: ["You'll pay it off fast", "Interest keeps piling up", "The debt disappears"],
            answer: 1,
            explain: "Minimums mostly cover interest, not the actual debt.",
          },
          {
            q: "Payday loans tend to have…",
            options: ["Very low fees", "Very high effective rates", "No cost"],
            answer: 1,
            explain: "Their real APR is often extremely high.",
          },
          {
            q: "A healthy first step out of a debt trap is…",
            options: ["Ignoring the statements", "Listing what you owe and making a plan", "Borrowing more"],
            answer: 1,
            explain: "Clarity comes before strategy. Write it down.",
          },
        ],
      },
    ],
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    emoji: "🚀",
    tagline: "Turn an idea into something people actually pay for.",
    lessons: [
      {
        id: "e1",
        title: "Starting With a Real Problem",
        minutes: 3,
        intro:
          "Great businesses solve real problems for real people. Before building anything, describe: WHO has the problem, WHAT the problem is, and WHY it matters to them. If you can't answer clearly, you're guessing.",
        quiz: [
          {
            q: "The best starting point for a business is usually…",
            options: ["A cool product idea", "A real customer problem", "A trendy logo"],
            answer: 1,
            explain: "Products should serve problems, not the other way around.",
          },
          {
            q: "Which question is most useful early on?",
            options: ["What's my domain name?", "Who has this problem?", "What's my exit strategy?"],
            answer: 1,
            explain: "Knowing your customer is the anchor for everything else.",
          },
          {
            q: "If you can't describe the problem clearly, you're…",
            options: ["Ready to launch", "Probably guessing", "Guaranteed to succeed"],
            answer: 1,
            explain: "Clarity on the problem is the first real milestone.",
          },
        ],
      },
      {
        id: "e2",
        title: "MVP: The Smallest Useful Thing",
        minutes: 4,
        intro:
          "An MVP (Minimum Viable Product) is the smallest version of your idea that delivers real value and lets you learn. It's not a rough draft — it's a focused experiment. Ship it, watch what real people do, and improve from there.",
        quiz: [
          {
            q: "MVP stands for…",
            options: [
              "Most Valuable Player",
              "Minimum Viable Product",
              "Marketing Video Pitch",
            ],
            answer: 1,
            explain: "It's the smallest useful version you can put in front of users.",
          },
          {
            q: "The main goal of an MVP is to…",
            options: ["Make maximum revenue", "Learn from real users quickly", "Look perfect"],
            answer: 1,
            explain: "Learning fast beats looking perfect.",
          },
          {
            q: "You should ship your MVP when…",
            options: ["It's flawless", "It delivers one real piece of value", "Never"],
            answer: 1,
            explain: "One useful thing well is enough to start learning.",
          },
        ],
      },
      {
        id: "e3",
        title: "Simple Unit Economics",
        minutes: 4,
        intro:
          "Unit economics = how much you earn vs. spend per customer or per sale. If a coffee costs you $1 to make and you sell it for $4, your unit margin is $3. A business needs to make more per unit than it costs, and needs enough units, to survive.",
        quiz: [
          {
            q: "Unit economics ask…",
            options: [
              "How much money you make per customer or sale",
              "Your total company revenue",
              "Your Instagram followers",
            ],
            answer: 0,
            explain: "It zooms into the profit of one transaction.",
          },
          {
            q: "If a product costs $2 to make and sells for $5, unit margin is…",
            options: ["$2", "$3", "$5"],
            answer: 1,
            explain: "Sale price minus cost = unit margin.",
          },
          {
            q: "A healthy business needs…",
            options: [
              "Positive margin per unit AND enough units",
              "Just lots of users",
              "Just a fun brand",
            ],
            answer: 0,
            explain: "Margin without volume, or volume without margin, both stall.",
          },
        ],
      },
      {
        id: "e4",
        title: "Getting Your First 10 Customers",
        minutes: 4,
        intro:
          "Your first customers usually don't come from ads — they come from conversations. Talk to people who already have the problem. Offer to help them directly. Learn from every 'no.' Ten real customers teach you more than 10,000 impressions.",
        quiz: [
          {
            q: "Early customers usually come from…",
            options: ["Big ad budgets", "One-on-one conversations", "Viral luck"],
            answer: 1,
            explain: "Direct outreach and warm intros beat spray-and-pray ads early.",
          },
          {
            q: "A 'no' from an early user is…",
            options: ["A waste of time", "A source of learning", "A reason to quit"],
            answer: 1,
            explain: "Every 'no' reveals what to change or who to target.",
          },
          {
            q: "What matters most in the first 10 customers?",
            options: ["Volume", "Learning what actually works", "Perfect branding"],
            answer: 1,
            explain: "First customers are teachers as much as buyers.",
          },
        ],
      },
    ],
  },
  {
    id: "crypto",
    title: "Crypto Basics",
    emoji: "🔗",
    tagline: "Understand the technology — no hype, no trading tips.",
    lessons: [
      {
        id: "cr1",
        title: "What Is a Blockchain?",
        minutes: 3,
        intro:
          "A blockchain is a shared digital record that many computers keep in sync. Once information is added, it's very hard to change. This makes it useful for keeping honest records without a single company in charge. This lesson is about the tech — not about buying anything.",
        quiz: [
          {
            q: "A blockchain is best described as…",
            options: [
              "A shared, hard-to-change digital record",
              "A single company's database",
              "A type of currency only",
            ],
            answer: 0,
            explain: "It's a distributed ledger — many copies, kept in sync.",
          },
          {
            q: "Blockchains are useful because they…",
            options: [
              "Guarantee profits",
              "Make records hard to tamper with",
              "Replace all banks tomorrow",
            ],
            answer: 1,
            explain: "The value is tamper-resistance, not price predictions.",
          },
          {
            q: "This lesson is about…",
            options: ["Trading advice", "How the technology works", "Which coin to buy"],
            answer: 1,
            explain: "Understanding the tech is the healthy first step.",
          },
        ],
      },
      {
        id: "cr2",
        title: "Public and Private Keys",
        minutes: 4,
        intro:
          "Crypto uses pairs of keys. A public key is like an address others can send to. A private key is like a password that proves ownership — if someone else gets it, they control the assets. Never share a private key with anyone, ever.",
        quiz: [
          {
            q: "A public key is most like…",
            options: ["A password", "A mailing address", "A bank vault code"],
            answer: 1,
            explain: "Public keys are safe to share so others can send you things.",
          },
          {
            q: "A private key should be…",
            options: ["Shared freely", "Guarded like a password", "Posted online"],
            answer: 1,
            explain: "Whoever holds the private key controls the account.",
          },
          {
            q: "If someone asks for your private key, you should…",
            options: ["Send it right away", "Refuse — it's likely a scam", "Post it publicly"],
            answer: 1,
            explain: "No legitimate service ever needs your private key.",
          },
        ],
      },
      {
        id: "cr3",
        title: "Volatility and Risk",
        minutes: 4,
        intro:
          "Crypto prices can move sharply up and down in short periods — this is called volatility. That means it's not a safe place for money you can't afford to lose or that you need soon. Understanding volatility protects you from painful surprises.",
        quiz: [
          {
            q: "Volatility means…",
            options: ["Prices stay flat", "Prices swing a lot", "Prices always rise"],
            answer: 1,
            explain: "Big, fast swings — up and down — are the definition.",
          },
          {
            q: "Money for next month's rent should be…",
            options: [
              "Kept in stable, accessible savings",
              "Put into volatile assets",
              "Loaned out",
            ],
            answer: 0,
            explain: "Near-term needs belong in stable places, not volatile ones.",
          },
          {
            q: "Understanding volatility helps you…",
            options: [
              "Get rich quickly",
              "Set realistic expectations and avoid pain",
              "Time the market perfectly",
            ],
            answer: 1,
            explain: "Awareness beats prediction. Expect swings and plan for them.",
          },
        ],
      },
      {
        id: "cr4",
        title: "Spotting Scams",
        minutes: 4,
        intro:
          "If something promises guaranteed returns, pressures you to act 'right now,' or asks for your private key or seed phrase — it's almost certainly a scam. Slow down. Verify with trusted sources. Real opportunities don't require panic.",
        quiz: [
          {
            q: "A common scam red flag is…",
            options: [
              "Guaranteed returns and urgency",
              "Clear educational content",
              "Public documentation",
            ],
            answer: 0,
            explain: "Pressure + guarantees = classic scam pattern.",
          },
          {
            q: "If asked for your seed phrase, you should…",
            options: ["Share it if they seem trustworthy", "Never share it", "Post it in chat"],
            answer: 1,
            explain: "Seed phrases equal full control. Never share them.",
          },
          {
            q: "The best defense against scams is…",
            options: ["Acting fast", "Slowing down and verifying", "Trusting DMs"],
            answer: 1,
            explain: "Scams rely on urgency. Pausing usually kills them.",
          },
        ],
      },
    ],
  },
];

export const DAILY_CHALLENGES = [
  "Complete 1 lesson today to keep your streak alive.",
  "Try a lesson from a path you haven't touched yet.",
  "Finish 2 lessons today for a bonus mood boost.",
  "Explain today's lesson to a friend in one sentence.",
  "Review one lesson you found tricky last time.",
];

export function getDailyChallenge() {
  const day = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
}
