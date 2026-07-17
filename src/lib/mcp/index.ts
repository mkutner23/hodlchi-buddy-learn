import { defineMcp } from "@lovable.dev/mcp-js";
import listLearningPaths from "./tools/list-learning-paths";
import getLesson from "./tools/get-lesson";
import listMoneyBasics from "./tools/list-money-basics";
import getMoneyBasicsTopic from "./tools/get-money-basics-topic";

export default defineMcp({
  name: "hodlchi-mcp",
  title: "Hodlchi",
  version: "0.1.0",
  instructions:
    "Public read-only access to Hodlchi's financial-literacy curriculum. Use list_learning_paths and get_lesson to browse the five learning paths (Saving, Investing, Credit, Entrepreneurship, Crypto) and their 5-minute lessons with quizzes. Use list_money_basics and get_money_basics_topic to browse the Money Basics glossary. Educational content only — no trading, wallets, or investment recommendations.",
  tools: [listLearningPaths, getLesson, listMoneyBasics, getMoneyBasicsTopic],
});
