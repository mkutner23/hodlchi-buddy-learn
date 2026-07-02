import type { PathId } from "@/lib/lessons-data";

export interface MoneyBasicsTopic {
  slug: string;
  title: string;
  short: string; // used in cards + meta description base
  definition: string; // one-sentence dictionary style
  body: { heading: string; text: string }[];
  example?: string;
  faq: { q: string; a: string }[];
  ctaPath: PathId;
  ctaCopy: string;
  related: string[]; // slugs
  emoji: string;
}

export const MONEY_BASICS_TOPICS: MoneyBasicsTopic[] = [
  {
    slug: "budgeting",
    title: "What is budgeting?",
    emoji: "🧾",
    short:
      "A plain-English guide to budgeting: what it is, why it matters, and how to start one in 5 minutes.",
    definition:
      "Budgeting is the simple act of planning ahead of time where your money will go each month, so spending, saving, and paying off debt happen on purpose instead of by accident.",
    body: [
      {
        heading: "Why a budget actually helps",
        text: "A budget is not a punishment. It is a plan. When you can see what is coming in and what is going out, you stop wondering where the money went. You get to decide.",
      },
      {
        heading: "A simple frame: 50/30/20",
        text: "50% of take-home pay for needs (rent, food, transit), 30% for wants (fun, dining, hobbies), and 20% for saving and paying down debt. Adjust to your life — it is a guide, not a law.",
      },
      {
        heading: "How to start today",
        text: "Write down your monthly income, list your fixed bills, then subtract. Whatever is left is what you actually get to spend and save. That single number changes how you shop this week.",
      },
    ],
    example:
      "Earn $2,000 a month. Rent + bills = $1,100. Save $200 automatically. You now have $700 to spend on everything else — no guilt required.",
    faq: [
      {
        q: "What is the easiest budget for a beginner?",
        a: "The 50/30/20 rule. It gives you three simple buckets: needs, wants, and future you. No spreadsheets required.",
      },
      {
        q: "Do I need an app to budget?",
        a: "No. A note on your phone works. Apps help with tracking, but the habit of writing it down is the part that changes your life.",
      },
    ],
    ctaPath: "saving",
    ctaCopy: "Learn budgeting in 5 minutes with Hodlchi",
    related: ["saving", "apr", "credit-score"],
  },
  {
    slug: "saving",
    title: "What is saving?",
    emoji: "🪙",
    short:
      "Saving means setting money aside today so your future self has choices. Here is how to actually build the habit.",
    definition:
      "Saving is setting aside money you earn today — usually in a separate account — so you have cash ready for goals, surprises, and choices later.",
    body: [
      {
        heading: "Pay yourself first",
        text: "Move a small amount to savings the moment money arrives, before you spend the rest. This one habit does more than any budgeting app.",
      },
      {
        heading: "Start an emergency fund",
        text: "A common starter goal is one month of essential expenses in a separate savings account. Grow toward 3–6 months over time.",
      },
      {
        heading: "Automate it",
        text: "Willpower is limited. Automation is not. Set a recurring transfer on payday. Even $10 a week becomes over $500 a year, without any decisions.",
      },
    ],
    example:
      "If you save $25 every payday and never touch it, in a year you have $600. In five years, over $3,000 — without ever thinking about it.",
    faq: [
      {
        q: "How much should I save each month?",
        a: "A common target is 20% of take-home pay. If that feels big, start with 1% and raise it. The habit matters more than the number.",
      },
      {
        q: "Where should I keep my savings?",
        a: "In a separate savings account — not mixed with your daily spending. Separation is what stops you from tapping it by accident.",
      },
    ],
    ctaPath: "saving",
    ctaCopy: "Learn saving in 5 minutes with Hodlchi",
    related: ["budgeting", "investing", "compound-interest"],
  },
  {
    slug: "investing",
    title: "What is investing?",
    emoji: "🌱",
    short:
      "Investing means putting money into assets you expect to grow over time. Here is the beginner-friendly version.",
    definition:
      "Investing means putting money into assets — like stocks, bonds, or index funds — that you expect to grow in value over time.",
    body: [
      {
        heading: "Investing vs saving",
        text: "Savings sit safely and earn a little. Investments can grow much more over years — but they also go up and down. The trade-off is time and stability for potential growth.",
      },
      {
        heading: "What you can invest in",
        text: "Stocks (ownership in companies), bonds (loans to companies or governments), and index funds (baskets of many companies in one purchase) are the most common starting points.",
      },
      {
        heading: "The boring truth",
        text: "Most long-term investing success comes from starting early, staying consistent, and not panicking when the market dips. Time in the market beats timing the market.",
      },
    ],
    example:
      "Investing $100 a month at an average 7% return for 30 years becomes roughly $120,000 — with only $36,000 of your own money contributed.",
    faq: [
      {
        q: "Do I need a lot of money to start investing?",
        a: "No. Many index funds let you start with as little as $5 or $10. Consistency matters much more than the starting amount.",
      },
      {
        q: "Is investing risky?",
        a: "Yes — investments can lose value in the short term. But over long time periods, diversified investing has historically outpaced saving alone.",
      },
    ],
    ctaPath: "investing",
    ctaCopy: "Learn investing in 5 minutes with Hodlchi",
    related: ["compound-interest", "diversification", "inflation"],
  },
  {
    slug: "compound-interest",
    title: "What is compound interest?",
    emoji: "📈",
    short:
      "Compound interest is when your earnings start earning too. Here is why time matters more than the amount.",
    definition:
      "Compound interest is when the interest you earn also starts earning interest — so your money grows on top of previous growth, not just on your original deposit.",
    body: [
      {
        heading: "The snowball effect",
        text: "Year one, $100 at 10% becomes $110. Year two, the 10% is applied to $110, not $100. Over decades, this snowball does most of the heavy lifting.",
      },
      {
        heading: "Why starting early wins",
        text: "Someone who saves a small amount from age 20 to 30 and then stops often ends up with more than someone who starts at 30 and saves for 35 years. Time is the multiplier.",
      },
      {
        heading: "How to use it",
        text: "Automate a monthly transfer into a long-term investment account. Then leave it alone. The math works quietly in the background.",
      },
    ],
    example:
      "$1,000 growing at 8% a year with no additions becomes about $10,000 in 30 years — a 10x from doing nothing but waiting.",
    faq: [
      {
        q: "What is the difference between simple and compound interest?",
        a: "Simple interest is calculated only on your original amount. Compound interest is calculated on your original amount PLUS all the interest earned so far.",
      },
      {
        q: "When does compound interest start to feel powerful?",
        a: "The first several years feel slow. The magic usually shows up after 10–15 years, when the growth on growth outpaces your original contributions.",
      },
    ],
    ctaPath: "investing",
    ctaCopy: "Learn compound growth in 5 minutes with Hodlchi",
    related: ["investing", "saving", "inflation"],
  },
  {
    slug: "apr",
    title: "What is APR?",
    emoji: "💳",
    short:
      "APR is the yearly cost of borrowing money. Here is how to read it before you sign up for anything.",
    definition:
      "APR stands for Annual Percentage Rate — the yearly cost of borrowing money, expressed as a percentage of the amount you owe.",
    body: [
      {
        heading: "What APR is telling you",
        text: "A 24% APR on a $1,000 credit card balance costs you roughly $240 a year in interest if you carry the balance for the full year. Lower APR = cheaper borrowing.",
      },
      {
        heading: "APR vs interest rate",
        text: "For credit cards they are usually the same. For loans, APR often includes fees, so it is a more honest comparison number between two offers.",
      },
      {
        heading: "How to avoid paying it",
        text: "Pay your full credit card balance every month. When there is no leftover balance, most cards do not charge interest at all.",
      },
    ],
    example:
      "Card A has a 19% APR. Card B has a 29% APR. On a $2,000 balance carried for a year, Card A costs $380 and Card B costs $580 — a $200 difference for the same purchase.",
    faq: [
      {
        q: "Is a lower APR always better?",
        a: "For borrowing, yes. But watch fees, credit limits, and rewards too — the lowest APR is not always the best overall card.",
      },
      {
        q: "What is a good APR?",
        a: "It depends on your credit and the loan type. As a rough guide, credit cards under 20% are on the better end, and personal loans under 12% are considered strong.",
      },
    ],
    ctaPath: "credit",
    ctaCopy: "Learn credit and APR in 5 minutes with Hodlchi",
    related: ["credit-score", "budgeting", "saving"],
  },
  {
    slug: "credit-score",
    title: "What is a credit score?",
    emoji: "📊",
    short:
      "A credit score is a number that summarizes how reliably you repay borrowed money. Here is what actually moves it.",
    definition:
      "A credit score is a three-digit number (usually 300–850) that summarizes your credit history and tells lenders how risky it would be to lend to you.",
    body: [
      {
        heading: "What moves your score most",
        text: "Two things dominate: paying on time, and how much of your available credit you are using. Consistent on-time payments and low utilization are the biggest wins.",
      },
      {
        heading: "Why the score matters",
        text: "A higher score unlocks lower interest rates on car loans, mortgages, and credit cards. On a $250,000 home loan, a great score can save tens of thousands over the life of the loan.",
      },
      {
        heading: "How to build one",
        text: "Use a small amount of credit, pay it off in full every month, and never miss a due date. Time and consistency do the rest — there are no real shortcuts.",
      },
    ],
    example:
      "Using $300 of a $3,000 credit limit and paying it in full monthly keeps your utilization at 10% — a sweet spot most scoring models like.",
    faq: [
      {
        q: "What is a good credit score?",
        a: "Roughly: 670+ is considered good, 740+ is very good, and 800+ is excellent. Under 580 usually makes borrowing more expensive.",
      },
      {
        q: "Does checking my own credit score hurt it?",
        a: "No. Checking your own score is a soft inquiry and does not affect it. Hard inquiries from new loan applications can, but only slightly.",
      },
    ],
    ctaPath: "credit",
    ctaCopy: "Learn credit scores in 5 minutes with Hodlchi",
    related: ["apr", "budgeting", "saving"],
  },
  {
    slug: "inflation",
    title: "What is inflation?",
    emoji: "🎈",
    short:
      "Inflation is the slow rise in prices over time. Here is why $100 today is not $100 in ten years.",
    definition:
      "Inflation is the gradual rise in the average price of goods and services over time — which means the same dollar buys a little less each year.",
    body: [
      {
        heading: "Why it happens",
        text: "Prices rise when demand for goods grows faster than supply, when the cost of making things goes up, or when there is simply more money moving through the economy.",
      },
      {
        heading: "Why it matters for you",
        text: "Cash sitting in a low-interest account slowly loses buying power. If inflation is 3% and your savings earn 1%, you are effectively losing 2% a year in what your money can buy.",
      },
      {
        heading: "How people push back",
        text: "This is one of the main reasons long-term money is often invested rather than only saved — historically, diversified investments have grown faster than inflation over decades.",
      },
    ],
    example:
      "A candy bar that cost $0.50 in 1990 costs around $1.50 today. Same candy — the dollar just changed.",
    faq: [
      {
        q: "Is inflation always bad?",
        a: "A small, steady amount (around 2%) is considered healthy for an economy. Very high or very fast inflation is what causes real damage to household budgets.",
      },
      {
        q: "How do I protect my savings from inflation?",
        a: "Long-term money is often placed in diversified investments that have historically grown faster than inflation. Short-term money still belongs in a safe savings account.",
      },
    ],
    ctaPath: "investing",
    ctaCopy: "Learn how to outpace inflation with Hodlchi",
    related: ["investing", "compound-interest", "saving"],
  },
  {
    slug: "diversification",
    title: "What is diversification?",
    emoji: "🧺",
    short:
      "Diversification is the classic don't-put-all-your-eggs-in-one-basket idea, made practical.",
    definition:
      "Diversification is the practice of spreading money across many different investments so that no single loser can take down your whole portfolio.",
    body: [
      {
        heading: "The eggs and baskets idea",
        text: "One stock can crash. A basket of 500 companies almost never all crash at once. Spreading out reduces the damage from any single bad pick.",
      },
      {
        heading: "How beginners diversify",
        text: "The most common tool is a low-cost index fund. A single purchase can give you tiny slices of hundreds of companies at once — instant diversification.",
      },
      {
        heading: "It is not a magic shield",
        text: "Diversification lowers the risk of one bad pick wrecking you. It does not remove the risk of the overall market going down for a while. That is why time horizon still matters.",
      },
    ],
    example:
      "Instead of $1,000 in one tech stock, $1,000 in an index fund gives you a sliver of hundreds of companies across many industries.",
    faq: [
      {
        q: "How many investments do I need to be diversified?",
        a: "You do not need dozens. A single broad index fund can give you exposure to hundreds of companies in one purchase.",
      },
      {
        q: "Is diversification only for stocks?",
        a: "No. You can also diversify across asset types (stocks, bonds, cash) and across regions (domestic and international) for even more resilience.",
      },
    ],
    ctaPath: "investing",
    ctaCopy: "Learn diversification in 5 minutes with Hodlchi",
    related: ["investing", "compound-interest", "inflation"],
  },
];

export function getTopic(slug: string) {
  return MONEY_BASICS_TOPICS.find((t) => t.slug === slug);
}
